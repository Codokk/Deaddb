/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d0d14',
          card: '#13131f',
          border: '#1e1e30',
          hover: '#1a1a28',
        },
        brand: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          violet: '#a78bfa',
          glow: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
