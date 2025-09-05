import React from 'react'
import { useStore } from '../store/useStore'
import { useDeepgram } from '../hooks/useDeepgram'

const RecordingButton: React.FC = () => {
  const { isRecording, isProcessing, apiKeyValid, isDarkMode } = useStore()
  const { startRecording, stopRecording } = useDeepgram()

  const handleToggleRecording = async () => {
    if (!apiKeyValid) {
      console.warn('❌ Cannot record without valid API key')
      return
    }
    
    if (isRecording) {
      await stopRecording()
    } else {
      await startRecording()
    }
  }

  const getButtonState = () => {
    if (isProcessing) return 'processing'
    if (isRecording) return 'recording'
    return 'idle'
  }

  const buttonState = getButtonState()

  const buttonConfig = {
    idle: {
      text: 'Start Recording',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      ),
      className: 'bg-primary-500 hover:bg-primary-600 text-white',
    },
    recording: {
      text: 'Stop Recording',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
        </svg>
      ),
      className: 'bg-red-500 hover:bg-red-600 text-white recording-pulse',
    },
    processing: {
      text: 'Processing...',
      icon: (
        <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      className: 'bg-yellow-500 text-white cursor-not-allowed',
    },
  }

  const config = buttonConfig[buttonState]

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleToggleRecording}
        disabled={isProcessing || !apiKeyValid}
        className={`
          flex items-center justify-center space-x-3 px-8 py-4 rounded-full
          font-medium text-lg shadow-lg transition-all duration-200
          transform hover:scale-105 active:scale-95
          ${apiKeyValid ? config.className : 'bg-gray-400 text-gray-600 cursor-not-allowed'}
          ${isProcessing || !apiKeyValid ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {config.icon}
        <span>{config.text}</span>
      </button>
      
      <div className={`mt-2 text-xs text-center ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
        Press <kbd className={`px-1 py-0.5 rounded ${isDarkMode ? 'bg-white/20 text-white/80' : 'bg-gray-200 text-gray-700'}`}>Space</kbd> to toggle
      </div>
    </div>
  )
}

export default RecordingButton
