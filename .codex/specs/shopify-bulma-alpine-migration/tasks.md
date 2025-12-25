# Implementation Plan

## Phase 1: Foundation Setup

- [x] 1. Configure CSS variable migration from Dawn to Bulma
  - Create `src/bulma/sass/utilities/_shopify-variables.scss` to bridge Shopify theme settings with Bulma
  - Map critical theme customizer variables (fonts, colors) to CSS custom properties that Bulma consumes
  - Add runtime CSS variable support for dynamic theme settings (button radius, spacing, etc.)
  - _Requirements: 1.3, 1.5, 11.1, 11.2, 11.5_

- [ ] 2. Update `layout/theme.liquid` to remove Dawn CSS dependencies
  - Remove inline CSS variable definitions (lines 31-212) that control Dawn-specific design
  - Remove `{{ 'base.css' | asset_url | stylesheet_tag }}` reference (line 288)
  - Add critical inline CSS for `[x-cloak] { display: none !important; }` to prevent FOUC
  - Preserve conditional Bulma CSS loading logic (full vs purged) for theme editor support
  - Verify font preloading, Alpine bundle loading, and cart scripts remain intact
  - _Requirements: 1.1, 1.4, 1.6, 9.4, 11.3_

- [ ] 3. Create b-scope wrapper utility for migration coexistence
  - Create `src/bulma/sass/custom/_b-scope.scss` with scoping rules for migrated components
  - Add `.b-scope` class that isolates Bulma styles from legacy Dawn styles during phases 1-6
  - Include CSS specificity overrides to ensure Bulma styles win within scope
  - Document usage pattern in comments for future component migration
  - _Requirements: 1.5, 8.8_

- [ ] 4. Enhance PurgeCSS safelist extraction for dynamic Liquid classes
  - Update `src/purge/extract-b-safelist.js` to detect and safelist Liquid variable patterns
  - Add regex patterns to safelist common dynamic classes (e.g., `/^b-is-\d/`, `/^b-column-\d/`)
  - Test safelist generation against all existing Liquid files
  - Verify no critical classes are purged in production build
  - _Requirements: 9.11, 10.10_

- [ ] 5. Write unit tests for foundation changes
  - Create test suite to verify CSS variable availability in compiled CSS
  - Test that `[x-cloak]` rule exists in critical CSS
  - Verify PurgeCSS safelist includes all expected patterns
  - Test conditional CSS loading logic (full vs purged)
  - _Requirements: 10.1-10.10_

---

## Phase 2: Global Navigation Migration

- [ ] 6. Create new header section with Bulma navbar
  - Create `sections/aa-header.liquid` using Bulma navbar components (`b-navbar`, `b-navbar-brand`, `b-navbar-menu`)
  - Implement Alpine.js state management with `x-data="{ mobileMenuOpen: false }"`
  - Add mobile menu toggle using `@click` directive and `:class` binding for `b-is-active`
  - Implement desktop navigation menu rendering from `section.settings.menu.links`
  - Add cart icon with reactive count display using `x-text="$store.cart.item_count"`
  - Include customer account link if `shop.customer_accounts_enabled`
  - Preserve logo rendering with proper image optimization (eager loading, high priority)
  - _Requirements: 2.1, 2.2, 2.3, 2.6, 8.1, 8.2_

- [ ] 7. Migrate header to use Alpine.js exclusively
  - Remove all references to `component-list-menu.css` from header
  - Replace legacy JavaScript menu logic with Alpine.js directives
  - Ensure smooth mobile menu animations using Alpine.js transitions or CSS
  - Add `x-cloak` to prevent flash of unstyled mobile menu
  - Test keyboard navigation and accessibility (ARIA labels on burger menu)
  - _Requirements: 2.4, 2.5, 8.3, 9.4, 9.9_

- [ ] 8. Create new footer section with Bulma grid
  - Create `sections/aa-footer.liquid` using Bulma columns layout
  - Structure footer with `b-columns` and responsive column classes (`b-is-12-mobile`, `b-is-4-tablet`)
  - Add newsletter signup form if applicable
  - Include social media links, legal pages, and contact information
  - Ensure mobile-first responsive design
  - _Requirements: 2.1, 8.5, 9.5_

- [ ] 9. Update template JSON files to use new header/footer
  - Update `templates/*.json` section group references to point to `aa-header` and `aa-footer`
  - Test in Shopify theme editor to ensure sections load correctly
  - Verify backward compatibility with merchant customizations
  - Document migration path for any custom header/footer blocks
  - _Requirements: 11.4_

- [ ] 10. Write integration tests for navigation
  - Test mobile menu open/close functionality with Alpine.js
  - Verify cart count updates reactively when cart store changes
  - Test desktop navigation rendering with different menu configurations
  - Validate accessibility with keyboard navigation and screen readers
  - Test on mobile viewports (375px) and desktop (1024px+)
  - _Requirements: 10.1, 10.3, 10.4, 10.8_

---

## Phase 3: Product Card Component Migration

- [ ] 11. Create vertical product card variant
  - Create `snippets/c-product-card.liquid` with vertical layout (image top, content bottom)
  - Use `b-card`, `b-card-image`, `b-card-content` Bulma components
  - Implement 1:1 aspect ratio container using `b-image b-is-1by1`
  - Use `image_tag` filter with `loading: 'lazy'`, `widths` parameter for responsive srcsets
  - Add product title, vendor, and price rendering with Bulma typography classes
  - Include sold out / on sale badge positioning using `b-tag` component
  - Ensure all classes use `b-` prefix
  - _Requirements: 3.1, 3.2, 3.3, 3.6, 8.1, 9.2_

- [ ] 12. Create horizontal-mobile product card variant
  - Create `snippets/c-product-card--horizontal.liquid` with horizontal layout
  - Use Bulma columns with `b-columns b-is-mobile b-is-gapless`
  - Place image in left column (`b-column b-is-4`) with 1:1 aspect ratio
  - Place content in right column (`b-column b-is-8`)
  - Optimize for mobile readability and touch targets
  - _Requirements: 3.7, 8.5_

- [ ] 13. Add optional Alpine.js quick-add functionality to product card
  - Integrate `x-data="productCard({ productId: {{ product.id }} })"` if quick-add is enabled
  - Reference existing `src/bulma/scripts/custom/product-card.js` Alpine component
  - Add quick-add button with `@click="quickAdd()"` event handler
  - Implement error message display with `x-show="errorMessage"` and `x-cloak`
  - Style error notification using `b-notification b-is-danger`
  - _Requirements: 3.5, 8.2, 9.4_

- [ ] 14. Update featured collection section to use new product card
  - Modify `sections/featured-collection.liquid` to render `c-product-card.liquid`
  - Remove references to old `card-product.liquid` snippet
  - Use Bulma columns for product grid layout (`b-columns`, `b-column b-is-12-mobile b-is-6-tablet b-is-4-desktop`)
  - Ensure mobile and desktop responsiveness
  - Test product card rendering with various product states (sold out, on sale, available)
  - _Requirements: 3.4, 8.5_

- [ ] 15. Write unit tests for product card components
  - Test vertical and horizontal card rendering with mock product data
  - Verify lazy loading attributes on images
  - Test badge display logic (sold out, on sale)
  - Validate Alpine.js quick-add functionality with mock cart store
  - Test responsive behavior at mobile (375px) and tablet (768px) breakpoints
  - _Requirements: 10.1, 10.6, 10.7_

---

## Phase 4: Homepage Hero Section Migration

- [ ] 16. Create hero banner section with LCP optimization
  - Create `sections/aa-hero.liquid` using Bulma hero component (`b-hero`, `b-hero-body`)
  - Implement responsive images: 1:1 for mobile, 2:1 for desktop using custom CSS classes
  - Use `image_tag` with `loading: 'eager'`, `fetchpriority: 'high'` for LCP optimization
  - Add `widths` parameter for responsive srcsets, `sizes` attribute for viewport-based selection
  - Include text overlay container with Bulma overlay classes
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 9.1, 9.3_

- [ ] 17. Implement hero text overlay with Bulma typography
  - Create overlay div with positioning and semi-transparent background
  - Add hero title using `b-title b-is-1` with white text
  - Add hero subtitle using `b-subtitle b-is-4` with white text
  - Include CTA button using `b-button b-is-primary b-is-large`
  - Ensure text is readable on all image backgrounds (contrast overlay)
  - _Requirements: 4.4, 8.1_

- [ ] 18. Create custom SCSS for hero component
  - Create `src/bulma/sass/custom/_hero.scss`
  - Implement responsive aspect ratio logic (1:1 mobile, 2:1 desktop)
  - Add background image positioning and object-fit rules
  - Style overlay with flexbox centering and gradient background
  - Import in main Bulma SASS entry point
  - _Requirements: 4.2, 4.3, 8.7_

- [ ] 19. Update homepage template to use new hero
  - Modify `templates/index.json` to reference `aa-hero` section
  - Remove reference to old `image-banner.liquid` section
  - Configure section settings in theme editor
  - Test hero rendering with different image aspect ratios
  - _Requirements: 4.1, 11.4_

- [ ] 20. Write tests for hero performance and rendering
  - Verify LCP image has `loading="eager"` and `fetchpriority="high"`
  - Test responsive image selection at different viewport widths
  - Validate text overlay readability and positioning
  - Measure LCP time with Lighthouse (target < 2.5s)
  - Test mobile (375px) and desktop (1024px+) rendering
  - _Requirements: 10.1, 10.2, 10.7_

---

## Phase 5: Product Detail Page Migration

- [ ] 21. Create product gallery with native scroll snap
  - Create `sections/aa-main-product.liquid` for PDP layout
  - Implement product gallery using flexbox with `scroll-snap-type: x mandatory`
  - Create `src/bulma/sass/custom/_product-gallery.scss` for scroll snap styles
  - Render each product media in slide container with `scroll-snap-align: start`
  - Use lazy loading for gallery images except first image
  - Hide scrollbar with CSS (`-webkit-scrollbar { display: none }`)
  - _Requirements: 5.4, 8.7, 9.2_

- [ ] 22. Implement variant selector with Alpine.js
  - Create Alpine.js component with `x-data` containing variants array and selected variant state
  - Render option selectors using Bulma buttons (`b-buttons b-has-addons`)
  - Bind variant selection with `@click` directive and state update method
  - Implement reactive price display using `x-text` bound to selected variant price
  - Implement reactive image gallery update when variant changes
  - Show/hide availability status based on selected variant
  - _Requirements: 5.5, 5.6, 8.1, 8.2_

- [ ] 23. Integrate add-to-cart with Alpine cart store
  - Add "Add to Cart" button with `@click="$store.cart.addItem(selectedVariant.id, 1)"`
  - Bind button disabled state to variant availability using `:disabled="!selectedVariant.available"`
  - Display conditional text: "Add to Cart" when available, "Sold Out" when unavailable
  - Trigger cart drawer open event after successful add (`@cart-updated.window="openCartDrawer()"`)
  - Handle and display add-to-cart errors using Alpine reactive error state
  - _Requirements: 5.2, 5.3, 5.7, 8.2_

- [ ] 24. Add product metadata and structured data
  - Include product description with Bulma content class (`b-content`)
  - Render product vendor, SKU, and other metadata with Bulma typography
  - Add explicit `width` and `height` attributes to all product images
  - Ensure semantic HTML with proper heading hierarchy (h1 for product title)
  - Include JSON-LD structured data for product schema
  - _Requirements: 9.5, 9.7, 9.8_

- [ ] 25. Write tests for PDP functionality
  - Test variant selection updates price and image reactively
  - Verify add-to-cart adds correct variant to cart store
  - Test sold-out variant shows disabled button with correct text
  - Validate scroll snap gallery behavior on touch devices
  - Test error handling for failed add-to-cart operations
  - Verify no page reloads during variant selection or add-to-cart
  - _Requirements: 5.9, 10.1, 10.4_

---

## Phase 6: Cart Experience Migration

- [ ] 26. Verify and enhance Alpine cart store implementation
  - Review existing `assets/cart-store.js` for Shopify Cart API contract compliance
  - Ensure all cart mutations (add, update, remove) call Shopify endpoints first
  - Implement state refresh from `/cart.js` after each mutation
  - Add custom event dispatching for cart updates (`cart-updated`, `cart-error`)
  - Add error handling for failed API calls with user-friendly error messages
  - Initialize cart state on page load by fetching from `/cart.js`
  - _Requirements: 5.2, 6.2, 6.3, 8.2_

- [ ] 27. Create cart drawer component with Alpine.js
  - Create `snippets/cart-drawer.liquid` with Alpine state `x-data="{ open: false }"`
  - Listen for cart drawer open event with `@cart-drawer-open.window="open = true"`
  - Implement overlay with click-to-close functionality
  - Create sliding panel with Bulma box styling
  - Add header with cart count display using `x-text="$store.cart.item_count"`
  - Include close button using Bulma delete element
  - Use `x-cloak` to prevent flash before Alpine loads
  - _Requirements: 6.1, 6.4, 8.2, 9.4_

- [ ] 28. Implement cart item rendering and quantity controls
  - Use Alpine `x-for` to loop through `$store.cart.items`
  - Render each item with product image (1:1 aspect ratio), title, variant, and price
  - Create quantity controls with increment/decrement buttons
  - Bind quantity update to `@click="$store.cart.updateItem(item.key, newQuantity)"`
  - Add remove button with `@click="$store.cart.removeItem(item.key)"`
  - Display line item prices and update total reactively
  - _Requirements: 6.4, 6.7, 8.2_

- [ ] 29. Add free shipping progress bar to cart drawer
  - Calculate remaining amount to free shipping threshold (e.g., $50)
  - Use Bulma progress component (`b-progress b-is-primary`)
  - Bind progress value to cart total using `:value="$store.cart.total_price"`
  - Show/hide progress bar based on whether threshold is met using `x-show`
  - Display remaining amount text reactively with `x-text`
  - _Requirements: 6.5, 8.1_

- [ ] 30. Create cart drawer styles
  - Create `src/bulma/sass/custom/_cart-drawer.scss`
  - Style fixed positioning overlay with semi-transparent background
  - Style sliding panel with smooth transitions
  - Implement scrollable items container with flexbox
  - Style footer with sticky positioning and checkout button
  - Ensure mobile-responsive design
  - _Requirements: 6.8, 8.7_

- [ ] 31. Update main cart page to use Alpine store
  - Modify `sections/main-cart.liquid` to use `$store.cart` for cart data
  - Implement same quantity controls and remove functionality as drawer
  - Add checkout button linking to `/checkouts`
  - Ensure cart page syncs with cart drawer (same data source)
  - Style with Bulma table or box components
  - _Requirements: 6.1, 6.2_

- [ ] 32. Write integration tests for cart functionality
  - Test add-to-cart from PDP updates cart store and drawer
  - Verify quantity increment/decrement updates cart via API
  - Test remove item removes from cart and updates UI
  - Validate cart drawer opens on cart-updated event
  - Test free shipping progress bar calculations
  - Verify cart page and drawer stay in sync
  - Test error display for failed cart operations
  - _Requirements: 10.1, 10.4_

---

## Phase 7: Legacy Code Removal

- [ ] 33. Remove legacy CSS files and references
  - Delete `assets/base.css`
  - Delete all `assets/component-*.css` files (list exact files via grep search)
  - Remove any remaining references to deleted CSS files in Liquid templates
  - Verify no broken styles by testing all major pages
  - _Requirements: 7.1, 7.5, 10.3_

- [ ] 34. Remove legacy JavaScript files
  - Delete `assets/global.js`
  - Delete `assets/cart.js` (legacy version, keep `cart-api.js` and `cart-store.js`)
  - Delete `assets/product-form.js`
  - Delete `assets/details-disclosure.js`
  - Remove any script tag references to deleted JS files in templates
  - Verify no JavaScript errors in browser console
  - _Requirements: 7.2, 7.6, 10.4_

- [ ] 35. Remove legacy Liquid sections and snippets
  - Delete `sections/header.liquid` (replaced by `aa-header.liquid`)
  - Delete `sections/footer.liquid` (replaced by `aa-footer.liquid`)
  - Delete `sections/image-banner.liquid` (replaced by `aa-hero.liquid`)
  - Delete `sections/main-product.liquid` (replaced by `aa-main-product.liquid`)
  - Delete old `snippets/card-product.liquid` if fully replaced by `c-product-card.liquid`
  - Delete `snippets/price.liquid` if it uses Dawn-specific classes (or refactor to use `b-` classes)
  - _Requirements: 7.3, 7.4_

- [ ] 36. Remove b-scope wrappers from migrated components
  - Search all migrated sections/snippets for `.b-scope` wrapper divs
  - Remove wrapper divs now that legacy CSS is gone
  - Test that component styles still render correctly without isolation
  - _Requirements: 1.5_

- [ ] 37. Run final PurgeCSS build and validation
  - Execute full build: `npm run build`
  - Verify `a-bulma-purged.css` file size is optimized (~80-100KB uncompressed)
  - Test production build on development theme
  - Check for any purged classes breaking dynamic Liquid rendering
  - Update safelist if necessary and rebuild
  - _Requirements: 7.7, 10.3_

- [ ] 38. Clean settings_schema.json of deprecated settings
  - Review `config/settings_schema.json` for Dawn-specific visual settings
  - Remove settings for card shadows, borders, padding (now controlled by Bulma)
  - Remove Dawn button styling settings (replaced by Bulma button variables)
  - Preserve essential settings: typography, colors, logo, layout widths
  - Document removed settings for merchant communication
  - _Requirements: 11.5_

- [ ] 39. Perform comprehensive post-cleanup testing
  - Test all major pages: homepage, collection, PDP, cart, checkout flow
  - Validate mobile view (375px) on all pages
  - Validate desktop view (1024px+) on all pages
  - Run Lighthouse audits on all major pages (Performance, Accessibility, SEO)
  - Check browser console for errors on all pages
  - Test theme customizer: add/remove sections, change colors, upload logo
  - Verify no visual regressions compared to pre-cleanup state
  - _Requirements: 7.8, 10.1-10.10_

---

## Quality Assurance and Documentation

- [ ] 40. Performance benchmarking and optimization validation
  - Measure CSS payload: before (~900KB) vs after (~90KB compressed)
  - Measure JS payload: before (~150KB) vs after (~55KB compressed)
  - Run Lighthouse Performance audit (target score >= 90)
  - Measure LCP on homepage hero (target < 2.5s)
  - Test with throttled 3G connection for mobile performance
  - Document performance improvements in walkthrough
  - _Requirements: 9.1, 9.3, 9.10_

- [ ] 41. Accessibility and SEO validation
  - Run Lighthouse Accessibility audit on all major pages (target >= 90)
  - Verify single H1 per page with proper heading hierarchy
  - Test keyboard navigation on header, footer, product filters, cart
  - Validate ARIA labels on interactive elements
  - Check screen reader compatibility (VoiceOver/NVDA)
  - Verify meta titles and descriptions on all template types
  - Validate image alt text throughout site
  - _Requirements: 9.5, 9.6, 9.7, 9.8, 10.8_

- [ ] 42. Browser and device compatibility testing
  - Test on Chrome (latest) desktop and mobile
  - Test on Safari (latest) desktop and iOS
  - Test on Firefox (latest)
  - Test on Edge (latest)
  - Verify responsive behavior at breakpoints: 375px, 768px, 1024px, 1440px
  - Test touch interactions on mobile (menu toggle, product gallery swipe, cart drawer)
  - Document any browser-specific issues and resolutions
  - _Requirements: 10.1_

- [ ] 43. Create migration documentation and walkthrough
  - Document all code changes made during migration
  - Create before/after comparison screenshots
  - Document performance improvements with metrics
  - List all deleted files and new files created
  - Create rollback procedure documentation
  - Write merchant-facing guide for new theme customizer options
  - _Requirements: All_
