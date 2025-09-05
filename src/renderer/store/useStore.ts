import { create } from 'zustand'

export interface AppState {
  isRecording: boolean
  isProcessing: boolean
  transcribedText: string
  
  isDarkMode: boolean
  isMinimized: boolean
  alwaysOnTop: boolean
  
  audioLevel: number
  
  apiKeyValid: boolean
  error: string | null
  
  copySuccess: boolean
  
  setRecording: (recording: boolean) => void
  setProcessing: (processing: boolean) => void
  setTranscribedText: (text: string) => void
  appendTranscribedText: (text: string) => void
  clearTranscribedText: () => void
  toggleDarkMode: () => void
  setMinimized: (minimized: boolean) => void
  toggleAlwaysOnTop: () => void
  setAudioLevel: (level: number) => void
  setApiKeyValid: (valid: boolean) => void
  setError: (error: string | null) => void
  setCopySuccess: (success: boolean) => void
}

export const useStore = create<AppState>((set, get) => ({
  isRecording: false,
  isProcessing: false,
  transcribedText: '',
  isDarkMode: true,
  isMinimized: false,
  alwaysOnTop: false,
  audioLevel: 0,
  apiKeyValid: false,
  error: null,
  copySuccess: false,

  setRecording: (recording) => {
    set({ isRecording: recording })
    window.electronAPI?.setRecordingState(recording)
  },
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  setTranscribedText: (text) => set({ transcribedText: text }),
  
  appendTranscribedText: (text) => {
    const currentText = get().transcribedText
    const newText = currentText ? `${currentText} ${text}` : text
    set({ transcribedText: newText })
  },
  
  clearTranscribedText: () => set({ transcribedText: '' }),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  setMinimized: (minimized) => set({ isMinimized: minimized }),
  
  toggleAlwaysOnTop: () => {
    const newState = !get().alwaysOnTop
    set({ alwaysOnTop: newState })
    window.electronAPI?.setAlwaysOnTop(newState)
  },
  
  setAudioLevel: (level) => set({ audioLevel: level }),
  
  setApiKeyValid: (valid) => set({ apiKeyValid: valid }),
  
  setError: (error) => set({ error }),
  
  setCopySuccess: (success) => set({ copySuccess: success }),
}))
