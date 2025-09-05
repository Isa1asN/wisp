// Type definitions for Electron API exposed via preload script

export interface ElectronAPI {
  // Window controls
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  dragWindow: (x: number, y: number) => Promise<void>

  // Clipboard
  copyToClipboard: (text: string) => Promise<boolean>

  // Recording state
  setRecordingState: (recording: boolean) => Promise<void>

  // App info
  getAppVersion: () => Promise<string>

  // Window bounds
  saveWindowBounds: () => Promise<any>
  restoreWindowBounds: (bounds: any) => Promise<void>

  // Deepgram API
  getDeepgramApiKey: () => Promise<string | null>
  setDeepgramApiKey: (apiKey: string) => Promise<boolean>
  hasDeepgramApiKey: () => Promise<boolean>

  // Window behavior
  setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<void>

  // Event listeners
  onToggleRecording: (callback: () => void) => () => void
  onStopRecording: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
