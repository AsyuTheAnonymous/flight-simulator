import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber'; // Remove useThree
import { useControls } from 'leva';

// Define the correct structure for control inputs expected by this hook
export interface FlightControls {
  forwardMovement: number; // -1 (backward), 0, or 1 (forward)
  roll: number; // -1, 0, or 1 (representing target direction)
  pitch: number; // -1, 0, or 1
  verticalMovement: number; // -1 (down), 0, or 1 (up)
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
  // Get parameters from Leva
  const {
      forwardMoveSpeed,
      verticalMoveSpeed,
      maxRotateSpeed,
      rotationAcceleration,
      rotationalDamping
  } = useControls('Movement & Rotation', physicsSchema); // Updated Leva group name
  // Remove camera ref

  // Add back rotational velocity refs
  const rollVelocity = useRef(0);
  const pitchVelocity = useRef(0);

  useFrame((state, delta) => {
    if (!planeRef.current) return; // Use planeRef

    const ufo = planeRef.current; // Use planeRef
    const dt = delta;

    // --- Rotational Velocity Updates (Roll & Pitch) ---
    const updateRotationalVelocity = (
        currentVelocityRef: React.MutableRefObject<number>,
        targetDirection: number // -1, 0, or 1
    ) => {
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

    // --- Apply Transformations ---
    // Rotation (Roll and Pitch only)
    ufo.rotateZ(rollVelocity.current * dt);
    ufo.rotateX(pitchVelocity.current * dt);

    // Translation (Direct W/S and Q/E)
    if (controls.forwardMovement !== 0) {
        ufo.translateZ(-controls.forwardMovement * forwardMoveSpeed * dt);
    }
    if (controls.verticalMovement !== 0) {
      ufo.position.y += controls.verticalMovement * verticalMoveSpeed * dt;
    }

    // --- Ground Collision ---
    if (ufo.position.y < 0.5) {
        ufo.position.y = 0.5;
    }
  });

  // No state to return
}

// Add empty export to satisfy --isolatedModules
export {};
