import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ManualCameraOffsetProps {
  targetRef: React.RefObject<THREE.Object3D>; // Ref to the object to keep in view (UFO)
  controlsRef: React.RefObject<any>; // Ref to OrbitControls
}

export function ManualCameraOffset({ targetRef, controlsRef }: ManualCameraOffsetProps) {
  const { camera } = useThree();
  const lastTargetPos = useRef(new THREE.Vector3()); // Store the last known target position

  useEffect(() => {
    // Initialize lastTargetPos when controls are ready
    if (controlsRef.current) {
      lastTargetPos.current.copy(controlsRef.current.target);
    }
  }, [controlsRef]);

  useFrame(() => {
    if (targetRef.current && controlsRef.current && controlsRef.current.target) {
      const target = targetRef.current;
      const controlsTarget = controlsRef.current.target as THREE.Vector3;

      // Calculate how much the UFO has moved since the last frame relative to the controls target
      const deltaPos = target.position.clone().sub(lastTargetPos.current);

      // Apply this delta to both the camera position and the controls target
      // This keeps the relative offset between camera and target consistent
      if (deltaPos.lengthSq() > 0.0001) { // Only update if there's movement
          camera.position.add(deltaPos);
          controlsTarget.add(deltaPos);

          // Update the stored last position
          lastTargetPos.current.copy(target.position);

          // Force OrbitControls to update its internal state after manual adjustments
          controlsRef.current.update();
      }
    } else if (targetRef.current) {
        // Fallback if controls aren't ready yet, store current pos
        lastTargetPos.current.copy(targetRef.current.position);
    }
  });

  return null; // This component doesn't render anything itself
}

// Add empty export to satisfy --isolatedModules
export {};
