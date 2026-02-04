# Controller2Key - Gamepad to Keyboard Visualizer

An interactive web application that maps Gamepad inputs to Keyboard keys in real-time. Designed to help visualize controller inputs as keyboard strokes, useful for tutorials, streaming overlays, or input testing.

## Features

- **Real-time Visualization**: Instantly see which keyboard keys correspond to your controller inputs.
- **Dynamic Mapping**: Load custom key mappings via JSON files without restarting the application.
- **Visual Feedback**:
  - **Controller View**: Highlights pressed buttons and stick movements on a virtual controller.
  - **Keyboard View**: Highlights mapped keys with high-contrast visual feedback (glow, color change).
- **Customizable**: Supports standard gamepad layouts (Xbox/PlayStation style).

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Gamepad/Controller connected to your computer

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/applepiget/Controller2Key.git
   cd Controller2Key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Usage

1. **Connect your Controller**: Press any button on your gamepad to wake it up. The status indicator should turn green and show your controller's ID.
2. **View Mappings**: The default mapping is loaded automatically. You will see green badges on the virtual keyboard indicating which controller button triggers which key.
3. **Import Custom Mapping**:
   - Click the **"📂 Import Mapping JSON"** button in the header.
   - Select a valid `.json` file containing your custom mapping configuration.

## Custom Mapping Format

You can create your own mapping file (e.g., `my-config.json`). The structure should be:

```json
{
  "buttons": {
    "0": "Space",      // Button 0 (A) -> Spacebar
    "1": "ShiftLeft",  // Button 1 (B) -> Left Shift
    "12": "ArrowUp"    // D-Pad Up -> Arrow Up
    // ... map other buttons by index
  },
  "axes": {
    "0": {
      "negative": "KeyA", // Left Stick Left -> A
      "positive": "KeyD"  // Left Stick Right -> D
    },
    "1": {
      "negative": "KeyW", // Left Stick Up -> W
      "positive": "KeyS"  // Left Stick Down -> S
    }
  }
}
```

## Tech Stack

- **React**: UI Library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **HTML5 Gamepad API**: Controller input handling

## License

MIT
