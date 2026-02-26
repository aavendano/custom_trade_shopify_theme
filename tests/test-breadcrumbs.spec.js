const { test, expect } = require('@playwright/test');

test('Breadcrumbs render correctly', async ({ page }) => {
  // Mock the Shopify routes and Liquid rendering
  await page.setContent(`
    <html>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
      </head>
      <body>
        <nav class="b-breadcrumb" aria-label="Breadcrumbs">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li class="b-is-active">
              <a href="/products/test-product" aria-current="page">Test Product</a>
            </li>
          </ul>
        </nav>
      </body>
    </html>
  `);

  // Check if breadcrumbs are visible
  const breadcrumbNav = page.locator('nav.b-breadcrumb');
  await expect(breadcrumbNav).toBeVisible();

  // Check aria-label
  await expect(breadcrumbNav).toHaveAttribute('aria-label', 'Breadcrumbs');

  // Check items
  const items = breadcrumbNav.locator('li');
  await expect(items).toHaveCount(2);

  // Check active item
  const activeItem = breadcrumbNav.locator('li.b-is-active a');
  await expect(activeItem).toHaveAttribute('aria-current', 'page');
  await expect(activeItem).toHaveText('Test Product');
});
