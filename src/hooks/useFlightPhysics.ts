import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber'; // Add useThree back
import { useControls } from 'leva';

// Define the structure for camera-relative movement controls (matching useFlightControls.ts)
export interface FlightControls {
  forwardMovement: number; // -1 (S), 0, or 1 (W)
  strafeMovement: number;  // -1 (A), 0, or 1 (D)
  verticalMovement: number; // -1 (E), 0, or 1 (Q)
}

// Define Leva schema for physics/movement parameters
const physicsSchema = {
  forwardMoveSpeed: { value: 5, min: 0, max: 50, step: 0.1 }, // Speed for W/S movement
  verticalMoveSpeed: { value: 5, min: 0, max: 20, step: 0.1 }, // Speed for Q/E movement
  maxRotateSpeed: { value: 3, min: 0.1, max: 10, step: 0.1 },
  rotationAcceleration: { value: 0.5, min: 0.01, max: 5, step: 0.01 },
  rotationalDamping: { value: 0.90, min: 0.5, max: 0.99, step: 0.01 },
};

// Rename hook back to useFlightPhysics
export function useFlightPhysics(
  planeRef: React.RefObject<THREE.Group>, // Use planeRef again
  controls: FlightControls // Expect the correct FlightControls interface
) {
  // Get parameters from Leva (only need move speeds now)
  const {
      forwardMoveSpeed,
      verticalMoveSpeed,
      // maxRotateSpeed, rotationAcceleration, rotationalDamping // Remove rotational params
  } = useControls('Movement', physicsSchema); // Simplified Leva group name
  const { camera } = useThree(); // Get camera reference

  // Remove rotational velocity refs

  useFrame((state, delta) => {
    if (!planeRef.current || !camera) return; // Use planeRef and add camera guard

    const ufo = planeRef.current;
    const dt = delta;

    // --- Calculate Movement Direction based on Camera ---
    const moveDirection = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const forwardDir = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
    const rightDir = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forwardDir).normalize();

    // Apply movement based on controls input (-1, 0, or 1)
    moveDirection.addScaledVector(forwardDir, controls.forwardMovement); // W/S
    moveDirection.addScaledVector(rightDir, controls.strafeMovement);   // A/D
    moveDirection.y += controls.verticalMovement;                      // Q/E

    // Normalize if moving diagonally
    if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize();
    }

    // --- Apply Translation ---
    // Use combined move speed for now, adjustable via leva
    ufo.position.addScaledVector(moveDirection, forwardMoveSpeed * dt); // Using forwardMoveSpeed for all directions

    // --- Ground Collision ---
    if (ufo.position.y < 0.5) {
        ufo.position.y = 0.5;
    }
  });

  // No state to return
}

// Add empty export to satisfy --isolatedModules
export {};
