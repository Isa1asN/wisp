import React, { useEffect } from 'react'
import { useStore } from './store/useStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import WindowControls from './components/WindowControls'
import RecordingButton from './components/RecordingButton'
import TranscriptionArea from './components/TranscriptionArea'
import { AudioVisualizer } from './components/AudioVisualizer'
import ActionButtons from './components/ActionButtons'
import { ApiKeySettings } from './components/ApiKeySettings'
import StatusBar from './components/StatusBar'
import './App.css'

function App() {
  const { isDarkMode, apiKeyValid } = useStore()
  
  useKeyboardShortcuts()

  useEffect(() => {

    const unsubscribeToggle = window.electronAPI?.onToggleRecording(() => {
      const { isRecording, setRecording } = useStore.getState()
      setRecording(!isRecording)
    })

    const unsubscribeStop = window.electronAPI?.onStopRecording(() => {
      const { setRecording } = useStore.getState()
      setRecording(false)
    })

    return () => {
      unsubscribeToggle?.()
      unsubscribeStop?.()
    }
  }, [])

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="glass-effect h-full w-full rounded-lg overflow-hidden">
        <WindowControls />
        
        <div className="flex flex-col h-full p-6 pt-12">
          <ApiKeySettings />
          
          {apiKeyValid && (
            <>
              <div className="flex-shrink-0 mb-6">
                <AudioVisualizer />
              </div>

              <div className="flex-shrink-0 mb-6 flex justify-center">
                <RecordingButton />
              </div>

              <div className="flex-1 mb-6">
                <TranscriptionArea />
              </div>

              <div className="flex-shrink-0 mb-4">
                <ActionButtons />
              </div>

              <div className="flex-shrink-0">
                <StatusBar />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
