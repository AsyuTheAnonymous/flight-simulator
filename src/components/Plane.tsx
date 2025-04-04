import React, { useRef } from 'react'; // Add useRef back
import * as THREE from 'three';
// Remove useFrame/useThree imports as they are handled by the hook
// import { useFrame, useThree } from '@react-three/fiber';
// Import the flight controls hook
import { useFlightControls } from '../hooks/useFlightControls';
// Import the physics hook from the correct file
import { useFlightPhysics } from '../hooks/useFlightPhysics'; // Correct path and hook name
import { AircraftModel } from './AircraftModel';

// Component remains named UFO but uses flight controls/physics
const UFO = React.forwardRef<THREE.Group, any>((props, ref) => {
  // Use the forwarded ref again for physics hook
  const meshRef = ref as React.RefObject<THREE.Group>;
  // Use the flight controls hook
  const controls = useFlightControls();

  // Use the physics hook
  useFlightPhysics(meshRef, controls); // Correct hook call

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
