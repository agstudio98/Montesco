/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'montesco-white': '#F8F9FA',
        'montesco-brown-light': '#D7CCC8',
        'montesco-brown-dark': '#5D4037',
        'montesco-black': '#121212',
        'montesco-glass': 'rgba(255, 255, 255, 0.1)',
        'montesco-glass-dark': 'rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        'arsenal': ['"Arsenal SC"', 'sans-serif'],
        'anton': ['"Anton SC"', 'sans-serif'],
        'rem': ['"REM"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
