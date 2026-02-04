export interface GamepadState {
  buttons: boolean[]; // true if pressed
  axes: number[]; // -1.0 to 1.0
  connected: boolean;
  id: string;
  timestamp: number;
}

export type KeyCode = string; // e.g., "KeyW", "Space", "Enter"

export interface MappingEntry {
  gamepad: string;   // e.g., "A", "LeftStickUp", "DpadRight"
  action?: string;   // e.g., "Jump", "Move Forward" (optional description)
  keyboard: KeyCode; // e.g., "Space", "KeyW"
}

export interface InputMapping {
  mappings: MappingEntry[];
}

// Deprecated old format for backward compatibility if needed, 
// but we will migrate to the new array-based format.
export interface LegacyInputMapping {
  buttons: Record<number, KeyCode>;
  axes: {
    [index: number]: { negative?: KeyCode; positive?: KeyCode };
  };
}
