import React from 'react';
import * as THREE from 'three';

// Simple tree model using basic shapes
export function Tree() {
  const trunkColor = '#8B4513'; // Brown
  const leavesColor = '#228B22'; // Forest Green

  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}> {/* Position so base is at y=0 */}
        <cylinderGeometry args={[0.1, 0.2, 1, 8]} /> {/* TopRadius, BottomRadius, Height, Segments */}
        <meshStandardMaterial color={trunkColor} />
      </mesh>
      {/* Leaves (Cone) */}
      <mesh position={[0, 1.5, 0]}> {/* Position above trunk */}
        <coneGeometry args={[0.6, 1, 16]} /> {/* Radius, Height, Segments */}
        <meshStandardMaterial color={leavesColor} />
      </mesh>
    </group>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
