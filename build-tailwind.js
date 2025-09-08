const fs = require('fs');
const path = require('path');

// Read the base Tailwind CSS
const baseCss = fs.readFileSync(path.join(__dirname, 'node_modules/tailwindcss/index.css'), 'utf8');

// Add prefix only to CSS class selectors (not variables or other values)
const prefixedCss = baseCss.replace(/^(\s*)(\.)([\w-]+)(\s*[{,])/gm, '$1.tw-$3$4');

// Write to output file
fs.writeFileSync('./assets/tailwind-output.css', prefixedCss);

console.log('✅ Tailwind CSS compiled with tw- prefix');
