import { useEffect, useState, useMemo } from 'react';

// Define interface for simple directional flags
export interface DirectionalControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface KeyMap {
  [key: string]: boolean;
}

// Update hook name and return type
export function useDirectionalControls(): DirectionalControls {
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

  // Derive the boolean flags from the key map
  const controls = useMemo((): DirectionalControls => {
    return {
      forward: !!movement['KeyW'],
      backward: !!movement['KeyS'],
      left: !!movement['KeyA'],
      right: !!movement['KeyD'],
      up: !!movement['KeyQ'], // Q for Up
      down: !!movement['KeyE'], // E for Down
    };
  }, [movement]); // Recalculate only when movement state changes

  return controls;
}

// Add empty export to satisfy --isolatedModules
export {};
