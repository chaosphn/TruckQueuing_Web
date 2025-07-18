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
      },
      animation: {
        'truck-enter': 'truck-enter 1.25s ease-in-out',
        'truck-exit': 'truck-exit 1.25s ease-in-out forwards',
        'blink': 'blink 1s linear infinite'
      }
    }
  },
  plugins: [],
}