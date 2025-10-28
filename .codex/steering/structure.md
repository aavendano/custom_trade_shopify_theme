# Structure Guidance

- Follow Shopify theme layout: `layout/theme.liquid` bootstraps assets; `sections/` holds reusable page sections; `snippets/` host partials; `templates/` (Liquid/JSON) define page entry points; `blocks/` provides custom block definitions.
- Keep assets organized under `assets/` (CSS/JS/SVG). Critical Bulma Sass lives in `styles/`, compiled via `scripts/build-css.js`; performance tooling scripts reside in `scripts/`.
- Store config JSON (`config/settings_schema.json`, `config/settings_data.json`) governs theme editor options—edit carefully to avoid breaking merchant settings.
- Use `locales/` for translations and `storage/` for generated artifacts (e.g., perf reports). Custom galleries live under `galery-components/`.
- Maintain `node_modules/` for build dependencies and `.codex/specs/` for feature specs guiding ongoing work.
