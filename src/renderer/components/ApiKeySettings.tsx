import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'

export const ApiKeySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setApiKeyValid } = useStore()

  useEffect(() => {
    checkExistingApiKey()
  }, [])

  const checkExistingApiKey = async () => {
    try {
      const hasKey = await window.electronAPI?.hasDeepgramApiKey()
      if (hasKey) {
        setIsValid(true)
        setApiKeyValid(true)
      }
    } catch (error) {
      console.error('Error checking existing API key:', error)
    }
  }

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setIsValid(false)
      return
    }

    setIsLoading(true)
    
    try {
      await window.electronAPI?.setDeepgramApiKey(apiKey.trim())
      setIsValid(true)
      setApiKeyValid(true)
      console.log('✅ Deepgram API key saved successfully')
    } catch (error) {
      console.error('❌ Error saving API key:', error)
      setIsValid(false)
      setApiKeyValid(false)
    } finally {
      setIsLoading(false)
    }
  }


  if (isValid) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">API Key Set</span>
          </div>
          <button
            onClick={() => {
              setIsValid(null)
              setApiKey('')
              setApiKeyValid(false)
            }}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Change Key
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Deepgram API</h3>
      <p className="text-blue-700 text-sm mb-3">
        Enter your Deepgram API key to enable speech recognition. You can get $200 free credits from Deepgram when you sign up.
      </p>
      
      <div className="space-y-3">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Deepgram API key..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            isValid === false 
              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
              : 'border-blue-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        
        {isValid === false && (
          <p className="text-red-600 text-sm">
            Invalid API key. Please check your key and try again.
          </p>
        )}
        
        <button
          onClick={handleSaveApiKey}
          disabled={!apiKey.trim() || isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save API Key'}
        </button>
      </div>
    </div>
  )
}
