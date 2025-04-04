import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';
// We don't import CornStalk anymore as we define geometry here

interface CornfieldProps {
  position?: [number, number, number];
  fieldSize?: [number, number]; // Width (X), Depth (Z)
  stalkDensity?: number; // Stalks per square unit (approx)
}

// Define leaf geometries and their relative transforms
const leafTransforms = [
  { geoArgs: [0.8, 0.15] as [number, number], pos: new THREE.Vector3(0, 0.5, 0.1), rot: new THREE.Euler(0, 0, -0.5) },
  { geoArgs: [0.9, 0.18] as [number, number], pos: new THREE.Vector3(0, 0.8, -0.1), rot: new THREE.Euler(0, Math.PI, 0.4) },
  { geoArgs: [0.7, 0.16] as [number, number], pos: new THREE.Vector3(0, 1.1, 0.1), rot: new THREE.Euler(0, 0, -0.3) },
];

// Define stalk geometry args
const stalkGeoArgs: [number, number, number, number] = [0.05, 0.08, 1.5, 6];

// Define colors
const stalkColor = '#a0a85a';
const leafColor = '#55a055';

export function Cornfield({
  position = [0, -1, 0], // Default position on the ground plane
  fieldSize = [50, 50], // Default 50x50 area
  stalkDensity = 0.5, // Default density
}: CornfieldProps) {

  const count = Math.floor(fieldSize[0] * fieldSize[1] * stalkDensity);
  const rangeX = fieldSize[0];
  const rangeZ = fieldSize[1];

  // Generate random positions and rotations for stalks
  const stalkData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * rangeX,
        0, // Base position Y relative to the group
        (Math.random() - 0.5) * rangeZ
      ),
      scale: 0.8 + Math.random() * 0.4,
      rotationY: Math.random() * Math.PI * 2,
    }));
  }, [count, rangeX, rangeZ]);

  // Helper objects for calculations
  const tempObject = useMemo(() => new THREE.Object3D(), []); // For composing transforms
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []); // For leaf rotation
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []); // Matrix for leaf relative transform
  const finalMatrix = useMemo(() => new THREE.Matrix4(), []); // Final world matrix for instance

  return (
    <group position={position}>
      {/* Instances for Stalks */}
      <Instances limit={count} castShadow receiveShadow>
        <cylinderGeometry args={stalkGeoArgs} />
        <meshStandardMaterial color={stalkColor} />
        {stalkData.map((data, i) => {
          tempEuler.set(0, data.rotationY, 0);
          tempObject.position.copy(data.position).add(tempVec.set(0, stalkGeoArgs[2] / 2, 0)); // Adjust base position
          tempObject.rotation.copy(tempEuler);
          tempObject.scale.setScalar(data.scale);
          tempObject.updateMatrix();
          return <Instance key={`stalk_${i}`} matrix={tempObject.matrix} />;
        })}
      </Instances>

      {/* Create separate Instances for each leaf type */}
      {leafTransforms.map((leaf, leafIndex) => (
        <Instances key={`leaf_type_${leafIndex}`} limit={count} castShadow receiveShadow>
          <planeGeometry args={leaf.geoArgs} />
          <meshStandardMaterial color={leafColor} side={THREE.DoubleSide} />
          {stalkData.map((data, stalkIndex) => {
            // Apply stalk's transform first, then leaf's relative transform
            tempEuler.set(0, data.rotationY, 0); // Stalk rotation
            tempObject.position.copy(data.position);
            tempObject.rotation.copy(tempEuler);
            tempObject.scale.setScalar(data.scale);
            tempObject.updateMatrix(); // Stalk's world matrix is now in tempObject.matrix

            // Create the leaf's local transformation matrix
            tempQuat.setFromEuler(leaf.rot); // Use Quaternion for leaf rotation
            tempMatrix.compose(leaf.pos, tempQuat, tempVec.set(1, 1, 1)); // Position, Rotation, Scale (leaf scale is 1 relative to stalk)

            // Multiply stalk's world matrix by leaf's local matrix
            finalMatrix.multiplyMatrices(tempObject.matrix, tempMatrix);

            // Use the final world matrix for the instance
            return <Instance key={`stalk_${stalkIndex}_leaf_${leafIndex}`} matrix={finalMatrix} />;
          })}
        </Instances>
      ))}
    </group>
  );
}

// Add empty export to satisfy --isolatedModules
export {};
