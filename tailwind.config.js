/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          bg: '#1a1a1a',
          surface: '#2a2a2a',
          border: '#3a3a3a',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-recording': 'pulse 1.5s ease-in-out infinite',
        'waveform': 'waveform 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        waveform: {
          '0%': { transform: 'scaleY(0.3)' },
          '100%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
