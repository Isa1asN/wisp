import React, { useState } from 'react'
import { useStore } from '../store/useStore'

const WindowControls: React.FC = () => {
  const { isDarkMode, toggleDarkMode, alwaysOnTop, toggleAlwaysOnTop } = useStore()
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const startX = e.clientX
    const startY = e.clientY

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.screenX - startX
        const deltaY = e.screenY - startY
        window.electronAPI?.dragWindow(deltaX, deltaY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow()
  }

  const handleClose = () => {
    window.electronAPI?.closeWindow()
  }

  return (
    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 drag-region z-10">
      <div 
        className="flex-1 h-full cursor-move"
        onMouseDown={handleMouseDown}
      />
      
      <div className="flex items-center space-x-2 no-drag">
        <button
          onClick={toggleAlwaysOnTop}
          className={`p-2 rounded-md transition-colors ${
            alwaysOnTop ? 'bg-blue-500/50 text-white' : 'hover:bg-white/20 text-white/70'
          }`}
          title={alwaysOnTop ? "Disable always on top" : "Enable always on top"}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-white/20 transition-colors"
          title="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleMinimize}
          className="p-2 rounded-md hover:bg-white/20 transition-colors"
          title="Minimize"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={handleClose}
          className="p-2 rounded-md hover:bg-red-500/50 transition-colors"
          title="Close"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default WindowControls
