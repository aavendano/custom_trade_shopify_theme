# Implementation Plan

- [x] 1. Create megamenu Alpine store
  - Create `assets/megamenu-store.js` with global state management
  - Implement `open()`, `close()`, `scheduleClose()`, `cancelClose()` methods
  - Follow existing `cart-store.js` pattern
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Register megamenu store in theme layout
  - Add `<script src="{{ 'megamenu-store.js' | asset_url }}" defer></script>` to `layout/theme.liquid`
  - Place before `alpine-bundle.js` load
  - _Requirements: 1.1, 7.1_

- [x] 3. Create megamenu overlay section
  - Create `sections/aa-megamenu.liquid` as independent section
  - Implement overlay with `position: fixed` and `z-index: 100`
  - Consume `$store.megaMenu` for open/close logic
  - Add transitions with Alpine `x-transition` directives
  - Include Bulma grid layout (`b-columns`, `b-column`)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1_

- [x] 4. Add megamenu schema settings
  - Add `menu` linklist setting to `aa-megamenu.liquid` schema
  - Configure presets for theme editor
  - _Requirements: 3.2_

- [x] 5. Update header-group.json
  - Add `aa-megamenu` section after `aa-header` in order array
  - Configure initial settings for menu sync
  - _Requirements: 3.2, 3.5_

- [x] 6. Modify header to act as trigger only
  - Remove dropdown DOM elements from `sections/aa-header.liquid`
  - Add `@mouseenter`, `@mouseleave`, `@click` handlers on trigger links
  - Use `$store.megaMenu.open()` and `$store.megaMenu.scheduleClose()`
  - Add `:class` binding for active trigger state
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 7. Add megamenu overlay CSS
  - Update `src/bulma/sass/extensions/megamenu.scss` with overlay styles
  - Add `.aa-megamenu-overlay` positioning rules
  - Add desktop (hover) and mobile (drawer/accordion) specific styles
  - Include transition utilities
  - _Requirements: 4.1, 4.2, 5.5, 6.2_

- [x] 8. Implement desktop hover behavior
  - Configure 200ms open transition
  - Implement 300ms debounced close on mouse leave
  - Add escape key handler
  - Add click-outside handler
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 9. Implement mobile drawer/accordion behavior
  - Add mobile-specific styles for viewport < 1024px
  - Convert megamenu to drawer or accordion layout on mobile
  - Handle tap interactions
  - Add mobile close button
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10. Add responsive breakpoint detection
  - Use CSS media queries for layout switching
  - Optionally add Alpine logic for `window.innerWidth` detection
  - Ensure smooth transition when crossing 1024px breakpoint
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 11. Verify header native functionality
  - Test logo link navigates to home
  - Test search icon links to search page
  - Test account icon links correctly
  - Test cart icon and `$store.cart` reactive count
  - Test mobile burger menu toggle
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 12. Write unit tests for megamenu store
  - Create `src/tests/megamenu-store.test.js`
  - Test store initialization with defaults
  - Test `open()`, `close()`, `scheduleClose()`, `cancelClose()` methods
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 13. Build and validate CSS
  - Run `npm run build:css` to compile SCSS
  - Verify no compilation errors
  - Check megamenu styles in output CSS
  - _Requirements: 4.2_

- [x] 14. Manual browser testing
  - Test desktop hover open/close
  - Test debounced close behavior
  - Test escape key and click-outside close
  - Test mobile tap interactions
  - Verify no console errors
  - Verify no flicker on open/close
  - _Requirements: 5.1-5.5, 6.1-6.5, 8.1-8.3, 10.1-10.4, 11.1-11.3_
