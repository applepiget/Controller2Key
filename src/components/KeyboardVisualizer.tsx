import React, { useMemo } from 'react';
import { KeyCode, InputMapping } from '../types';
import { GAMEPAD_BUTTON_NAMES } from '../constants';

interface Props {
  activeKeys: Set<KeyCode>;
  mapping?: InputMapping;
}

// Simplified layout rows
const ROWS = [
  ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight']
];

// Map code to display label (optional override)
const LABELS: Record<string, string> = {
  'Space': 'Space',
  'ShiftLeft': 'Shift',
  'ShiftRight': 'Shift',
  'Enter': 'Enter',
  'Tab': 'Tab',
  'Escape': 'Esc',
  'ArrowUp': '↑',
  'ArrowDown': '↓',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  'ControlLeft': 'Ctrl',
  'AltLeft': 'Alt',
  'MetaLeft': 'Win',
  'Backspace': 'Back',
  // Symbol keys (removing English names)
  'Backquote': '`',
  'Minus': '-',
  'Equal': '=',
  'BracketLeft': '[',
  'BracketRight': ']',
  'Backslash': '\\',
  'Semicolon': ';',
  'Quote': "'",
  'Comma': ',',
  'Period': '.',
  'Slash': '/'
};

const getKeyLabel = (code: string) => {
  if (LABELS[code]) return LABELS[code];
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('F')) return code;
  return code;
};

export const KeyboardVisualizer: React.FC<Props> = ({ activeKeys, mapping }) => {
  // Track keys pressed by mouse
  const [mousePressedKeys, setMousePressedKeys] = React.useState<Set<string>>(new Set());

  const handleMouseDown = (code: string) => {
    setMousePressedKeys(prev => {
      const next = new Set(prev);
      next.add(code);
      return next;
    });
  };

  const handleMouseUp = (code: string) => {
    setMousePressedKeys(prev => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  };

  const handleMouseLeave = (code: string) => {
    if (mousePressedKeys.has(code)) {
      setMousePressedKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    }
  };

  // Create a reverse mapping: KeyCode -> Gamepad Label(s)
  const mappedLabels = useMemo(() => {
    if (!mapping) return new Map<KeyCode, string[]>();
    const map = new Map<KeyCode, string[]>();

    // Buttons
    Object.entries(mapping.buttons).forEach(([btnIndex, keyCode]) => {
      const name = GAMEPAD_BUTTON_NAMES[parseInt(btnIndex)] || `Btn${btnIndex}`;
      if (!map.has(keyCode)) map.set(keyCode, []);
      map.get(keyCode)?.push(name);
    });

    // Axes
    Object.entries(mapping.axes).forEach(([axisIndex, axisValue]) => {
      const axisMap = axisValue as { negative?: KeyCode; positive?: KeyCode };
      const idx = parseInt(axisIndex);

      // 0: Left Stick X, 1: Left Stick Y
      // 2: Right Stick X, 3: Right Stick Y
      let name = `A${idx}`;
      let dirNeg = '-';
      let dirPos = '+';

      if (idx === 0) { name = 'L'; dirNeg = '←'; dirPos = '→'; }
      else if (idx === 1) { name = 'L'; dirNeg = '↑'; dirPos = '↓'; }
      else if (idx === 2) { name = 'R'; dirNeg = '←'; dirPos = '→'; }
      else if (idx === 3) { name = 'R'; dirNeg = '↑'; dirPos = '↓'; }

      if (axisMap.negative) {
        if (!map.has(axisMap.negative)) map.set(axisMap.negative, []);
        map.get(axisMap.negative)?.push(`${name}${dirNeg}`);
      }
      if (axisMap.positive) {
        if (!map.has(axisMap.positive)) map.set(axisMap.positive, []);
        map.get(axisMap.positive)?.push(`${name}${dirPos}`);
      }
    });

    return map;
  }, [mapping]);

  return (
    <div className="panel keyboard-panel">
      <h2>Keyboard Output</h2>
      <div className="keyboard-layout">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((code) => {
              const isActive = activeKeys.has(code) || mousePressedKeys.has(code);
              const mapped = mappedLabels.get(code);
              let className = 'key';
              if (isActive) className += ' active';
              if (mapped && mapped.length > 0) className += ' mapped';
              if (code === 'Space') className += ' key-space';
              if (code.includes('Shift')) className += ' key-shift';
              if (code === 'Enter') className += ' key-enter';
              if (code === 'Backspace') className += ' key-backspace';
              if (code === 'Tab') className += ' key-tab';
              if (code === 'CapsLock') className += ' key-caps';

              return (
                <div
                  key={code}
                  className={className}
                  data-code={code}
                  onMouseDown={() => handleMouseDown(code)}
                  onMouseUp={() => handleMouseUp(code)}
                  onMouseLeave={() => handleMouseLeave(code)}
                >
                  <span className="key-label">{getKeyLabel(code)}</span>
                  {mapped && (
                    <div className="key-mapping-badges">
                      {mapped.map(m => <span key={m} className="badge">{m}</span>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Separate Arrow Keys Row for demo */}
        <div className="keyboard-row arrows-row">
          <div
            className={`key ${activeKeys.has('ArrowLeft') || mousePressedKeys.has('ArrowLeft') ? 'active' : ''} ${mappedLabels.has('ArrowLeft') ? 'mapped' : ''}`}
            onMouseDown={() => handleMouseDown('ArrowLeft')}
            onMouseUp={() => handleMouseUp('ArrowLeft')}
            onMouseLeave={() => handleMouseLeave('ArrowLeft')}
          >
            <span>←</span>
            {mappedLabels.get('ArrowLeft') && <div className="key-mapping-badges">{mappedLabels.get('ArrowLeft')?.map(m => <span key={m} className="badge">{m}</span>)}</div>}
          </div>
          <div className="arrow-stack">
            <div
              className={`key ${activeKeys.has('ArrowUp') || mousePressedKeys.has('ArrowUp') ? 'active' : ''} ${mappedLabels.has('ArrowUp') ? 'mapped' : ''}`}
              onMouseDown={() => handleMouseDown('ArrowUp')}
              onMouseUp={() => handleMouseUp('ArrowUp')}
              onMouseLeave={() => handleMouseLeave('ArrowUp')}
            >
              <span>↑</span>
              {mappedLabels.get('ArrowUp') && <div className="key-mapping-badges">{mappedLabels.get('ArrowUp')?.map(m => <span key={m} className="badge">{m}</span>)}</div>}
            </div>
            <div
              className={`key ${activeKeys.has('ArrowDown') || mousePressedKeys.has('ArrowDown') ? 'active' : ''} ${mappedLabels.has('ArrowDown') ? 'mapped' : ''}`}
              onMouseDown={() => handleMouseDown('ArrowDown')}
              onMouseUp={() => handleMouseUp('ArrowDown')}
              onMouseLeave={() => handleMouseLeave('ArrowDown')}
            >
              <span>↓</span>
              {mappedLabels.get('ArrowDown') && <div className="key-mapping-badges">{mappedLabels.get('ArrowDown')?.map(m => <span key={m} className="badge">{m}</span>)}</div>}
            </div>
          </div>
          <div
            className={`key ${activeKeys.has('ArrowRight') || mousePressedKeys.has('ArrowRight') ? 'active' : ''} ${mappedLabels.has('ArrowRight') ? 'mapped' : ''}`}
            onMouseDown={() => handleMouseDown('ArrowRight')}
            onMouseUp={() => handleMouseUp('ArrowRight')}
            onMouseLeave={() => handleMouseLeave('ArrowRight')}
          >
            <span>→</span>
            {mappedLabels.get('ArrowRight') && <div className="key-mapping-badges">{mappedLabels.get('ArrowRight')?.map(m => <span key={m} className="badge">{m}</span>)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
