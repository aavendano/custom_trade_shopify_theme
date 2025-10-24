const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://playlovetoys.ca/');
  await page.screenshot({ path: 'jules-scratch/verification/after.png' });
  await browser.close();
})();
