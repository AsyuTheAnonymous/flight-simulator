import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// Re-import OrbitControls, keep Sky and DreiPlane
import { OrbitControls, Sky, Plane as DreiPlane } from '@react-three/drei';
import * as THREE from 'three';
import PlaneComponent from './components/Plane';

// Helper component to update OrbitControls target
function ControlsUpdater({ controlsRef, targetRef }: { controlsRef: React.RefObject<any>, targetRef: React.RefObject<THREE.Group> }) {
  useFrame(() => {
    if (controlsRef.current && targetRef.current) {
      // Update the target of OrbitControls to the plane's position
      controlsRef.current.target.copy(targetRef.current.position);
      controlsRef.current.update();
    }
  });
  return null;
}

function App() {
  const planeRef = useRef<THREE.Group>(null!);
  const controlsRef = useRef<any>(null!); // Ref for OrbitControls

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Keep camera adjustments */}
      <Canvas camera={{ position: [0, 5, 15], fov: 75 }}>
        {/* Basic Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} />

        {/* Skybox */}
        <Sky sunPosition={[100, 20, 100]} />

        {/* Ground Plane */}
        <DreiPlane
          rotation={[-Math.PI / 2, 0, 0]} // Rotate to be horizontal
          position={[0, -1, 0]} // Position slightly below the plane
          args={[1000, 1000]} // Large size
        >
          <meshStandardMaterial color="green" />
        </DreiPlane>

        {/* Use the Plane component and pass the ref */}
        <PlaneComponent ref={planeRef} position={[0, 0.5, 0]} />

        {/* Add OrbitControls back and pass its ref */}
        {/* Add distance limits */}
        <OrbitControls
          ref={controlsRef}
          minDistance={5}  // Minimum zoom distance
          maxDistance={50} // Maximum zoom distance
          enablePan={false} // Disable right-click panning
        />

        {/* Add the component to update controls target */}
        <ControlsUpdater controlsRef={controlsRef} targetRef={planeRef} />
      </Canvas>
    </div>
  );
}

export default App;
