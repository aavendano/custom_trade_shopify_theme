const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  const pages = [
    { name: 'home', path: '/' },
    { name: 'collection', path: '/collections/all' },
    { name: 'product', path: '/products/example' },
  ];

  for (const { name, path } of pages) {
    test(`- ${name} page`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveScreenshot({ maxDiffPixels: 0.01 });
    });
  }
});
