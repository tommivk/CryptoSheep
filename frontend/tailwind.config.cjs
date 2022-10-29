/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        navbarHeight: '60px',
      },
      colors: {
        darkBackground: "#13141a",
        darkMain: "#15171E",
        darkSecondary: "#2c2d3382"
      }
    },
  },
  plugins: [],
}
