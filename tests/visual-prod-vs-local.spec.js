const { test, expect } = require('@playwright/test');

// Define the two environments
// 1. Production (Source of Truth for Design/Layout)
const PROD_URL = 'https://playlovetoys.ca';

// 2. Local Migration (New Implementation)
// IMPORTANT: User must run a local server (e.g., `python3 -m http.server 8000`)
const LOCAL_URL = 'http://localhost:8000/test-task-6-header.html';

test.describe('Visual Regression: Header', () => {

  test('Compare Production Header vs New AA-Header', async ({ page }) => {
    // 1. Capture Production Baseline
    console.log(`Navigating to Production: ${PROD_URL}`);
    await page.goto(PROD_URL);

    // Wait for header to be stable
    const prodHeader = page.locator('header.site-header, header.header-wrapper, #shopify-section-header'); // Adjust selector based on actual prod DOM
    await expect(prodHeader).toBeVisible();

    // Mask dynamic content (cart count, specific menu items text if they differ)
    // We want to compare STRUCTURE and LAYOUT, not exact text content if data differs
    await page.screenshot({
      path: 'tests/visual/baseline-prod-header.png',
      clip: { x: 0, y: 0, width: 1280, height: 150 } // Approximate header area
    });

    // 2. Capture Local Implementation
    console.log(`Navigating to Local: ${LOCAL_URL}`);
    await page.goto(LOCAL_URL);

    // Wait for Alpine to initialize
    await page.waitForSelector('.aa-header');

    // Take screenshot of the new header
    // Note: The classes are different (.site-header vs .aa-header), so we compare the *visual output*
    // We might not use `expect(page).toHaveScreenshot()` directly because the DOM structure is totally different.
    // Instead, we just capture it for manual review OR we assert specific layout properties.

    await page.screenshot({
      path: 'tests/visual/comparison-local-header.png',
      clip: { x: 0, y: 0, width: 1280, height: 150 }
    });

    console.log('Screenshots captured in tests/visual/. Compare them manually or configure visual diffing with tolerance.');
  });

});
