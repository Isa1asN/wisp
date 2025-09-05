import React from 'react'
import { useStore } from '../store/useStore'

const StatusBar: React.FC = () => {
  const { 
    isRecording, 
    isProcessing, 
    transcribedText,
    apiKeyValid,
    error,
    isDarkMode
  } = useStore()

  const getStatusText = () => {
    if (error) {
      return error
    }
    if (isProcessing) {
      return 'Processing speech...'
    }
    if (isRecording) {
      return 'Recording - speak now'
    }
    if (transcribedText) {
      return `${transcribedText.split(' ').length} words transcribed`
    }
    if (!apiKeyValid) {
      return 'Add API key to get started'
    }
    return 'Ready to record'
  }

  const getStatusColor = () => {
    if (error) return 'text-red-400'
    if (isProcessing) return 'text-blue-400'
    if (isRecording) return 'text-red-400'
    if (transcribedText) return 'text-green-400'
    if (!apiKeyValid) return 'text-yellow-400'
    return isDarkMode ? 'text-white/60' : 'text-gray-600'
  }

  return (
    <div className="flex items-center justify-between text-xs">
      <div className={`${getStatusColor()} font-medium`}>
        {getStatusText()}
      </div>
      
      {apiKeyValid && !error && (
        <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Ready</span>
        </div>
      )}
    </div>
  )
}

export default StatusBar
