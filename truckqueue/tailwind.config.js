/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'truck-enter': {
          '0%': { transform: 'translateX(100vw)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'truck-exit': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-60vw)', opacity: '0' }
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideDownFade: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
      },
      animation: {
        'truck-enter': 'truck-enter 1.25s ease-in-out',
        'truck-exit': 'truck-exit 1.25s ease-in-out forwards',
        'blink': 'blink 1s linear infinite',
        slideDownFade: 'slideDownFade 0.3s ease-out',
        shake: 'shake 0.4s ease-in-out',
      }
    }
  },
  plugins: [],
}