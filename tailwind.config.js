/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './blocks/*.liquid'
  ],
  theme: {
    extend: {
      colors: {
        pltPurple: '#533278',
        pltPink: '#F4436C',
        pltGray: '#B4B4B4',
        pltTeal: '#0C7489',
        pltGrayGreen: '#545C52',
        pltBlack: '#000000',
        pltWhite: '#FFFFFF',
        pltLightGray: '#F4F4F4',
      }
    },
  },
  plugins: [],
}
