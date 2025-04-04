import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber'; // Add useThree back
import { useControls } from 'leva';

// Define the structure for camera-relative movement + launch/up (matching useFlightControls.ts)
export interface FlightControls {
  forwardMovement: number; // -1 (S), 0, or 1 (W)
  strafeMovement: number;  // -1 (A), 0, or 1 (D)
  moveUp: boolean;         // Spacebar
  launch: boolean;         // B key (detect press later)
}

// Define Leva schema for parameters
const physicsSchema = {
  forwardMoveSpeed: { value: 5, min: 0, max: 50, step: 0.1 },
  upwardForce: { value: 15, min: 0, max: 50, step: 0.5 }, // Force for Spacebar
  launchForce: { value: 25, min: 5, max: 100, step: 1 }, // Force for B key launch
  gravity: { value: 9.81, min: 0, max: 30, step: 0.1 },
  maxRotateSpeed: { value: 3, min: 0.1, max: 10, step: 0.1 },
  rotationAcceleration: { value: 0.5, min: 0.01, max: 5, step: 0.01 },
  rotationalDamping: { value: 0.90, min: 0.5, max: 0.99, step: 0.01 },
  verticalVelocityDamping: { value: 0.98, min: 0.8, max: 0.999, step: 0.001 }, // Damping for vertical speed
};

// Rename hook back
export function useFlightPhysics(
  ufoRef: React.RefObject<THREE.Group>,
  controls: FlightControls
) {
  // Get parameters from Leva
  const {
      forwardMoveSpeed,
      upwardForce,
      launchForce,
      gravity,
      maxRotateSpeed,
      rotationAcceleration,
      rotationalDamping,
      verticalVelocityDamping,
      // Remove unused rotational params from leva destructuring
      // maxRotateSpeed, rotationAcceleration, rotationalDamping
  } = useControls('UFO Physics & Movement', physicsSchema);
  const { camera } = useThree(); // Add camera ref back

  // State Refs
  const verticalVelocity = useRef(0); // Keep vertical velocity for gravity/launch/up
  const lastLaunch = useRef(false);
  // Remove roll/pitch velocity refs

  useFrame((state, delta) => {
    if (!ufoRef.current) return;

    const ufo = ufoRef.current;
    const dt = delta;
    const isNearGround = ufo.position.y <= 0.51; // Check if near ground

    // --- Launch Logic ---
    if (controls.launch && !lastLaunch.current && isNearGround) {
      verticalVelocity.current = launchForce;
    }
    lastLaunch.current = controls.launch;

    // --- Remove Rotational Velocity Updates ---

    // --- Vertical Velocity Update ---
    let verticalAcceleration = -gravity; // Start with gravity
    if (controls.moveUp) {
      verticalAcceleration += upwardForce; // Add upward force if Space is pressed
    }
    verticalVelocity.current += verticalAcceleration * dt;
    verticalVelocity.current *= Math.pow(verticalVelocityDamping, dt * 60); // Apply damping

    // --- Apply Transformations ---
    // Remove direct rotation application

    // Calculate camera-relative movement direction
    const moveDirection = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const forwardDir = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
    const rightDir = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forwardDir).normalize();

    moveDirection.addScaledVector(forwardDir, controls.forwardMovement); // W/S
    moveDirection.addScaledVector(rightDir, controls.strafeMovement);   // A/D
    // Vertical component is handled by verticalVelocity

    // Normalize horizontal movement
    const horizontalMove = new THREE.Vector3(moveDirection.x, 0, moveDirection.z);
    if (horizontalMove.lengthSq() > 0) {
        horizontalMove.normalize();
    }

    // Apply horizontal translation
    ufo.position.x += horizontalMove.x * forwardMoveSpeed * dt;
    ufo.position.z += horizontalMove.z * forwardMoveSpeed * dt;

    // Apply vertical translation
    ufo.position.y += verticalVelocity.current * dt;

    // --- Optional: Make UFO always face forward relative to camera ---
    const targetQuaternion = new THREE.Quaternion();
    const lookTarget = new THREE.Vector3(ufo.position.x + forwardDir.x, ufo.position.y, ufo.position.z + forwardDir.z);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(lookTarget, ufo.position, ufo.up);
    targetQuaternion.setFromRotationMatrix(matrix);
    ufo.quaternion.slerp(targetQuaternion, 0.1); // Smooth rotation


    // --- Ground Collision ---
    if (ufo.position.y < 0.5) {
        ufo.position.y = 0.5;
    }
  });

  // No state to return
}

// Add empty export to satisfy --isolatedModules
export {};
