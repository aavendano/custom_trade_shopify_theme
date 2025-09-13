const fs = require('fs');

// Generate basic Tailwind utilities with tw- prefix
const css = `
/* Tailwind CSS utilities with tw- prefix */

/* Display */
.tw-block { display: block; }
.tw-inline-block { display: inline-block; }
.tw-inline { display: inline; }
.tw-flex { display: flex; }
.tw-inline-flex { display: inline-flex; }
.tw-grid { display: grid; }
.tw-hidden { display: none; }

/* Flexbox */
.tw-flex-row { flex-direction: row; }
.tw-flex-col { flex-direction: column; }
.tw-items-start { align-items: flex-start; }
.tw-items-center { align-items: center; }
.tw-items-end { align-items: flex-end; }
.tw-justify-start { justify-content: flex-start; }
.tw-justify-center { justify-content: center; }
.tw-justify-between { justify-content: space-between; }
.tw-justify-around { justify-content: space-around; }
.tw-justify-end { justify-content: flex-end; }

/* Grid */
.tw-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.tw-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tw-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.tw-grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.tw-gap-1 { gap: 0.25rem; }
.tw-gap-2 { gap: 0.5rem; }
.tw-gap-4 { gap: 1rem; }
.tw-gap-6 { gap: 1.5rem; }
.tw-gap-8 { gap: 2rem; }

/* Spacing */
.tw-p-0 { padding: 0; }
.tw-p-1 { padding: 0.25rem; }
.tw-p-2 { padding: 0.5rem; }
.tw-p-3 { padding: 0.75rem; }
.tw-p-4 { padding: 1rem; }
.tw-p-6 { padding: 1.5rem; }
.tw-p-8 { padding: 2rem; }

.tw-px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.tw-px-4 { padding-left: 1rem; padding-right: 1rem; }
.tw-px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.tw-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.tw-py-4 { padding-top: 1rem; padding-bottom: 1rem; }

.tw-m-0 { margin: 0; }
.tw-m-2 { margin: 0.5rem; }
.tw-m-4 { margin: 1rem; }
.tw-mx-auto { margin-left: auto; margin-right: auto; }
.tw-my-4 { margin-top: 1rem; margin-bottom: 1rem; }
.tw-mr-4 { margin-right: 1rem; }

/* Typography */
.tw-text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.tw-text-base { font-size: 1rem; line-height: 1.5rem; }
.tw-text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.tw-text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.tw-text-2xl { font-size: 1.5rem; line-height: 2rem; }
.tw-text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

.tw-font-normal { font-weight: 400; }
.tw-font-medium { font-weight: 500; }
.tw-font-semibold { font-weight: 600; }
.tw-font-bold { font-weight: 700; }

.tw-text-left { text-align: left; }
.tw-text-center { text-align: center; }
.tw-text-right { text-align: right; }

/* Colors */
.tw-text-white { color: #ffffff; }
.tw-text-black { color: #000000; }
.tw-text-gray-500 { color: #6b7280; }
.tw-text-gray-600 { color: #4b5563; }
.tw-text-blue-500 { color: #3b82f6; }
.tw-text-red-500 { color: #ef4444; }

.tw-bg-white { background-color: #ffffff; }
.tw-bg-black { background-color: #000000; }
.tw-bg-gray-100 { background-color: #f3f4f6; }
.tw-bg-blue-500 { background-color: #3b82f6; }
.tw-bg-red-500 { background-color: #ef4444; }

/* Custom colors */
.tw-text-pltPurple { color: #533278; }
.tw-text-pltPink { color: #F4436C; }
.tw-text-pltGray { color: #B4B4B4; }
.tw-text-pltTeal { color: #0C7489; }
.tw-text-pltGrayGreen { color: #545C52; }
.tw-text-pltLightGray { color: #F4F4F4; }

.tw-bg-pltPurple { background-color: #533278; }
.tw-bg-pltPink { background-color: #F4436C; }
.tw-bg-pltGray { background-color: #B4B4B4; }
.tw-bg-pltTeal { background-color: #0C7489; }
.tw-bg-pltGrayGreen { background-color: #545C52; }
.tw-bg-pltLightGray { background-color: #F4F4F4; }

/* Borders */
.tw-rounded { border-radius: 0.25rem; }
.tw-rounded-lg { border-radius: 0.5rem; }

/* Width/Height */
.tw-w-full { width: 100%; }
.tw-h-auto { height: auto; }

/* Responsive utilities */
@media (min-width: 768px) {
  .md\\:tw-text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .md\\:tw-flex-row { flex-direction: row; }
}

@media (min-width: 1024px) {
  .lg\\:tw-text-xl { font-size: 1.25rem; line-height: 1.75rem; }
}
`;

fs.writeFileSync('./assets/tailwind-output.css', css.trim());
console.log('✅ Tailwind CSS compiled with tw- prefix');
