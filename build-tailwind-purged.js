const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Comprehensive Tailwind utilities
const tailwindUtilities = {
  // Layout
  'tw-block': 'display: block',
  'tw-inline-block': 'display: inline-block', 
  'tw-flex': 'display: flex',
  'tw-inline-flex': 'display: inline-flex',
  'tw-grid': 'display: grid',
  'tw-hidden': 'display: none',
  
  // Grid
  'tw-grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr))',
  'tw-grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr))',
  'tw-grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr))',
  'tw-gap-4': 'gap: 1rem',
  'tw-gap-6': 'gap: 1.5rem',
  'tw-gap-8': 'gap: 2rem',
  
  // Flexbox
  'tw-flex-col': 'flex-direction: column',
  'tw-items-center': 'align-items: center',
  'tw-justify-center': 'justify-content: center',
  'tw-justify-between': 'justify-content: space-between',
  
  // Spacing
  'tw-p-4': 'padding: 1rem',
  'tw-px-4': 'padding-left: 1rem; padding-right: 1rem',
  'tw-px-6': 'padding-left: 1.5rem; padding-right: 1.5rem',
  'tw-px-8': 'padding-left: 2rem; padding-right: 2rem',
  'tw-py-3': 'padding-top: 0.75rem; padding-bottom: 0.75rem',
  'tw-py-4': 'padding-top: 1rem; padding-bottom: 1rem',
  'tw-py-8': 'padding-top: 2rem; padding-bottom: 2rem',
  'tw-py-12': 'padding-top: 3rem; padding-bottom: 3rem',
  'tw-py-16': 'padding-top: 4rem; padding-bottom: 4rem',
  'tw-py-24': 'padding-top: 6rem; padding-bottom: 6rem',
  'tw-m-auto': 'margin: auto',
  'tw-mx-auto': 'margin-left: auto; margin-right: auto',
  'tw-mb-4': 'margin-bottom: 1rem',
  'tw-mb-6': 'margin-bottom: 1.5rem',
  'tw-mb-8': 'margin-bottom: 2rem',
  
  // Sizing
  'tw-w-full': 'width: 100%',
  'tw-h-auto': 'height: auto',
  'tw-max-w-4xl': 'max-width: 56rem',
  
  // Typography
  'tw-text-lg': 'font-size: 1.125rem; line-height: 1.75rem',
  'tw-text-xl': 'font-size: 1.25rem; line-height: 1.75rem',
  'tw-text-2xl': 'font-size: 1.5rem; line-height: 2rem',
  'tw-text-3xl': 'font-size: 1.875rem; line-height: 2.25rem',
  'tw-text-4xl': 'font-size: 2.25rem; line-height: 2.5rem',
  'tw-text-5xl': 'font-size: 3rem; line-height: 1',
  'tw-font-medium': 'font-weight: 500',
  'tw-font-semibold': 'font-weight: 600',
  'tw-font-bold': 'font-weight: 700',
  'tw-text-left': 'text-align: left',
  'tw-text-center': 'text-align: center',
  'tw-text-right': 'text-align: right',
  'tw-leading-relaxed': 'line-height: 1.625',
  
  // Colors
  'tw-text-white': 'color: rgb(255 255 255)',
  'tw-text-gray-700': 'color: rgb(55 65 81)',
  'tw-text-gray-900': 'color: rgb(17 24 39)',
  'tw-text-blue-900': 'color: rgb(30 58 138)',
  'tw-bg-white': 'background-color: rgb(255 255 255)',
  'tw-bg-gray-50': 'background-color: rgb(249 250 251)',
  'tw-bg-gray-100': 'background-color: rgb(243 244 246)',
  'tw-bg-blue-50': 'background-color: rgb(239 246 255)',
  'tw-bg-blue-600': 'background-color: rgb(37 99 235)',
  'tw-bg-blue-700': 'background-color: rgb(29 78 216)',
  
  // Border & Effects
  'tw-rounded-lg': 'border-radius: 0.5rem',
  'tw-rounded-xl': 'border-radius: 0.75rem',
  'tw-shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'tw-shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  
  // Interactive
  'tw-inline-block': 'display: inline-block',
  'tw-transition-colors': 'transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms',
  
  // Order
  'tw-order-1': 'order: 1',
  'tw-order-2': 'order: 2'
};

// Scan all Liquid files for Tailwind classes
function scanForClasses() {
  const files = glob.sync('./{layout,sections,snippets,templates,blocks}/**/*.liquid');
  let usedClasses = new Set();
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Find tw- classes in class attributes and liquid variables
    const matches = content.match(/tw-[\w-]+/g) || [];
    matches.forEach(cls => usedClasses.add(cls));
  });
  
  return Array.from(usedClasses);
}

// Generate CSS with used classes
function generateCSS(usedClasses) {
  let css = '/* Tailwind CSS - Purged with tw- prefix */\n\n';
  
  usedClasses.forEach(className => {
    if (tailwindUtilities[className]) {
      css += `.${className} { ${tailwindUtilities[className]}; }\n`;
    }
  });
  
  // Add responsive variants for used classes
  css += '\n/* Responsive variants */\n';
  css += '@media (min-width: 768px) {\n';
  usedClasses.forEach(className => {
    if (tailwindUtilities[className]) {
      css += `  .md\\:${className} { ${tailwindUtilities[className]}; }\n`;
    }
  });
  css += '}\n';
  
  // Add hover states for interactive elements
  css += '\n/* Hover states */\n';
  css += '.tw-bg-blue-600:hover { background-color: rgb(29 78 216); }\n';
  css += '.hover\\:tw-bg-blue-700:hover { background-color: rgb(29 78 216); }\n';
  
  return css;
}

const usedClasses = scanForClasses();
const css = generateCSS(usedClasses);

fs.writeFileSync('./assets/tailwind-output.css', css);

console.log(`✅ Purged CSS generated with ${usedClasses.length} classes:`, usedClasses);
