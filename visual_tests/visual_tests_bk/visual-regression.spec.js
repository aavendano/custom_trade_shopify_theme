const { test, expect } = require('@playwright/test');

// Configuration:
// To generate baseline (Source of Truth):
// TEST_TARGET_URL=https://playlovetoys.ca npx playwright test -c visual_tests/playwright.config.js --update-snapshots
//
// To compare Migration (Local):
// npx playwright test -c visual_tests/playwright.config.js

const TARGET_URL = process.env.TEST_TARGET_URL || 'https://monkey-tight-lab.ngrok-free.app';

test.describe('Visual Regression Tests', () => {

    // Mask dynamic elements to avoid false positives
    const maskSelectors = [
        '.aa-header__cart-count',
        '.cart-count-bubble',
        '.announcement-bar',
        '[id^="shopify-section-announcement"]',
        'iframe',
        'video',
        'time',
        '.shopify-section-popup', // Newsletter popups
        '[data-section-type="slideshow"]' // Slideshows are hard to sync
    ];

    test.beforeEach(async ({ page }) => {
        console.log(`Navigating to: ${TARGET_URL}`);
        await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

        // Hide dynamic elements before any screenshot
        await page.addStyleTag({ content: `${maskSelectors.join(', ')} { opacity: 0 !important; visibility: hidden !important; }` });
    });

    test('Homepage Full Page', async ({ page }) => {
        // Capture full page screenshot
        // Compares against visual_tests/visual-regression.spec.js-snapshots/homepage.png
        await expect(page).toHaveScreenshot('homepage.png', {
            fullPage: true,
            maxDiffPixels: 3000 // Tolerance for minor rendering diffs
        });
    });

    test('Header Component', async ({ page }) => {
        // Target the header element explicitly
        // Supports both legacy (.site-header) and new (.aa-header) classes
        const header = page.locator('header.site-header, header.aa-header, #shopify-section-header').first();

        await expect(header).toHaveVisible();
        await expect(header).toHaveScreenshot('header.png', { maxDiffPixels: 1000 });
    });

    test('Footer Component', async ({ page }) => {
        // Target the footer element
        const footer = page.locator('footer.site-footer, footer.aa-footer, #shopify-section-footer').first();

        await expect(footer).toHaveVisible();
        await expect(footer).toHaveScreenshot('footer.png', { maxDiffPixels: 1000 });
    });
});
