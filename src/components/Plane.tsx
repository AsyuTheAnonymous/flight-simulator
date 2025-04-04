import React, { useRef, useEffect } from 'react'; // Add useEffect
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber'; // Add useThree
// Import the directional controls hook
import { useDirectionalControls } from '../hooks/useFlightControls'; // Corrected hook name
// Remove physics hook import again
// import { useFlightPhysics } from '../hooks/useFlightPhysics';
import { AircraftModel } from './AircraftModel';

// Component remains named UFO but uses flight controls/physics
const UFO = React.forwardRef<THREE.Group, any>((props, ref) => {
  // Use the forwarded ref again for physics hook
  const meshRef = ref as React.RefObject<THREE.Group>;
  // Use the directional controls hook
  const controls = useDirectionalControls();
  const { camera } = useThree(); // Get camera reference

  // Remove physics hook call
  // useFlightPhysics(meshRef, controls);

  // Add useFrame back for movement logic
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const ufo = meshRef.current;
    const dt = delta;
    const moveSpeed = 5; // Adjust speed as needed

    // --- Calculate Movement Direction based on Camera ---
    const moveDirection = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection); // Get camera's forward direction

    // Project camera direction onto the horizontal plane (XZ)
    const forwardDir = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
    // Calculate the right direction (90 degrees rotation on Y axis)
    const rightDir = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forwardDir).normalize();

    // Apply movement based on keys relative to camera
    if (controls.forward) moveDirection.add(forwardDir);
    if (controls.backward) moveDirection.sub(forwardDir);
    if (controls.left) moveDirection.sub(rightDir); // Subtract right to go left
    if (controls.right) moveDirection.add(rightDir);

    // Apply vertical movement directly
    if (controls.up) moveDirection.y += 1;
    if (controls.down) moveDirection.y -= 1;

    // Normalize the final direction vector if it has magnitude
    if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize();
    }

    // --- Apply Translation ---
    // Move instantly based on direction and speed
    ufo.position.addScaledVector(moveDirection, moveSpeed * dt);

    // --- Ground Collision (Simplified) ---
     if (ufo.position.y < 0.5) {
        ufo.position.y = 0.5;
    }

  });


  // The component now only needs to render the visual model
  return (
    // Assign the ref to the group
    <group {...props} ref={meshRef}>
      {/* Render the visual model component */}
      <AircraftModel />
    </group>
  );
});

export default UFO; // Export renamed component

// Add empty export to satisfy --isolatedModules
export {};
