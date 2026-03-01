/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    colors: {
      current: "currentColor",
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#090E34",
      dark: "#1D2144",
      primary: "#4A6CF7",
      yellow: "#FBB040",
      "body-color": "#959CB1",
      cai: "#95b7d7",
      success: "#05b005",
      error: "#ff0000",
      gray: "#959CB1",
      boxShadow:
        "0 4px 6px rgba(74, 108, 247, 0.1), 0 1px 3px rgba(74, 108, 247, 0.1)",
    },
    screens: {
      xs: "450px",
      // => @media (min-width: 450px) { ... } mobile-view-port

      sm: "575px",
      // => @media (min-width: 576px) { ... } -view-port

      md: "768px",
      // => @media (min-width: 768px) { ... } tablet viewport

      lg: "992px",
      // => @media (min-width: 992px) { ... } desktop viewport

      xl: "1200px",
      // => @media (min-width: 1200px) { ... } desktop viewport

      "2xl": "1400px",
      // => @media (min-width: 1400px) { ... } desktop viewport
    },
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
    },
    extend: {
      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
      },
    },
    extend: {
      colors: {
        "custom-gradient-start": "#020723",
        "custom-gradient-end": "#110D9E",
        "custom-blue": "#5078f2",
        "custom-light": "#b1d8fc",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(135deg, #020723, #03072C, #060943, #0A0A69, #110D9D, #110D9E)",
        "blue-gradient": "linear-gradient(315deg, #5078f2 55%, #b1d8fc 74%)",
        "blue-one-gradient": "linear-gradient(315deg, #95a9fa 0%, #fcfcfe 74%)",
      },
    },
  },
  plugins: [],
};
