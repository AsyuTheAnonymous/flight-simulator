import React, { useRef, useMemo, useState } from 'react'; // Import useState
import { Canvas, useFrame } from '@react-three/fiber';
// Add Sky back
import { OrbitControls, Sky, Stars, Plane as DreiPlane, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import UFOComponent from './components/Plane';
import { Tree } from './components/Tree';
// import { ChaseCamera } from './components/ChaseCamera';
import { ManualCameraOffset } from './components/ManualCameraOffset';
import { Cornfield } from './components/Cornfield';
import { Road } from './components/Road';
import { CitySkyline } from './components/CitySkyline'; // Import City

// Remove ControlsUpdater component definition

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
      <Instances castShadow limit={count} range={range * 2}> {/* Add castShadow */}
        <cylinderGeometry args={[0.1, 0.2, 1, 8]} />
        <meshStandardMaterial color={trunkColor} />
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
      <Instances castShadow limit={count} range={range * 2}> {/* Add castShadow */}
        <coneGeometry args={[0.6, 1, 16]} />
        <meshStandardMaterial color={leavesColor} />
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
  const controlsRef = useRef<any>(null!);
  const [isDaytime, setIsDaytime] = useState(true); // State for day/night

  // Example sun position for daytime Sky
  const sunPosition = useMemo(() => new THREE.Vector3(100, 50, 100), []);

  return (
    // Remove cursor style
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Keep camera adjustments */}
      {/* Enable shadows on the Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 75 }}>
        {/* Remove dark background color */}
        {/* <color attach="background" args={['#050510']} /> */}

        {/* Add distance fog */}
        {/* Use a color that matches the sky or a neutral grey */}
        <fog attach="fog" args={['#aaccff', 100, 500]} /> {/* color, near, far */}

        {/* Daytime Lighting */}
        <ambientLight intensity={0.6} /> {/* Brighter ambient light */}
        {/* Brighter, warmer directional light */}
        <directionalLight
          castShadow
          position={sunPosition} // Use defined sun position
          intensity={1.0} // Brighter intensity
          color="#ffffff" // White light
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={150}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />

        {/* Conditional Sky/Stars */}
        {isDaytime ? (
          <Sky sunPosition={sunPosition} />
        ) : (
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        )}

        {/* Ground Plane - Earthy color */}
        <DreiPlane
          receiveShadow // Enable shadow receiving
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
          args={[1000, 1000]}
        >
          {/* Earthy brown color */}
          <meshStandardMaterial color="#8B4513" />
        </DreiPlane>

        {/* Add Trees (Maybe remove these if cornfield is added?) */}
        {/* <Trees /> */}

        {/* Add Cornfield */}
        {/* Position it slightly forward and to the side */}
        <Cornfield position={[50, -1, -50]} fieldSize={[100, 100]} stalkDensity={0.8} />

        {/* Add Road */}
        <Road position={[0, -0.99, -100]} length={400} />

        {/* Add City Skyline in the distance */}
        <CitySkyline position={[0, -1, -300]} /> {/* Adjust Z position as needed */}

        {/* Use the UFO component and pass the ref */}
        <UFOComponent ref={ufoRef} position={[0, 0.5, 0]} />

        {/* Add OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          minDistance={5}
          maxDistance={50}
          // enablePan={false} // Allow panning again
        />

        {/* Add the manual camera offset component */}
        <ManualCameraOffset targetRef={ufoRef} controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

export default App;
