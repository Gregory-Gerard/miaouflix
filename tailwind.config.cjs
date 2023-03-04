const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        outline: 'inset 0 0 0 1px hsl(0deg 0% 100% / 10%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
