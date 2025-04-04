import React from 'react';
import * as THREE from 'three';

// Enhanced UFO model using basic shapes
export function AircraftModel() {
  const bodyColor = '#b0b0b0'; // Metallic grey
  const domeColor = '#aaddff'; // Light blue tint
  const ringColor = '#888888'; // Darker grey
  const lightColor = '#ffff00'; // Yellow

  return (
    <> {/* Use fragment as the parent group is in Plane.tsx */}
      {/* Main Saucer Body (Flattened Cylinder) */}
      <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Outer Ring */}
      <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.15, 16, 48]} />
        <meshStandardMaterial color={ringColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Cockpit Dome (Shadow casting might look weird with transparency) */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={domeColor} transparent opacity={0.5} roughness={0.1} />
      </mesh>

      {/* Bottom Light/Engine (Doesn't need to cast shadow) */}
      <mesh position={[0, -0.25, 0]}>
         <cylinderGeometry args={[0.4, 0.6, 0.1, 32]} />
         <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={1.5} />
      </mesh>

      {/* Optional: Small lights on the ring (Don't need to cast shadows) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh key={`light_${i}`} position={[Math.cos(angle) * 1.65, 0, Math.sin(angle) * 1.65]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={'red'} emissive={'red'} emissiveIntensity={2} />
        </mesh>
      ))}
    </>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
