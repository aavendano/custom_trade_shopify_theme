## Bulma‑Alpine Stack Steering Document

**Purpose**: Provide concrete, project‑specific guidance for developing within the Bulma‑Alpine stack used by the PlayLoveToys theme. These instructions are to be followed by any AI agent working on this codebase.

### Core Principles

- **Mobile‑First** – Design and implement UI first for mobile devices; desktop is an extension, never a separate design.
- **Performance‑First** – Target LCP < 2.5 s, CLS ≈ 0, minimal JavaScript, and aggressively purge unused CSS.
- **Bulma‑Centric** – Use Bulma classes as the primary styling mechanism. Custom SCSS must be prefixed with `b-` and only added when Bulma cannot express the required style.
- **Alpine‑Only Interactivity** – All interactive behavior must be implemented with Alpine.js. Do **not** introduce any additional JavaScript frameworks or libraries.

### Styling Rules

1. **CSS Framework**: Bulma is the sole CSS framework. No Tailwind, Bootstrap, or other CSS libraries.
2. **Custom SCSS**: Prefix every custom class with `b-`. Keep custom SCSS minimal and scoped.
3. **PurgeCSS**: Run PurgeCSS on every build; ensure final CSS bundle is ~14–16 KB minified.
4. **Typography**: Use fluid typography (`clamp()`) only when it adds clear visual value.
5. **Images**:
   - All images must be 1:1 aspect ratio.
   - Lazy‑load non‑LCP images on mobile.
   - Prioritize LCP images for fast loading.
6. **Skeleton Loaders**: Implement skeleton loaders using Bulma components combined with Alpine for state control.
7. **No External Sliders**: Do not add Swiper, Slick, or any third‑party carousel libraries. Use native horizontal scroll with `scroll‑snap` when needed.

### JavaScript Rules

- **Alpine.js Only**: Use Alpine for all dynamic UI. No vanilla JS libraries, no heavy frameworks.
- **Inline Scripts**: Prefer inline Alpine directives (`x-data`, `x-show`, etc.) when possible.
- **No External JS**: Do not import additional JS files or npm packages.

### Code Hygiene

- **Remove Dead Code**: During any migration or refactor, delete unused classes, JS, and CSS.
- **Consolidate Duplicates**: Merge duplicated components and SCSS snippets.
- **Simplify Liquid**: Keep Liquid templates minimal; remove unnecessary logic.
- **Prohibitions**:
  - Do not introduce new frameworks or libraries.
  - Do not sacrifice performance for visual flair.
  - Do not reinvent Bulma functionality.

### Quality Assurance

- **Responsive Checks**: Verify every component renders correctly on mobile and scales gracefully to desktop.
- **Performance Audits**: Run Lighthouse on each PR; ensure LCP, CLS, and FCP targets are met.
- **Visual Consistency**: Ensure Bulma classes are used before any custom `b-` classes; maintain visual language of PlayLoveToys.
- **Testing**: Add unit tests for Alpine state where applicable; ensure no JavaScript errors in the console.

### Final State

When a feature is complete, the theme should:

- Feel handcrafted for PlayLoveToys, not a generic template.
- Load quickly, with clean, maintainable code that can be understood within minutes.
- Be ready to scale with additional mobile‑first features without breaking performance.

_These instructions replace any generic “best‑practice” advice and are the definitive guide for this repository._
