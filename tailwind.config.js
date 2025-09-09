/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './blocks/*.liquid',
    'node_modules/preline/dist/*.js'
  ],
  prefix: 'tw-',
  theme: {
    extend: {
      colors: {
        'plt-purple': '#533278',
        'plt-pink': '#F4436C',
        'plt-gray': '#B4B4B4',
        'plt-teal': '#0C7489',
        'plt-gray-green': '#545C52',
        'plt-black': '#000000',
        'plt-white': '#FFFFFF',
        'plt-light-gray': '#F4F4F4',
      }
    },
  },
  plugins: [
    require('./node_modules/preline/dist/index.js'),
  ],
}
