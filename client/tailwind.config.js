/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Dark cinema palette used across the app.
        night: "#0b0d14",
        surface: "#151824",
        surfaceHover: "#1d2131",
        edge: "#262b3d",
        gold: "#f5c518",
        muted: "#9aa3b8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
