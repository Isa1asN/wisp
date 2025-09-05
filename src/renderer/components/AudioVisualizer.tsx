import React, { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { audioLevel, isRecording, isDarkMode } = useStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 300
    canvas.height = 60

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!isRecording) {
      ctx.fillStyle = '#374151'
      ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2)
      return
    }

    const barCount = 40
    const barWidth = canvas.width / barCount
    const centerY = canvas.height / 2

    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth
      
      const wave = Math.sin((i / barCount) * Math.PI * 2) * 0.3
      const height = (audioLevel + wave) * canvas.height * 0.8
      
      const intensity = Math.min(audioLevel * 2, 1)
      const red = Math.floor(intensity * 255)
      const green = Math.floor((1 - intensity) * 255)
      
      ctx.fillStyle = `rgb(${red}, ${green}, 50)`
      ctx.fillRect(x, centerY - height / 2, barWidth - 1, height)
    }
  }, [audioLevel, isRecording])

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas 
        ref={canvasRef}
        className="border border-gray-300 rounded-lg bg-gray-900"
        style={{ width: '300px', height: '60px' }}
      />
      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {isRecording ? 
          `Audio Level: ${(audioLevel * 100).toFixed(1)}%` : 
          'Not recording'
        }
      </div>
    </div>
  )
}