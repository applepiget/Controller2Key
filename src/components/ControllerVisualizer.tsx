import React from 'react';
import { GamepadState } from '../types';

interface Props {
  gamepad: GamepadState | null;
}

export const ControllerVisualizer: React.FC<Props> = ({ gamepad }) => {
  if (!gamepad) {
    return (
      <div className="panel">
        <h2>Controller</h2>
        <div className="controller-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🎮</div>
          <p style={{ margin: 0, fontWeight: 500 }}>No Controller Detected</p>
          <p style={{ fontSize: '0.8em', marginTop: '8px' }}>Please connect a gamepad and <br/><strong>press any button</strong> to activate.</p>
        </div>
      </div>
    );
  }

  const { buttons, axes } = gamepad;

  // Helper to check if button is pressed
  const isPressed = (index: number) => buttons[index];

  return (
    <div className="panel">
      <h2>Controller ({gamepad.id.substring(0, 20)}...)</h2>
      <div className="controller-layout">
        {/* D-Pad */}
        <div className={`btn dpad-up ${isPressed(12) ? 'active' : ''}`}>↑</div>
        <div className={`btn dpad-down ${isPressed(13) ? 'active' : ''}`}>↓</div>
        <div className={`btn dpad-left ${isPressed(14) ? 'active' : ''}`}>←</div>
        <div className={`btn dpad-right ${isPressed(15) ? 'active' : ''}`}>→</div>

        {/* Face Buttons */}
        <div className={`btn face-y ${isPressed(3) ? 'active' : ''}`}>Y</div>
        <div className={`btn face-x ${isPressed(2) ? 'active' : ''}`}>X</div>
        <div className={`btn face-a ${isPressed(0) ? 'active' : ''}`}>A</div>
        <div className={`btn face-b ${isPressed(1) ? 'active' : ''}`}>B</div>

        {/* Shoulders */}
        <div className={`btn shoulder-lb ${isPressed(4) ? 'active' : ''}`}>LB</div>
        <div className={`btn shoulder-rb ${isPressed(5) ? 'active' : ''}`}>RB</div>

        {/* Sticks (Simplified visualization) */}
        <div 
          className={`btn stick-l ${isPressed(10) ? 'active' : ''}`}
          style={{ transform: `translate(${axes[0] * 10}px, ${axes[1] * 10}px)` }}
        >L</div>
        <div 
          className={`btn stick-r ${isPressed(11) ? 'active' : ''}`}
          style={{ transform: `translate(${axes[2] * 10}px, ${axes[3] * 10}px)` }}
        >R</div>
      </div>
    </div>
  );
};
