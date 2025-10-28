# Tech Guidance

- Use Shopify Liquid for theme layout (`layout/`, `sections/`, `snippets/`) and JSON templates inside `templates/`.
- Rely on Bulma (compiled from `styles/` via `scripts/build-css.js`) with custom `b-` prefixed classes, Alpine.js behaviors in `assets/*.js`, and TwicPics web components in `assets/twicpics.js`.
- Build CSS with `npm run build-bulma` (Sass -> critical/async bundles) and `npm run build:css`; bundle JS with `npm run build`. Use `npm run start` for watch mode when editing Sass modules.
- Run automated checks with `npm test` (Node test runner covering performance tooling and CSS build). Execute performance baselines through `node scripts/perf-audit.js` and summarize assets via `node scripts/analyze-assets.js`.
- Keep dependencies in sync: Node (package.json), Sass, esbuild, Playwright (for tests), TwicPics, Bulma, Preline; avoid introducing frameworks that conflict with Shopify’s storefront constraints.
