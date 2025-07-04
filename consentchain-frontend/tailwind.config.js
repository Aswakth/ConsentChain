/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Geist Mono"', "monospace"],
        clash: ["ClashDisplay", "sans-serif"],
      },
    },
  },
  plugins: [],
};
