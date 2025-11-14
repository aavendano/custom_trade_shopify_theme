// @ts-check
const { test, expect } = require('@playwright/test');

test('add to cart flow', async ({ page }) => {
    // Navigate to a product page
    await page.goto('/products/hitachi-magicwand-mini');

    // Take a screenshot to debug
    await page.screenshot({ path: 'product-page.png' });

    // Start waiting for the cart/add.js response before clicking
    const responsePromise = page.waitForResponse(response =>
        response.url().includes('/cart/add') && response.status() === 200
    );

    // Add the product to the cart
    await page.locator('button[name="add"]').click({ timeout: 10000 });

    // Wait for the response to be received
    await responsePromise;

    // Go to the cart page
    await page.goto('/cart');

    // Verify that the correct product is in the cart
    await expect(page.locator('a.cart-item__name[href*="/products/hitachi-magicwand-mini"]')).toBeVisible();

    // Proceed to the checkout page
    await page.locator('button[name="checkout"]').click();

    // Verify that we are on the checkout page
    await expect(page).toHaveURL(/.*checkouts.*/);
});
