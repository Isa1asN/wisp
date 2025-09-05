import React, { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

const TranscriptionArea: React.FC = () => {
  const { transcribedText, isRecording, isProcessing, error, isDarkMode } = useStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [transcribedText])

  const getPlaceholderText = () => {
    if (error) return error
    if (isProcessing) return 'Processing speech...'
    if (isRecording) return 'Listening... speak now'
    if (transcribedText) return ''
    return 'Press the button and start speaking to see your words appear here'
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Transcription</h3>
        {transcribedText && (
          <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
            {transcribedText.split(' ').length} words
          </div>
        )}
      </div>
      
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={transcribedText}
          readOnly
          placeholder={getPlaceholderText()}
          className={`
            w-full h-full p-4 rounded-lg resize-none
            ${isDarkMode 
              ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
              : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'
            }
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-200
            backdrop-blur-sm
          `}
        />
        
        {isRecording && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-2 bg-red-500/80 text-white px-2 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Recording</span>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-2 bg-yellow-500/80 text-white px-2 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-spin"></div>
              <span>Processing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptionArea
