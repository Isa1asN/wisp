# Wisp

A minimalist cross-platform desktop app for voice-to-text typing anywhere on your system. I built this for myself to type quick at places like Cursor.


## Features

- 🎤 **Real-time Voice Recognition** - Powered by Deepgram API (generous free tier available)
- 🪟 **Floating Window** - minimalistic design, that can be used anywhere
- ⚡ **Global Shortcuts** - Quick access from anywhere
- 📋 **Instant Copy** 

## Quick Start

1. **Get a Deepgram API key** from [deepgram.com](https://deepgram.com) 
   - **Free $200 credit** = ~775 hours of transcription(a lot)

2. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

3. **Add your API key** in the settings and start typing with your voice!

## Usage

- **Global Shortcuts:**
  - `Ctrl+Shift+Space` - Show/hide Wisp window
- **In-app Controls:**
  - `Space` - Start/stop recording
  - `Ctrl+C` - Copy transcription
  - `Delete` - Clear transcription

## Development

### Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main application logic
│   ├── preload.ts  # Preload script for IPC
│   └── utils.ts    # Utility functions
└── renderer/       # React frontend
    ├── components/ # React components
    ├── hooks/      # Custom React hooks
    ├── store/      # State management
    └── App.tsx     # Main app component
```

### Scripts

- `npm run dev` - Start development with hot reload
- `npm run build` - Build for production
- `npm run package` - Create distributable packages
- `npm run package:all` - Build for all platforms (macOS, Windows, Linux)

### Tech Stack

- **Electron** + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Zustand** for state management  
- **Deepgram API** for speech recognition

## Contributing

Any contributions are welcome! This app can be extended with more features and integrations.

## Building for Distribution

```bash
npm run build
npm run package     # Current platform
npm run package:all # All platforms
```

## License

MIT License - see LICENSE file for details
