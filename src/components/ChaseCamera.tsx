import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ChaseCameraProps {
  targetRef: React.RefObject<THREE.Object3D>; // Ref to the object to follow (UFO)
  offset?: THREE.Vector3; // Desired camera offset from target
  damping?: number; // Smoothing factor (0-1, lower is faster)
}

export function ChaseCamera({
  targetRef,
  offset = new THREE.Vector3(0, 3, 10), // Default offset: slightly above and behind
  damping = 0.1, // Default damping
}: ChaseCameraProps) {
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    const target = targetRef.current;

    // Calculate desired camera position in world space based on target's orientation and offset
    const desiredPosition = target.localToWorld(offset.clone());

    // Smoothly interpolate camera position
    camera.position.lerp(desiredPosition, damping);

    // Make camera look at the target's position
    // Look slightly above the target's base for better framing
    const lookAtPosition = target.position.clone().add(new THREE.Vector3(0, 0.5, 0));
    camera.lookAt(lookAtPosition);

    // Important: Update projection matrix if aspect ratio changes or after lookAt
    // camera.updateProjectionMatrix(); // Usually handled by R3F, but good practice if issues arise
  });

  return null; // This component doesn't render anything itself
}

// Add empty export to satisfy --isolatedModules
export {};
