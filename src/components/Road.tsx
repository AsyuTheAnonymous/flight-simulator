import React from 'react';
import * as THREE from 'three';

interface RoadProps {
  position?: [number, number, number];
  length?: number;
  width?: number;
}

export function Road({
  position = [0, -0.99, 0], // Position slightly above ground plane
  length = 500,
  width = 10,
}: RoadProps) {
  const roadColor = '#444444'; // Dark grey asphalt

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]} // Rotate flat on XZ plane
      receiveShadow // Allow road to receive shadows
    >
      <planeGeometry args={[width, length]} /> {/* Width, Height (becomes Length due to rotation) */}
      <meshStandardMaterial color={roadColor} />
    </mesh>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
