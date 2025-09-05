import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useDeepgram } from './useDeepgram'

export const useKeyboardShortcuts = () => {
  const { 
    transcribedText, 
    clearTranscribedText, 
    isRecording, 
    isProcessing,
    setCopySuccess
  } = useStore()
  const { startRecording, stopRecording } = useDeepgram()

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (isProcessing) return

      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        if (transcribedText) {
          event.preventDefault()
          await window.electronAPI?.copyToClipboard(transcribedText)
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        }
      }

      if (event.key === 'Delete' && transcribedText) {
        event.preventDefault()
        clearTranscribedText()
      }

      if (event.key === ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        if (isRecording) {
          await stopRecording()
        } else {
          await startRecording()
        }
      }

      if (event.key === 'Escape' && isRecording) {
        event.preventDefault()
        await stopRecording()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    transcribedText, 
    clearTranscribedText, 
    isRecording, 
    isProcessing, 
    startRecording, 
    stopRecording,
    setCopySuccess
  ])
}
