import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';

interface CitySkylineProps {
  position?: [number, number, number];
  buildingCount?: number;
  spread?: number; // How far the city spreads horizontally
  maxHeight?: number;
  minHeight?: number;
}

export function CitySkyline({
  position = [0, -1, -400], // Position far in the distance
  buildingCount = 100,
  spread = 300,
  maxHeight = 50,
  minHeight = 10,
}: CitySkylineProps) {

  const buildingData = useMemo(() => {
    return Array.from({ length: buildingCount }).map(() => {
      const height = minHeight + Math.random() * (maxHeight - minHeight);
      const width = 5 + Math.random() * 10;
      const depth = 5 + Math.random() * 10;
      return {
        // Position relative to the CitySkyline group's position
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          height / 2, // Position base on the ground (y=0 relative to group)
          (Math.random() - 0.5) * (spread / 3) // Less spread in depth
        ),
        scale: new THREE.Vector3(width, height, depth), // Use scale for dimensions
      };
    });
  }, [buildingCount, spread, maxHeight, minHeight]);

  const buildingColor = '#606070'; // Greyish color

  return (
    <group position={position}>
      <Instances limit={buildingCount} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} /> {/* Unit cube geometry */}
        <meshStandardMaterial color={buildingColor} roughness={0.7} metalness={0.3} />
        {buildingData.map((data, i) => (
          <Instance
            key={i}
            position={data.position}
            scale={data.scale} // Apply calculated dimensions via scale
          />
        ))}
      </Instances>
    </group>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
