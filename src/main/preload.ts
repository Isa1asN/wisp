import { contextBridge, ipcRenderer } from 'electron'


contextBridge.exposeInMainWorld('electronAPI', {

  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  dragWindow: (x: number, y: number) => ipcRenderer.invoke('window-drag', { x, y }),

  copyToClipboard: (text: string) => ipcRenderer.invoke('copy-to-clipboard', text),

  setRecordingState: (recording: boolean) => ipcRenderer.invoke('set-recording-state', recording),

  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  saveWindowBounds: () => ipcRenderer.invoke('save-window-bounds'),
  restoreWindowBounds: (bounds: any) => ipcRenderer.invoke('restore-window-bounds', bounds),

  setDeepgramApiKey: (apiKey: string) => ipcRenderer.invoke('set-deepgram-api-key', apiKey),
  hasDeepgramApiKey: () => ipcRenderer.invoke('has-deepgram-api-key'),
  getDeepgramApiKey: () => ipcRenderer.invoke('get-deepgram-api-key'),

  setAlwaysOnTop: (alwaysOnTop: boolean) => ipcRenderer.invoke('set-always-on-top', alwaysOnTop),

  onToggleRecording: (callback: () => void) => {
    ipcRenderer.on('toggle-recording', callback)
    return () => ipcRenderer.removeListener('toggle-recording', callback)
  },
  
  onStopRecording: (callback: () => void) => {
    ipcRenderer.on('stop-recording', callback)
    return () => ipcRenderer.removeListener('stop-recording', callback)
  },

})

declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      dragWindow: (x: number, y: number) => Promise<void>
      copyToClipboard: (text: string) => Promise<boolean>
      setRecordingState: (recording: boolean) => Promise<void>
      getAppVersion: () => Promise<string>
      saveWindowBounds: () => Promise<any>
      restoreWindowBounds: (bounds: any) => Promise<void>
      setDeepgramApiKey: (apiKey: string) => Promise<boolean>
      hasDeepgramApiKey: () => Promise<boolean>
      getDeepgramApiKey: () => Promise<string | null>
      setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<void>
      onToggleRecording: (callback: () => void) => () => void
      onStopRecording: (callback: () => void) => () => void
    }
  }
}
