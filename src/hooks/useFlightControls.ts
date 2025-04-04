import { useEffect, useState, useMemo } from 'react';
import { FlightControls } from './useFlightPhysics'; // Import the interface

interface KeyMap {
  [key: string]: boolean;
}

// Renamed hook and changed return type
export function useFlightControls(): FlightControls {
  const [movement, setMovement] = useState<KeyMap>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setMovement((m) => ({ ...m, [e.code]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setMovement((m) => ({ ...m, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Derive the structured controls object from the key map
  const controls = useMemo((): FlightControls => {
    // Cast to 'any' temporarily until FlightControls interface is updated
    return {
      // Replace throttleChange with forwardMovement based on W/S
      forwardMovement: movement['KeyW'] ? 1 : movement['KeyS'] ? -1 : 0,
      roll: movement['KeyA'] ? 1 : movement['KeyD'] ? -1 : 0,
      pitch: movement['ArrowUp'] ? 1 : movement['ArrowDown'] ? -1 : 0,
      verticalMovement: movement['KeyQ'] ? 1 : movement['KeyE'] ? -1 : 0,
      // Remove yaw/throttleChange placeholders
    } as any;
  }, [movement]); // Recalculate only when movement state changes

  return controls;
}

// Add empty export to satisfy --isolatedModules
export {};
