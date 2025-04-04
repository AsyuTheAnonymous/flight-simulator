import React from 'react';
import * as THREE from 'three';

// Simple Corn Stalk model
export function CornStalk() {
  const stalkColor = '#a0a85a'; // Yellowish-green
  const leafColor = '#55a055'; // Green

  return (
    <group>
      {/* Main Stalk */}
      <mesh castShadow position={[0, 0.75, 0]}> {/* Position base at y=0 */}
        <cylinderGeometry args={[0.05, 0.08, 1.5, 6]} /> {/* radiusTop, radiusBottom, height, radialSegments */}
        <meshStandardMaterial color={stalkColor} />
      </mesh>
      {/* Simple Leaves (using planes) - adjust rotation/position for variety */}
      <mesh castShadow position={[0, 0.5, 0.1]} rotation={[0, 0, -0.5]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshStandardMaterial color={leafColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow position={[0, 0.8, -0.1]} rotation={[0, Math.PI, 0.4]}>
        <planeGeometry args={[0.9, 0.18]} />
        <meshStandardMaterial color={leafColor} side={THREE.DoubleSide} />
      </mesh>
       <mesh castShadow position={[0, 1.1, 0.1]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.7, 0.16]} />
        <meshStandardMaterial color={leafColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
