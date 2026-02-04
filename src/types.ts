export interface GamepadState {
  buttons: boolean[]; // true if pressed
  axes: number[]; // -1.0 to 1.0
  connected: boolean;
  id: string;
  timestamp: number;
}

export type KeyCode = string; // e.g., "KeyW", "Space", "Enter"

export interface InputMapping {
  // Map Gamepad button index to Keyboard code
  buttons: Record<number, KeyCode>;
  // Map Axes to keys (simplified for demo: negative/positive directions)
  axes: {
    // axisIndex: { negative: KeyCode, positive: KeyCode }
    [index: number]: { negative?: KeyCode; positive?: KeyCode };
  };
}
