const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://asgiti-0w.myshopify.com/?preview_theme_id=134868467787', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'jules-scratch/rendering_verification.png', fullPage: true });
  await browser.close();
})();
