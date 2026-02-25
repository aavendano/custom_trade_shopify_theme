const { defineConfig, devices } = require('@playwright/test');

/**
 * Visual Regression Testing Configuration
 *
 * This configuration is specific for comparing Production (Master) vs Migration (Dev/Ngrok).
 * To run these tests:
 * npx playwright test -c visual_tests/playwright.config.js
 */
module.exports = defineConfig({
  testDir: '.', // Run tests in this directory
  outputDir: 'test-results', // Store artifacts here
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'visual-report' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    // Add Safari/Firefox if needed
  ],
});
