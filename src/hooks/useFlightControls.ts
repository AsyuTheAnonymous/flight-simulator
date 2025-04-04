import { useEffect, useState, useMemo } from 'react';
// Import the FlightControls interface (assuming it exists in useFlightPhysics or define here)
// Let's define it here for clarity if useFlightPhysics is removed/changed
export interface FlightControls {
  forwardMovement: number; // -1 (backward), 0, or 1 (forward)
  roll: number; // -1, 0, or 1 (representing target direction)
  pitch: number; // -1, 0, or 1
  verticalMovement: number; // -1 (down), 0, or 1 (up)
}


interface KeyMap {
  [key: string]: boolean;
}

// Revert hook name and return type
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
    // Map keys back to the FlightControls structure
    return {
      forwardMovement: movement['KeyW'] ? 1 : movement['KeyS'] ? -1 : 0,
      roll: movement['KeyA'] ? 1 : movement['KeyD'] ? -1 : 0,
      pitch: movement['ArrowUp'] ? 1 : movement['ArrowDown'] ? -1 : 0,
      verticalMovement: movement['KeyQ'] ? 1 : movement['KeyE'] ? -1 : 0,
    };
  }, [movement]); // Recalculate only when movement state changes

  return controls;
}

// Add empty export to satisfy --isolatedModules
export {};
