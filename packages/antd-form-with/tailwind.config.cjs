/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [],
  blocklist: [],
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  important: true,
};
