/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind to use the 'dark' class on the HTML element 
  // instead of relying on the system's color scheme.
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}