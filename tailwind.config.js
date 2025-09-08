/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/*.liquid',
    './sections/*.liquid', 
    './snippets/*.liquid',
    './templates/*.liquid',
    './blocks/*.liquid'
  ],
  prefix: 'tw-',
  theme: {
    extend: {},
  },
  plugins: [],
}
