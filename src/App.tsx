import { useMemo, useState, useEffect } from 'react';
import { useGamepad } from './hooks/useGamepad';
import { ControllerVisualizer } from './components/ControllerVisualizer';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { KeyCode, InputMapping } from './types';

function App() {
  const gamepad = useGamepad();
  const [mapping, setMapping] = useState<InputMapping | null>(null);
  const [loading, setLoading] = useState(true);
  const [physicalKeys, setPhysicalKeys] = useState<Set<KeyCode>>(new Set());

  // Load mapping from JSON file
  useEffect(() => {
    fetch('/mapping.json')
      .then(res => res.json())
      .then((data: InputMapping) => {
        setMapping(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load mapping:', err);
        setLoading(false);
      });
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Simple validation
        if (json.buttons && json.axes) {
          setMapping(json);
        } else {
          alert('Invalid mapping file format');
        }
      } catch (err) {
        console.error('Invalid JSON', err);
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Listen for physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPhysicalKeys(prev => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPhysicalKeys(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const activeKeys = useMemo(() => {
    // Start with physical keys
    const keys = new Set<KeyCode>(physicalKeys);

    if (gamepad && mapping) {
      // 1. Map Buttons
      gamepad.buttons.forEach((pressed, index) => {
        if (pressed && mapping.buttons[index]) {
          keys.add(mapping.buttons[index]);
        }
      });

      // 2. Map Axes (with deadzone)
      const DEADZONE = 0.2;
      gamepad.axes.forEach((value, index) => {
        const axisMapping = mapping.axes[index];
        if (!axisMapping) return;

        if (value < -DEADZONE && axisMapping.negative) {
          keys.add(axisMapping.negative);
        } else if (value > DEADZONE && axisMapping.positive) {
          keys.add(axisMapping.positive);
        }
      });
    }

    return keys;
  }, [gamepad, mapping, physicalKeys]);

  return (
    <div className="container" style={{ flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Gamepad to Keyboard Mapper</h1>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
          <div className={`status-badge ${gamepad ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {gamepad ? `Connected: ${gamepad.id}` : 'No Controller Detected'}
          </div>
          
          <label className="status-badge" style={{ cursor: 'pointer', background: '#444', borderColor: '#666' }}>
            <span>📂 Import Mapping JSON</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </header>

      {loading ? (
        <div className="panel">Loading configuration...</div>
      ) : (
        <>
          <div className="container">
            <ControllerVisualizer gamepad={gamepad} />
            <KeyboardVisualizer activeKeys={activeKeys} mapping={mapping || undefined} />
          </div>

          <div className="panel" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'left' }}>
            <h3>Mapping Info</h3>
            <p>
              The keyboard above automatically highlights keys mapped to your controller based on <code>mapping.json</code>.
              <br />
              <span style={{ fontSize: '0.9em', color: '#aaa' }}>
                Green dot = Mapped key. The badge shows the corresponding controller button.
              </span>
            </p>
            <p style={{ fontSize: '0.9em', color: '#aaa' }}>
              * Ensure your gamepad is connected and press any button to activate.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
