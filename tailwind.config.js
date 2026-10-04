/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0C0C0E', 800: '#17171B', 700: '#232329' },
        paper: { DEFAULT: '#EEEDE7', 50: '#F7F6F2' },
        accent: '#3A2BFF',
        lime: '#C8FF2E',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        pixel: ['"Jersey 10"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
