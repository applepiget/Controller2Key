import { useState, useEffect, useRef } from 'react';
import { GamepadState } from '../types';

export const useGamepad = () => {
  const [gamepad, setGamepad] = useState<GamepadState | null>(null);
  const requestRef = useRef<number>();

  const scanGamepads = () => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    // Just take the first connected gamepad for this demo
    const gp = gamepads[0];

    if (gp) {
      const state: GamepadState = {
        id: gp.id,
        connected: gp.connected,
        buttons: gp.buttons.map((b) => b.pressed),
        axes: [...gp.axes],
        timestamp: gp.timestamp,
      };
      
      // Only update state if something changed (deep comparison optimization omitted for simplicity in loop, 
      // but React state updates batching helps. For high perf, might need reference check or custom comparison)
      // Actually, updating state every frame will cause re-render every frame (60fps). 
      // This is expected for a visualizer.
      setGamepad(state);
    } else {
      setGamepad(null);
    }

    requestRef.current = requestAnimationFrame(scanGamepads);
  };

  useEffect(() => {
    window.addEventListener('gamepadconnected', (e) => {
      console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('Gamepad disconnected from index %d: %s',
        e.gamepad.index, e.gamepad.id);
    });

    // Start scanning
    requestRef.current = requestAnimationFrame(scanGamepads);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return gamepad;
};
