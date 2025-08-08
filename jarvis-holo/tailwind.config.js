/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00fff6',
          blue: '#00b4ff',
          purple: '#8a2be2',
        },
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 246, 0.6), 0 0 20px rgba(0, 180, 255, 0.5)'
      }
    },
  },
  plugins: [],
}