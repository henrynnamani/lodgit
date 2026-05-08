/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        lodge: {
          50: "#fff8f1",
          100: "#ffecd8",
          200: "#ffd5a8",
          300: "#ffb870",
          400: "#ff8f33",
          500: "#ff6b0a",
          600: "#f04f00",
          700: "#c73700",
          800: "#9e2e07",
          900: "#7f280b",
        },
        dark: {
          900: "#0d0d0d",
          800: "#141414",
          700: "#1c1c1c",
          600: "#242424",
          500: "#2e2e2e",
        },
      },
    },
  },
  plugins: [],
};
