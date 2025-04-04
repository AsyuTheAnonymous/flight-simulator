import { useEffect, useState, useMemo } from 'react';
// Define the structure for camera-relative movement + launch/up
export interface FlightControls {
  forwardMovement: number; // -1 (S), 0, or 1 (W)
  strafeMovement: number;  // -1 (A), 0, or 1 (D)
  moveUp: boolean;         // Spacebar
  launch: boolean;         // B key (detect press later)
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
    // Map keys to the camera-relative control scheme
    return {
      forwardMovement: movement['KeyW'] ? 1 : movement['KeyS'] ? -1 : 0, // W/S
      strafeMovement: movement['KeyD'] ? 1 : movement['KeyA'] ? -1 : 0, // D/A for strafe right/left
      moveUp: !!movement['Space'],                                      // Spacebar
      launch: !!movement['KeyB'],                                       // B key
    };
  }, [movement]);

  return controls;
}

// Add empty export to satisfy --isolatedModules
export {};
