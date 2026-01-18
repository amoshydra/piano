# Web Piano

A mobile-friendly web piano with recording capabilities built using SvelteKit and Web Audio API.

![export](https://github.com/user-attachments/assets/d8a6347f-cea3-4c9b-b6be-37343abff12d)

## Features

### Core Piano

- **Multi-touch support**: Play chords by touching multiple keys simultaneously
- **Keyboard shortcuts**: Use your computer keyboard to play notes
- **Responsive design**: Optimized for mobile, tablet, and desktop devices
- **Clean UI**: Modern, intuitive interface with visual feedback

### Recording System

- **Record your playing**: Capture your piano sessions
- **Playback recordings**: Listen to your saved recordings
- **Manage recordings**: Delete recordings you no longer need
- **Local storage**: Recordings are saved in your browser's local storage

### Audio

- **Web Audio API**: High-quality audio synthesis
- **Volume control**: Adjust the volume to your preference
- **Multiple oscillators**: Support for playing simultaneous notes
- **Smooth decay**: Natural-sounding note release

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended), npm, or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd piano

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Open in browser
pnpm dev -- --open
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build production bundle
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

```bash
# Type checking
pnpm check            # Run type checking
pnpm check:watch      # Watch mode for type checking

# Linting and formatting
pnpm format           # Format code with Prettier
pnpm lint             # Run Prettier + ESLint checks
```

### Testing

```bash
# Run all tests (unit tests with Vitest)
pnpm test

# Run E2E tests with Playwright
pnpm test:e2e
```

**Running single tests:**

- Unit tests: Add `.only` to the test function temporarily, or use `npx vitest run -t "test name"`
- E2E tests: Add `.only` to the test or use `npx playwright test --grep "test name pattern"`

## Usage

### Playing the Piano

1. **Touch/Click**: Tap or click on any piano key to play a note
2. **Keyboard**: Use keyboard shortcuts mapped to piano keys:
   - Q, W, E, R, T, Y, U, I, O, P: White keys
   - 1, 2, 4, 5, 7, 8, 9, -, =: Black keys
   - Tab: G
   - Backspace: F#

### Recording

1. Click the **Record** button to start recording
2. Play the piano to capture your performance
3. Click the **Stop** button to end recording
4. Your recording is automatically saved

### Playback

1. Click **"My Recordings"** to expand the recordings list
2. Click the **Play** button (▶) next to any recording
3. Click again to stop playback

### Volume Control

Use the volume slider to adjust the master volume from 0% to 100%.

## Keyboard Shortcuts

| Key | Note | Key       | Note |
| --- | ---- | --------- | ---- |
| Tab | G    | 1         | G#   |
| Q   | A    | 2         | A#   |
| W   | B    | 4         | C#   |
| E   | C    | 5         | D#   |
| R   | D    | 7         | F#   |
| T   | E    | 8         | G#   |
| Y   | F    | 9         | A#   |
| U   | G    | -         | C#   |
| I   | A    | =         | D#   |
| O   | B    | [         | D    |
| P   | C    | ]         | E    |
| \   | F    | Backspace | F#   |

## Technical Details

### Technologies

- **SvelteKit**: Modern web framework
- **TypeScript**: Type-safe development
- **Web Audio API**: Audio synthesis
- **Svelte stores**: State management
- **LocalStorage**: Data persistence

### Architecture

```
src/
├── components/
│   ├── Piano/           # Piano-related components
│   ├── Recording/       # Recording system components
│   └── Layout/         # Layout components
├── lib/
│   ├── audio.ts         # Web Audio API wrapper
│   ├── recorder.ts      # Recording logic
│   ├── piano.ts         # Piano utilities
│   └── store.ts        # Svelte stores
└── routes/             # Application routes
```

## License

Licensed under the Apache License, Version 2.0.
