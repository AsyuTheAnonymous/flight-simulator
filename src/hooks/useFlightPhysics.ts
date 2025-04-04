import { useRef, useMemo } from 'react'; // Import useMemo
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva'; // Import leva

// Define the structure for control inputs
export interface FlightControls {
  forwardMovement: number; // -1 (backward), 0, or 1 (forward)
  roll: number; // -1, 0, or 1 (representing target direction)
  pitch: number; // -1, 0, or 1
  verticalMovement: number; // -1 (down), 0, or 1 (up)
}

// Define the structure for the physics state returned by the hook
export interface FlightPhysicsState {
  throttle: number;
  forwardVelocity: number;
  verticalVelocity: number;
  // Position and orientation will be managed by the component using the hook
}

// Define Leva schema for physics parameters
const physicsSchema = {
  gravity: { value: 9.81, min: 0, max: 20, step: 0.1 },
  liftCoefficient: { value: 0.05, min: 0, max: 0.5, step: 0.001 },
  dragCoefficient: { value: 0.001, min: 0, max: 0.01, step: 0.0001 },
  thrustForce: { value: 50, min: 0, max: 200, step: 1 },
  throttleSensitivity: { value: 0.02, min: 0.001, max: 0.1, step: 0.001 },
  maxRotateSpeed: { value: 3, min: 0.1, max: 10, step: 0.1 },
  rotationAcceleration: { value: 0.5, min: 0.01, max: 5, step: 0.01 },
  rotationalDamping: { value: 0.90, min: 0.5, max: 0.99, step: 0.01 },
  verticalMoveSpeed: { value: 5, min: 0, max: 20, step: 0.1 }, // Speed for Q/E movement
  forwardMoveSpeed: { value: 5, min: 0, max: 50, step: 0.1 }, // Speed for W/S movement
};

export function useFlightPhysics(
  planeRef: React.RefObject<THREE.Group>,
  controls: FlightControls // Use the structured controls input
) {
  // Get physics parameters from Leva controls
  const {
      maxRotateSpeed,
      rotationAcceleration,
      rotationalDamping,
      verticalMoveSpeed,
      forwardMoveSpeed, // Get forward speed from leva
      // gravity, liftCoefficient, dragCoefficient, thrustForce, throttleSensitivity // Removed
  } = useControls('Physics', physicsSchema);


  // --- State Refs ---
  // Remove throttle, forwardVelocity, verticalVelocity refs
  const rollVelocity = useRef(0);
  const pitchVelocity = useRef(0);
  // Remove yawVelocity ref as yaw control is removed
  // const yawVelocity = useRef(0);

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    const currentPlane = planeRef.current;
    const dt = delta;

    // --- Remove Throttle, Force, and related Velocity calculations ---

    // --- Rotational Velocity Updates (Roll, Pitch) ---
    const updateRotationalVelocity = (
        currentVelocityRef: React.MutableRefObject<number>,
        targetDirection: number // -1, 0, or 1
    ) => {
        // Use leva values
        const targetVelocity = targetDirection * maxRotateSpeed;
        if (targetVelocity !== currentVelocityRef.current) {
            const direction = Math.sign(targetVelocity - currentVelocityRef.current);
            currentVelocityRef.current += direction * rotationAcceleration * dt;
            if (direction > 0) currentVelocityRef.current = Math.min(currentVelocityRef.current, targetVelocity);
            else currentVelocityRef.current = Math.max(currentVelocityRef.current, targetVelocity);
        }
        if (targetDirection === 0) {
            currentVelocityRef.current *= Math.pow(rotationalDamping, dt * 60);
            if (Math.abs(currentVelocityRef.current) < 0.01) currentVelocityRef.current = 0;
        }
    };

    updateRotationalVelocity(rollVelocity, controls.roll);
    updateRotationalVelocity(pitchVelocity, controls.pitch);
    // Yaw is removed

    // --- Apply Transformations ---
    // Rotation (Roll and Pitch only)
    currentPlane.rotateZ(rollVelocity.current * dt);
    currentPlane.rotateX(pitchVelocity.current * dt);

    // Translation (Direct W/S and Q/E)
    // Use forwardMovement from controls and forwardMoveSpeed from leva
    if (controls.forwardMovement !== 0) {
        currentPlane.translateZ(-controls.forwardMovement * forwardMoveSpeed * dt);
    }
    // Use verticalMovement from controls and verticalMoveSpeed from leva
    if (controls.verticalMovement !== 0) {
      currentPlane.position.y += controls.verticalMovement * verticalMoveSpeed * dt;
    }

    // --- Ground Collision (Simplified) ---
    if (currentPlane.position.y < 0.5) {
        currentPlane.position.y = 0.5;
        // Stop vertical velocity if any existed (though it shouldn't with direct control)
    }
  });

  // Return relevant state if needed by other components (e.g., HUD)
  // For now, the hook primarily modifies the ref directly
  // We might return refs instead if direct mutation is discouraged
  // return {
  //   throttle: throttle.current,
  //   forwardVelocity: forwardVelocity.current,
  //   verticalVelocity: verticalVelocity.current,
  // };
}

// Add empty export to satisfy --isolatedModules
export {};
