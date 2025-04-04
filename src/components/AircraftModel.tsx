import React from 'react';
import * as THREE from 'three';

// Simple UFO model using basic shapes
export function AircraftModel() {
  const ufoBodyColor = '#aaaaaa';
  const ufoDomeColor = '#99ccff';

  return (
    <> {/* Use fragment as the parent group is in Plane.tsx */}
      {/* Main Saucer Body (Flattened Sphere) */}
      <mesh position={[0, 0, 0]} scale={[2, 0.4, 2]}> {/* Scale Y down */}
        <sphereGeometry args={[1, 32, 16]} /> {/* Radius, WidthSegments, HeightSegments */}
        <meshStandardMaterial color={ufoBodyColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Cockpit Dome */}
      <mesh position={[0, 0.3, 0]}> {/* Position slightly above the saucer center */}
        <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /> {/* Half-sphere */}
        <meshStandardMaterial color={ufoDomeColor} transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Optional: Bottom Light/Engine */}
      <mesh position={[0, -0.25, 0]}>
         <cylinderGeometry args={[0.3, 0.5, 0.1, 32]} /> {/* TopRadius, BottomRadius, Height, RadialSegments */}
         <meshStandardMaterial color={'yellow'} emissive={'yellow'} emissiveIntensity={1} />
      </mesh>
    </>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
