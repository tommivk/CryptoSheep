/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        sheepBG:  "url('/sheep.jpg')"
      },
      spacing: {
        navbarHeight: '60px',
      },
      colors: {
        darkBackground: "#13141a",
        darkMain: "#15171E",
        darkSecondary: "#2c2d3382",
        lightBackground: "#f3f3f3",
        lightSecondary: "#FFFFFF",
        lightBorder: "#d1d5db"
      },
      keyframes: {
        moveOut: {
          '0%': { translate: '0' },
          '100%': { translate: '-100vw' },
        },
        moveLeft: {
          '0%': { translate: '30vw' },
          '100%': { translate: '0' },
        },
        jump: {
          '0%': { transform: 'translateY(-3vh)' },
          '10%': {transform: 'translate(0,0)'},
          '90%': { transform: 'translateX(-100vw)' },
          '100%': { transform: 'translateX(-100vw)' },
        }
      },
      animation: {
        moveOut: 'moveOut 5s forwards',
        moveLeft: 'moveLeft 2s forwards ease-out',
        jump: 'jump 4s forwards',
      }
    },
  },
  plugins: [],
}
