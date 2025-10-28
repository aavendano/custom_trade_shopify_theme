# Implementation Plan

- [x] 1. Capture baseline performance metrics with MCP tooling
  - Prompt: "Create `scripts/perf-audit.js` that runs Playwright-powered Lighthouse probes via MCP against home, collection, and product templates, exporting JSON reports to `storage/perf-reports/{timestamp}.json` with LCP, CLS, FID, TTFB, and blocking asset details. Include retry logic (3 attempts, exponential backoff) and a CLI interface (`--templates`, `--output`, `--base-url`). Add unit tests for CLI flag parsing and retry handling."
  - _Requirements: R1.1, R1.2, R1.3_

- [x] 1.1 Build asset analyzer for render-blocking resources
  - Prompt: "Implement `scripts/analyze-assets.js` that ingests the baseline JSON reports, extracts render-blocking assets, annotates third-party origins, and outputs both Markdown and CSV summaries. Ensure tests cover third-party tagging and missing file warnings."
  - _Requirements: R1.2, R1.3_

- [x] 2. Refactor CSS delivery for critical path performance
  - Prompt: "Split `custom-bulma-project.scss` into critical and async bundles while migrating to Bulma's module-based `@use` imports so only required components ship. Inline critical CSS in `layout/theme.liquid`, lazy-load the async bundle with a preload-onload swap, and preserve all `b-` prefixed classes alongside native Shopify selectors. Add integration tests that confirm critical selectors render and async CSS attaches post-load."
  - _Requirements: R2.1, R3.1_

- [x] 2.1 Adopt module-scoped Bulma imports and safeguards
  - Prompt: "Replace any remaining global Bulma imports with explicit module-level `@use` statements for both critical and async bundles. Add automated checks that fail the build if legacy `@import` usage returns, and cover tests ensuring required `b-` selectors remain available without relying on PurgeCSS."
  - _Requirements: R2.1_

- [ ] 3. Optimize JavaScript loading and preserve Alpine.js interactions
  - Prompt: "Convert major bundles (e.g., `assets/global.js`, `assets/cart.js`) to ES modules with `type=module` and `defer`. Implement a dependency manifest generator at `scripts/build-js-manifest.js` that orders Alpine component registration before dependent scripts. Add Playwright smoke tests to validate Alpine-driven interactions remain functional."
  - _Requirements: R2.3, R3.2_

- [ ] 3.1 Implement lazy loading for interaction-heavy sections
  - Prompt: "Add IntersectionObserver wrappers that dynamically import Alpine-enhanced sections (e.g., quick add, cart drawer) when they enter the viewport, ensuring hydration order respects the manifest. Include unit tests mocking the observer lifecycle."
  - _Requirements: R2.3, R3.2_

- [ ] 4. Standardize TwicPics media delivery
  - Prompt: "Create `snippets/twic-media.liquid` that wraps `<twic-picture>` (with `<noscript>` fallback) for product imagery. Parameterize responsive breakpoints aligned with Bulma columns and ensure compatibility with ongoing TwicPics migration. Add unit tests for markup output and fallback behavior."
  - _Requirements: R2.2, R3.1_

- [ ] 4.1 Integrate TwicPics usage across product and collection templates
  - Prompt: "Refactor product and collection media snippets to use the new TwicPics wrapper, ensuring above-the-fold assets receive optimized presets and lazy loading thresholds. Validate via Liquid unit tests or snapshot tests that visual attributes remain unchanged."
  - _Requirements: R2.2, R3.1_

- [ ] 5. Establish visual regression and interaction safeguards
  - Prompt: "Author Playwright-based visual regression suite in `tests/visual/run.js` capturing desktop and mobile baselines for home, collection, and product templates. Fail when diffs exceed 1% and store approvals for rollbacks."
  - _Requirements: R3.1, R3.3_

- [ ] 5.1 Automate reporting and comparison workflows
  - Prompt: "Implement npm scripts `perf:baseline`, `perf:compare`, and `perf:report` that run audits before/after, diff metrics, and regenerate `storage/perf-summary.md` with charts and prioritized follow-ups when targets are missed. Include tests for the diffing logic and report generation."
  - _Requirements: R4.1, R4.2, R4.3_

- [ ] 5.2 Validate performance targets post-optimization
  - Prompt: "Create automated checks that assert post-optimization metrics meet the >20% LCP and >10% CLS improvements by comparing baseline and current reports, emitting actionable failures listing remaining opportunities."
  - _Requirements: R4.1, R4.3_
