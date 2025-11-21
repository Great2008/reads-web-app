/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defines the new primary accent color for buttons and highlights
        'reads-gold': {
          DEFAULT: '#F5BE4E',
          'darker': '#e3a93d',
        },
        // Defines the new soft background color
        'app-background': '#FAF7F1',
        // Defines the new dark color for text/icons
        'reads-dark': '#1F2937', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'smooth': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}