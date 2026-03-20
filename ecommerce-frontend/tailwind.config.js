/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink:   '#0e0d0b',
        cream: '#f0ebe0',
        gold:  '#c9a84c',
        mid:   '#2a2720',
        muted: '#6b6456',
        rust:  '#8b3a2a',
      },
    },
  },
  plugins: [],
}
