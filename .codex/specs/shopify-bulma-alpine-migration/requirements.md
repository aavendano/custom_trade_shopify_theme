# Requirements Document

## Introduction

This document defines the requirements for migrating the PlayLoveToys Shopify theme from its current hybrid state (Dawn legacy + b-Bulma-Alpine) to a pure b-Bulma-Alpine architecture. The current theme suffers from double CSS/JS loading, specificity conflicts, and degraded performance due to loading both legacy Dawn assets (`base.css`, `global.js`) and modern b-Bulma-Alpine assets simultaneously. This migration will eliminate legacy code, standardize on Bulma CSS with Alpine.js for interactivity, and optimize for mobile-first performance. The migration follows an incremental, phase-by-phase approach to maintain store functionality throughout the process.

The target architecture consists of:
- **CSS Framework:** Bulma CSS with custom extensions (prefixed with `b-`)
- **JavaScript Framework:** Alpine.js for all interactivity
- **Image Strategy:** Lazy loading with explicit dimensions, 1:1 aspect ratios on mobile
- **Performance Goals:** Optimized LCP, eliminated FOUC, purged unused CSS

---

## Requirements

### Requirement 1: Foundation Setup

**User Story:** As a developer, I want to establish the b-Bulma CSS framework as the primary styling authority, so that I can eliminate legacy Dawn CSS and ensure consistent styling across the theme.

#### Acceptance Criteria

1. WHEN the theme loads THEN the system SHALL load only `a-bulma-purged.css` and NOT load `base.css` or any `component-*.css` files from Dawn
2. WHEN `layout/theme.liquid` is rendered THEN the system SHALL include CSS reset and Bulma helper classes from `a-bulma-purged.css`
3. WHEN critical Shopify theme variables (colors, fonts) are defined THEN the system SHALL convert them to CSS custom properties that Bulma can consume
4. WHEN deferred scripts are evaluated in `theme.liquid` THEN the system SHALL exclude all unnecessary legacy scripts from Dawn
5. WHEN migrated HTML components render during phases 1-6 THEN the system SHALL wrap them in a `b-scope` container to prevent collisions with legacy styles
6. WHEN the theme loads THEN the system SHALL display correct typography with no console errors related to missing CSS variables
7. IF legacy Dawn token references exist THEN the system SHALL NOT depend on them in any migrated component

### Requirement 2: Global Navigation Migration

**User Story:** As a shopper, I want a responsive navigation header and footer on all pages, so that I can easily navigate the store on both mobile and desktop devices.

#### Acceptance Criteria

1. WHEN the header section renders THEN the system SHALL replace `sections/header.liquid` with `sections/aa-header.liquid` using Bulma Nav components
2. WHEN the footer section renders THEN the system SHALL replace `sections/footer.liquid` with `sections/aa-footer.liquid` using Bulma Footer components
3. WHEN a mobile user taps the menu toggle THEN the system SHALL use Alpine.js with `x-data="{ open: false }"` to control the mobile menu state
4. WHEN the mobile menu opens or closes THEN the system SHALL animate smoothly without layout shifts
5. WHEN the navigation components render THEN the system SHALL NOT load `component-list-menu.css`
6. WHEN Bulma Nav classes are applied THEN the system SHALL use only classes with `b-` prefix
7. IF the viewport width is less than 768px THEN the system SHALL display the mobile menu toggle button

### Requirement 3: Product Card Component Migration

**User Story:** As a developer, I want a reusable, performant product card component, so that product grids load quickly and display consistently across the theme.

#### Acceptance Criteria

1. WHEN product cards render THEN the system SHALL replace `snippets/card-product.liquid` with `snippets/c-product-card.liquid`
2. WHEN product images are rendered in cards THEN the system SHALL use 1:1 aspect ratio containers with `class="b-image b-is-square"`
3. WHEN product images are loaded THEN the system SHALL use `image_tag` with `loading: 'lazy'` attribute
4. WHEN product card content renders THEN the system SHALL include title, price, and action button (Add/Quick View) using `b-` prefixed classes
5. WHEN product cards are used in `sections/featured-collection.liquid` THEN the system SHALL replace legacy card usage with the new `c-product-card.liquid` snippet
6. WHEN layout is required THEN the system SHALL use Bulma column classes and SHALL NOT use custom CSS Grid code
7. WHEN two product card variants are needed THEN the system SHALL provide `c-product-card--vertical` (default) and `c-product-card--horizontal-mobile` (image left, text right)
8. IF the viewport is mobile THEN the system SHALL prefer the horizontal-mobile variant for better UX

### Requirement 4: Homepage Hero Section Migration

**User Story:** As a shopper, I want to see an appealing, fast-loading hero banner on the homepage, so that I immediately understand the store's brand and offerings.

#### Acceptance Criteria

1. WHEN the hero section renders THEN the system SHALL replace `sections/image-banner.liquid` with `sections/aa-hero.liquid`
2. WHEN hero images are displayed on mobile THEN the system SHALL use 1:1 aspect ratio images
3. WHEN hero images are displayed on desktop THEN the system SHALL use 2:1 aspect ratio images (or as specified by design)
4. WHEN text overlays are applied THEN the system SHALL use Bulma overlay classes
5. WHEN the hero image loads THEN the system SHALL set `fetchpriority="high"` and `loading="eager"` to optimize LCP
6. WHEN the hero renders THEN the system SHALL use only Bulma classes with `b-` prefix for styling
7. IF the hero image is the largest contentful paint element THEN the system SHALL prioritize its loading to minimize LCP time

### Requirement 5: Product Detail Page Migration

**User Story:** As a shopper, I want a smooth product viewing and purchasing experience with variant selection and add-to-cart functionality, so that I can quickly buy products without page reloads.

#### Acceptance Criteria

1. WHEN the PDP loads THEN the system SHALL replace `sections/main-product.liquid` with `sections/aa-main-product.liquid`
2. WHEN cart operations are performed THEN the system SHALL use Shopify Cart AJAX API as the source of truth
3. WHEN Alpine Store manages cart state THEN the system SHALL only cache and re-render UI, with all mutations passing through Shopify endpoints and refreshing state from `/cart.js`
4. WHEN product gallery is displayed THEN the system SHALL use native CSS Scroll Snap and SHALL NOT use JavaScript slider libraries
5. WHEN variant selectors are rendered THEN the system SHALL use Alpine.js to manage state with `x-data="{ selectedVariant: ... }"`
6. WHEN a variant is selected THEN the system SHALL update price and gallery images reactively using Alpine.js
7. WHEN add-to-cart is triggered THEN the system SHALL submit via AJAX using Alpine.js handlers
8. WHEN product images are loaded THEN the system SHALL include explicit `width` and `height` attributes
9. IF variant selection changes product state THEN the system SHALL reflect changes without page reload

### Requirement 6: Cart Experience Migration

**User Story:** As a shopper, I want to view and modify my cart in real-time via a drawer or cart page, so that I can review my order before checkout without navigating away.

#### Acceptance Criteria

1. WHEN cart components render THEN the system SHALL update `snippets/cart-drawer.liquid` and `sections/main-cart.liquid`
2. WHEN cart operations are performed THEN the system SHALL use Shopify Cart AJAX API as the source of truth
3. WHEN Alpine Store manages cart state THEN the system SHALL only cache and re-render UI, with all mutations passing through Shopify endpoints and refreshing state from `/cart.js`
4. WHEN the cart drawer is triggered THEN the system SHALL control it 100% via `Alpine.store('cart')`
5. WHEN cart contents change THEN the system SHALL update the UI in real-time without page reload
6. WHEN free shipping threshold is relevant THEN the system SHALL display a progress bar using `<progress class="b-progress">`
7. WHEN cart quantities are adjusted THEN the system SHALL persist changes via AJAX and update the UI reactively
8. IF the cart drawer is open THEN the system SHALL allow closing via Alpine.js event handlers

### Requirement 7: Legacy Code Removal

**User Story:** As a developer, I want to completely remove legacy Dawn assets and code, so that the theme only loads necessary CSS/JS and achieves optimal performance.

#### Acceptance Criteria

1. WHEN all migration phases are complete THEN the system SHALL remove the `{{ 'base.css' | asset_url | stylesheet_tag }}` reference from `theme.liquid`
2. WHEN all migration phases are complete THEN the system SHALL delete `assets/global.js` and remove all references to it
3. WHEN all migration phases are complete THEN the system SHALL delete all `assets/component-*.css` files
4. WHEN all migration phases are complete THEN the system SHALL delete legacy Dawn sections: `image-banner.liquid`, `header.liquid`, `footer.liquid`
5. WHEN all migration phases are complete THEN the system SHALL delete legacy snippets: `card-product.liquid`, `price.liquid` (if using Dawn-specific classes)
6. WHEN all migration phases are complete THEN the system SHALL delete legacy JS files: `details-disclosure.js`, `cart.js`, `product-form.js`
7. WHEN final PurgeCSS is executed THEN the system SHALL verify that no dynamically generated styles are broken
8. WHEN the theme loads post-cleanup THEN the system SHALL display correctly with no console errors or visual regressions

### Requirement 8: Code Quality and Standards

**User Story:** As a developer, I want all migrated code to follow b-Bulma-Alpine coding standards, so that the codebase is maintainable and consistent.

#### Acceptance Criteria

1. WHEN CSS classes are applied THEN the system SHALL use only classes with `b-` prefix (e.g., `b-columns`, `b-button`, `b-is-primary`)
2. WHEN interactivity is needed THEN the system SHALL implement it using Alpine.js directives (`x-data`, `@click`, `x-show`, etc.)
3. WHEN DOM access is required THEN the system SHALL use Alpine.js `x-ref` and SHALL NOT use `document.querySelector`
4. WHEN images are rendered THEN the system SHALL wrap them in aspect-ratio containers using `b-image` classes
5. WHEN responsive layouts are created THEN the system SHALL use mobile-first Bulma column classes (e.g., `b-column b-is-12-mobile b-is-4-desktop`)
6. WHEN semantic HTML is required THEN the system SHALL use `<section>`, `<article>`, `<header>`, `<footer>` elements
7. WHEN custom CSS is absolutely necessary THEN the system SHALL place it in `src/bulma/custom` directory
8. WHEN CSS specificity issues arise THEN the system SHALL resolve them by refactoring source styles and SHALL NOT use `!important`
9. IF third-party JavaScript libraries are considered THEN the system SHALL NOT import Swiper, Slick, jQuery, or Lodash
10. IF legacy Dawn code is encountered THEN the system SHALL rewrite it using Alpine.js patterns instead of copying

### Requirement 9: Performance and SEO

**User Story:** As a store owner, I want the theme to load quickly and rank well in search engines, so that I can maximize conversions and organic traffic.

#### Acceptance Criteria

1. WHEN images are rendered THEN the system SHALL include explicit `width` and `height` attributes
2. WHEN images are not critical THEN the system SHALL use `loading="lazy"` attribute
3. WHEN the LCP image is identified THEN the system SHALL use `loading="eager"` and `fetchpriority="high"`
4. WHEN Alpine.js elements are hidden THEN the system SHALL use `x-cloak` with CSS rule `[x-cloak] { display: none !important; }` to prevent FOUC
5. WHEN each page is rendered THEN the system SHALL include a proper, descriptive `<title>` tag
6. WHEN each page is rendered THEN the system SHALL include a compelling meta description that accurately summarizes page content
7. WHEN heading structure is defined THEN the system SHALL use a single `<h1>` per page with proper hierarchy (`h2`, `h3`, etc.)
8. WHEN semantic HTML5 is applicable THEN the system SHALL use appropriate semantic elements
9. WHEN interactive elements are created THEN the system SHALL assign unique, descriptive IDs for accessibility and testing
10. WHEN page performance is measured THEN the system SHALL achieve optimized page load times through CSS/JS optimization
11. IF dynamic Liquid classes are used THEN the system SHALL safelist them in `src/purge/extract-b-safelist.js` to prevent PurgeCSS removal

### Requirement 10: Risk Mitigation and Validation

**User Story:** As a developer, I want to validate each migrated section thoroughly, so that I can catch issues early and maintain store functionality throughout migration.

#### Acceptance Criteria

1. WHEN a phase is marked complete THEN the system SHALL verify that mobile view (375px width) displays correctly
2. WHEN a phase is marked complete THEN the system SHALL verify that LCP is optimized with priority image loading
3. WHEN a phase is marked complete THEN the system SHALL verify that no references to `base.css` or Dawn classes remain
4. WHEN a phase is marked complete THEN the system SHALL verify that no `console.error` messages appear in browser console
5. WHEN a phase is marked complete THEN the system SHALL verify that `x-cloak` is used where appropriate to prevent FOUC
6. WHEN a phase is marked complete THEN the system SHALL verify that images have explicit `width`, `height`, and correct `loading` attributes
7. WHEN a phase is marked complete THEN the system SHALL verify that Bulma columns and helpers are used instead of custom CSS
8. WHEN a phase is marked complete THEN the system SHALL run Lighthouse audit to validate SEO and accessibility
9. IF external Shopify apps inject content THEN the system SHALL use `x-ignore` on those containers to prevent Alpine.js conflicts
10. IF dynamically generated Liquid classes exist THEN the system SHALL either use full class names or add them to PurgeCSS safelist

### Requirement 11: Configuration and Merchant Settings

**User Story:** As a store owner, I want to preserve my theme customizations and settings through the migration, so that I don't lose my store's configuration.

#### Acceptance Criteria

1. WHEN the migration is executed THEN the system SHALL preserve all data in `config/settings_schema.json`
2. WHEN the migration is executed THEN the system SHALL preserve all data in `locales/*` translation files
3. WHEN the migration is executed THEN the system SHALL maintain `templates/*.json` structure to preserve merchant section configurations
4. WHEN the migration is executed THEN the system SHALL update section references in `templates/*.json` to point to new migrated sections
5. IF visual settings in `settings_schema.json` no longer apply THEN the system SHALL remove or update them to match b-Bulma architecture
6. IF merchant has customized colors or fonts THEN the system SHALL migrate those values to Bulma SASS variables

---

## Appendix: Phase Mapping

This appendix maps requirements to migration phases for developer reference:

- **Phase 1 (Foundation):** Requirement 1
- **Phase 2 (Global Navigation):** Requirement 2
- **Phase 3 (Product Card):** Requirement 3
- **Phase 4 (Homepage & Hero):** Requirement 4
- **Phase 5 (Product Detail Page):** Requirement 5
- **Phase 6 (Cart):** Requirement 6
- **Phase 7 (Cleanup):** Requirement 7

**Cross-cutting Requirements:**
- Requirement 8 (Code Quality): Applies to all phases
- Requirement 9 (Performance & SEO): Applies to all phases
- Requirement 10 (Risk Mitigation): Applies to all phases
- Requirement 11 (Configuration): Applies to Phase 1 and Phase 7
