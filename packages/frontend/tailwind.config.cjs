/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    colors: {
      "primary-1": "#F6A740",
      "primary-2": "#26221D",
      "primary-3": "#383129",

      "success": "#46C46E",
      "error": "#ED4245"
    }
  },
  plugins: [],
}