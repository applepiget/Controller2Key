import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { InputMapping, LegacyInputMapping, MappingEntry } from "../types"
import { GAMEPAD_BUTTON_NAMES } from "../constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to convert legacy mapping format to new readable format
export function convertLegacyToNew(legacy: LegacyInputMapping): InputMapping {
  const mappings: MappingEntry[] = [];

  // Convert Buttons
  Object.entries(legacy.buttons).forEach(([btnIdx, keyCode]) => {
    const idx = parseInt(btnIdx);
    const name = GAMEPAD_BUTTON_NAMES[idx] || `Button ${idx}`;
    mappings.push({
      gamepad: name,
      action: "Button Press",
      keyboard: keyCode
    });
  });

  // Convert Axes
  Object.entries(legacy.axes).forEach(([axisIdx, axisMap]) => {
    const idx = parseInt(axisIdx);
    if (axisMap.negative) {
      let name = `Axis ${idx} -`;
      if (idx === 0) name = "LeftStickLeft";
      if (idx === 1) name = "LeftStickUp";
      if (idx === 2) name = "RightStickLeft";
      if (idx === 3) name = "RightStickUp";

      mappings.push({
        gamepad: name,
        action: "Axis Negative",
        keyboard: axisMap.negative
      });
    }
    if (axisMap.positive) {
      let name = `Axis ${idx} +`;
      if (idx === 0) name = "LeftStickRight";
      if (idx === 1) name = "LeftStickDown";
      if (idx === 2) name = "RightStickRight";
      if (idx === 3) name = "RightStickDown";

      mappings.push({
        gamepad: name,
        action: "Axis Positive",
        keyboard: axisMap.positive
      });
    }
  });

  return { mappings };
}

// Helper to parse Gamepad input string to internal ID/Index
export function parseGamepadInput(input: string): { type: 'button' | 'axis', index: number, direction?: 'positive' | 'negative' } | null {
  const normalized = input.toLowerCase().replace(/[\s\-_]/g, '');

  // Standard Buttons
  const buttonMap: Record<string, number> = {
    'a': 0, 'cross': 0,
    'b': 1, 'circle': 1,
    'x': 2, 'square': 2,
    'y': 3, 'triangle': 3,
    'lb': 4, 'l1': 4,
    'rb': 5, 'r1': 5,
    'lt': 6, 'l2': 6,
    'rt': 7, 'r2': 7,
    'select': 8, 'share': 8, 'back': 8, 'view': 8,
    'start': 9, 'options': 9, 'menu': 9,
    'l3': 10, 'leftstickclick': 10,
    'r3': 11, 'rightstickclick': 11,
    'up': 12, 'dpadup': 12,
    'down': 13, 'dpaddown': 13,
    'left': 14, 'dpadleft': 14,
    'right': 15, 'dpadright': 15,
    'home': 16, 'guide': 16, 'ps': 16
  };

  if (buttonMap[normalized] !== undefined) {
    return { type: 'button', index: buttonMap[normalized] };
  }

  // Axes
  if (normalized.includes('leftstick') || normalized.includes('ls')) {
    if (normalized.includes('left')) return { type: 'axis', index: 0, direction: 'negative' };
    if (normalized.includes('right')) return { type: 'axis', index: 0, direction: 'positive' };
    if (normalized.includes('up')) return { type: 'axis', index: 1, direction: 'negative' };
    if (normalized.includes('down')) return { type: 'axis', index: 1, direction: 'positive' };
  }

  if (normalized.includes('rightstick') || normalized.includes('rs')) {
    if (normalized.includes('left')) return { type: 'axis', index: 2, direction: 'negative' };
    if (normalized.includes('right')) return { type: 'axis', index: 2, direction: 'positive' };
    if (normalized.includes('up')) return { type: 'axis', index: 3, direction: 'negative' };
    if (normalized.includes('down')) return { type: 'axis', index: 3, direction: 'positive' };
  }

  return null;
}
