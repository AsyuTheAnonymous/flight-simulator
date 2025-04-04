import React, { useRef } from 'react'; // Add useRef back
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
// Import the new controls hook, remove the old one
import { useFlightControls } from '../hooks/useFlightControls';
// Import the physics hook (will be used later)
import { useFlightPhysics } from '../hooks/useFlightPhysics';
import { AircraftModel } from './AircraftModel'; // Import the model component

// Basic placeholder for the plane model
// Wrap with forwardRef to accept the ref from App.tsx
const Plane = React.forwardRef<THREE.Group, any>((props, ref) => {
  // Directly use the forwarded ref. App.tsx guarantees it's provided.
  const meshRef = ref as React.RefObject<THREE.Group>;
  // Use the new controls hook
  const controls = useFlightControls();

  // Call the physics hook to apply physics based on controls
  // This hook now handles all the state refs and useFrame logic internally
  useFlightPhysics(meshRef, controls);

  // The component now only needs to render the visual model
  return (
    // Assign the ref to the group
    <group {...props} ref={meshRef}>
      {/* Render the visual model component */}
      <AircraftModel />
    </group>
  );
}); // Close forwardRef

export default Plane;

// Add empty export to satisfy --isolatedModules
export {};
