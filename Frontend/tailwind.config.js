/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
        },
        colors: {
          primary: "#f5f6f2",
          secondary: "#8ac243",
          tertiary: "#222222",
          secondaryRed: "#f42c37",
          secondaryYellow: "#fdc62e",
          secondaryGreen: "#2dcc6f",
          secondaryBlue: "#1376f4",
          secondaryWhite: "#eeeeee",
          gray: {
            10: "#EEEEEE",
            20: "#A2A2A2",
            30: "#7B7B7B",
            50: "#585858",
            90: "#141414",
          },
        },
        container: {
          center: true,
          padding: {
            DEFAULT: "1rem",
            sm: "2rem",
            lg: "4rem",
            xl: "5rem",
            "2xl": "6rem",
          },
        },
      },
    },
    animation: {
      'scroll': 'scroll 30s linear infinite',
    }
  },
  plugins: [flowbite.plugin(),],
}