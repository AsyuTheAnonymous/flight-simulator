import { useEffect, useState, useMemo } from 'react';
// Define the structure for camera-relative movement controls
export interface FlightControls {
  forwardMovement: number; // -1 (S), 0, or 1 (W)
  strafeMovement: number;  // -1 (A), 0, or 1 (D)
  verticalMovement: number; // -1 (E), 0, or 1 (Q)
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
    // Map WASDQE keys to the new structure
    return {
      forwardMovement: movement['KeyW'] ? 1 : movement['KeyS'] ? -1 : 0,
      strafeMovement: movement['KeyD'] ? 1 : movement['KeyA'] ? -1 : 0, // D=Right(+1), A=Left(-1)
      verticalMovement: movement['Space'] ? 1 : movement['KeyE'] ? -1 : 0, // Space=Up(+1), E=Down(-1)
    };
  }, [movement]);

  return controls;
}

// Add empty export to satisfy --isolatedModules
export {};
