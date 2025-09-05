import React, { useState } from 'react'
import { useStore } from '../store/useStore'

const ActionButtons: React.FC = () => {
  const { transcribedText, clearTranscribedText, copySuccess, setCopySuccess, isDarkMode } = useStore()

  const handleCopy = async () => {
    if (transcribedText) {
      try {
        await window.electronAPI?.copyToClipboard(transcribedText)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }

  const handleClear = () => {
    clearTranscribedText()
  }

  const hasText = transcribedText.trim().length > 0

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex space-x-3">
        <button
          onClick={handleCopy}
          disabled={!hasText}
          className={`
            flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
            font-medium transition-all duration-200
            ${hasText 
              ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
              : 'bg-white/10 text-white/50 cursor-not-allowed'
            }
            ${copySuccess ? 'bg-green-500 hover:bg-green-500' : ''}
          `}
        >
          {copySuccess ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>

        <button
          onClick={handleClear}
          disabled={!hasText}
          className={`
            px-4 py-3 rounded-lg font-medium transition-all duration-200
            ${hasText 
              ? isDarkMode 
                ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 hover:border-gray-400'
              : isDarkMode
                ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }
          `}
          title="Clear text"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className={`flex justify-center space-x-4 text-xs ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
        <div className="flex items-center space-x-1">
          <kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-white/20 text-white/70' : 'bg-gray-200 text-gray-700'}`}>Ctrl+C</kbd>
          <span>Copy</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-white/20 text-white/70' : 'bg-gray-200 text-gray-700'}`}>Del</kbd>
          <span>Clear</span>
        </div>
      </div>
    </div>
  )
}

export default ActionButtons
