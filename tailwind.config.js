/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0E14',
        surface: '#151921',
        'surface-highlight': '#1E232F',
        primary: '#00D1FF',
        'primary-dark': '#009DC0',
        secondary: '#7000FF',
        accent: '#00FF94',
        'text-main': '#E2E8F0',
        'text-muted': '#94A3B8',
        border: '#2D3748',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 209, 255, 0.15)',
        'glow-accent': '0 0 15px rgba(0, 255, 148, 0.15)',
      }
    },
  },
  plugins: [],
}