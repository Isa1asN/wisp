import { useCallback, useRef } from 'react'
import { useStore } from '../store/useStore'

export const useDeepgram = () => {
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  const { 
    setRecording, 
    setAudioLevel, 
    appendTranscribedText, 
    apiKeyValid,
    setError
  } = useStore()

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = average / 255;

    setAudioLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, [setAudioLevel])

  const startRecording = useCallback(async () => {
    setError(null)
    
    if (!apiKeyValid) {
      setError('Please add your Deepgram API key in settings')
      return false
    }

    try {
      console.log('🎤 Starting simple Deepgram recording...')

      const apiKey = await window.electronAPI?.getDeepgramApiKey?.()
      if (!apiKey) {
        setError('Failed to retrieve API key. Please try adding it again.')
        return false
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })
      streamRef.current = stream

      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)
      updateAudioLevel()

      const socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=nova-2&language=en&punctuate=true', [
        'token',
        apiKey
      ])
      websocketRef.current = socket

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder

      socket.onopen = () => {
        console.log('✅ Deepgram WebSocket opened')
        mediaRecorder.addEventListener('dataavailable', async (event) => {
          if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
            socket.send(event.data)
            console.log('🎤 Sent audio chunk:', event.data.size, 'bytes')
          }
        })
        mediaRecorder.start(250)
      }

      socket.onmessage = (message) => {
        try {
          const received = JSON.parse(message.data)
          console.log('📝 Received:', received)
          const transcript = received.channel?.alternatives?.[0]?.transcript
          if (transcript?.trim()) {
            console.log('✅ Transcript:', transcript)
            appendTranscribedText(transcript)
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error)
        }
      }

      socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setError('Connection error. Please check your internet connection and API key.')
      }

      socket.onclose = (event) => {
        console.log('🔚 WebSocket closed:', event.code, event.reason)
        if (event.code === 4001) {
          setError('Invalid API key. Please check your Deepgram API key.')
        } else if (event.code !== 1000) {
          setError('Connection closed unexpectedly. Please try again.')
        }
      }

      setRecording(true)
      console.log('✅ Recording started')
      return true

    } catch (error: unknown) {
      console.error('❌ Error starting recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Failed to start recording: ' + errorMessage);
      return false;
    }
  }, [apiKeyValid, setRecording, updateAudioLevel, appendTranscribedText, setError])

  const stopRecording = useCallback(async () => {
    console.log('🛑 Stopping recording...')

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (websocketRef.current) {
      websocketRef.current.close(1000, 'Recording stopped by user')
      websocketRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    setRecording(false)
    setAudioLevel(0)
    console.log('✅ Recording stopped')
  }, [setRecording, setAudioLevel])

  return {
    startRecording,
    stopRecording,
  }
}