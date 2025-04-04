import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// Add OrbitControls back, remove ChaseCamera import
import { OrbitControls, Stars, Plane as DreiPlane, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import UFOComponent from './components/Plane';
import { Tree } from './components/Tree';
// import { ChaseCamera } from './components/ChaseCamera';

// Re-add ControlsUpdater component
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

// Component to render trees using instancing
function Trees() {
  const count = 200; // Number of trees
  const range = 200; // Area to scatter trees over

  // Generate random positions for trees, memoized for performance
  const treeData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * range,
        -1, // Position trees on the ground plane (y = -1)
        (Math.random() - 0.5) * range
      ),
      scale: 1 + Math.random() * 1.5, // Random scale
      rotation: Math.random() * Math.PI, // Random rotation
    }));
  }, [count, range]);

  // Define colors outside the return for clarity
  const trunkColor = '#8B4513'; // Brown
  const leavesColor = '#228B22'; // Forest Green

  return (
    <>
      {/* Instances for Trunks */}
      <Instances limit={count} range={range * 2}>
        <cylinderGeometry args={[0.1, 0.2, 1, 8]} /> {/* Trunk Geometry */}
        <meshStandardMaterial color={trunkColor} /> {/* Trunk Material */}
        {treeData.map((data, i) => (
          <Instance
            key={"trunk_" + i}
            position={data.position.clone().add(new THREE.Vector3(0, 0.5, 0))} // Adjust position for trunk base
            scale={data.scale}
            rotation={[0, data.rotation, 0]}
          />
        ))}
      </Instances>
      {/* Instances for Leaves */}
      <Instances limit={count} range={range * 2}>
        <coneGeometry args={[0.6, 1, 16]} /> {/* Leaves Geometry */}
        <meshStandardMaterial color={leavesColor} /> {/* Leaves Material */}
        {treeData.map((data, i) => (
          <Instance
            key={"leaves_" + i}
            position={data.position.clone().add(new THREE.Vector3(0, 1.5, 0))} // Adjust position for leaves base
            scale={data.scale}
            rotation={[0, data.rotation, 0]}
          />
        ))}
      </Instances>
    </>
  );
}


function App() {
  const ufoRef = useRef<THREE.Group>(null!);
  const controlsRef = useRef<any>(null!); // Re-add OrbitControls ref

  return (
    // Remove cursor style
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Keep camera adjustments */}
      <Canvas camera={{ position: [0, 5, 15], fov: 75 }}> {/* Revert initial camera pos */}
        {/* Set dark background color */}
        <color attach="background" args={['#050510']} />
        {/* Night Lighting */}
        <ambientLight intensity={0.25} /> {/* Slightly increased ambient light */}
        {/* Dim, cool directional light (moonlight) */}
        <directionalLight position={[100, 50, 50]} intensity={0.3} color="#b0c4de" />
        {/* Remove point light or keep it very dim if needed */}
        {/* <pointLight position={[-10, -10, -10]} intensity={0.1} /> */}

        {/* Starfield */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Ground Plane - Darker color */}
        <DreiPlane
          rotation={[-Math.PI / 2, 0, 0]} // Rotate to be horizontal
          position={[0, -1, 0]} // Position slightly below the plane
          args={[1000, 1000]} // Large size
        >
          {/* Darker ground color */}
          <meshStandardMaterial color="#3c443a" />
        </DreiPlane>

        {/* Add Trees */}
        <Trees />

        {/* Use the UFO component and pass the ref */}
        <UFOComponent ref={ufoRef} position={[0, 0.5, 0]} />

        {/* Add OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          minDistance={5}
          maxDistance={50}
          // enablePan={false} // Allow panning again
        />

        {/* Add the component to update controls target */}
        <ControlsUpdater controlsRef={controlsRef} targetRef={ufoRef} />
      </Canvas>
    </div>
  );
}

export default App;
