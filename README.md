# Custom Trade Shopify Theme

This repository contains the source code for the Custom Trade Shopify theme.

## Development

### Running the Test Suite

This project includes a suite of unit and integration tests. To run the tests, use the following command:

```bash
npm test
```

### Visual Regression Testing

This project uses Playwright for visual regression testing. This allows you to capture screenshots of key pages and compare them against a baseline to detect unintended visual changes.

**Setup**

1.  Install the necessary dependencies:

    ```bash
    npm install @playwright/test
    npx playwright install
    ```

**Generating Baseline Screenshots**

1.  Before you can run the tests, you need to generate the baseline screenshots. Run the following command:

    ```bash
    npx playwright test --update-snapshots
    ```

    This will run the tests, and since there are no baseline images to compare against, it will create them in the `tests/visual` directory.

**Running the Tests**

1.  Once the baseline screenshots have been generated, you can run the tests at any time to compare the current version of the site against the baseline:

    ```bash
    npx playwright test
    ```

    If there are any visual differences greater than 1%, the tests will fail, and you will be able to see the differences in the generated test report.
