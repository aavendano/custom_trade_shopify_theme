const fs = require('fs');
const path = require('path');

// Read the TwicPics components module
const twicpicsModule = fs.readFileSync(
  path.join(__dirname, 'node_modules/@twicpics/components/webcomponents/module.mjs'),
  'utf8'
);

// Remove export statements and create a bundle that works in Shopify
const processedModule = twicpicsModule
  .replace(/export\s*\{[^}]*\}\s*;?\s*$/gm, '') // Remove export statements
  .replace(/export\s+\{[^}]*\}\s*;?\s*$/gm, '') // Remove export statements with spaces
  .replace(/export\s*$/gm, '') // Remove standalone export
  .replace(/;export\{[^}]*\};?$/gm, ';') // Remove export at end with semicolon
  .replace(/export\{[^}]*\};?$/gm, ''); // Remove export at end without semicolon

const bundle = `(() => {
  // TwicPics Components Bundle for Shopify
  ${processedModule}
  
  // Extract the installTwicPics function (kt in minified code)
  const installTwicPics = kt;
  
  // Initialize TwicPics with your domain
  installTwicPics({
    domain: 'https://playlovetoys.twic.pics',
    anticipation: 0.5,
    step: 100,
    handleShadowDom: true
  });

  // Define custom elements
  customElements.define('twic-img', as);
  customElements.define('twic-video', $s);
  customElements.define('twic-picture', cs);
})();`;

// Write the bundle to assets
fs.writeFileSync(
  path.join(__dirname, 'assets/twicpics-components.js'),
  bundle
);

console.log('✅ TwicPics components bundle created successfully!');