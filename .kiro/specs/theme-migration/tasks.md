# Implementation Plan

- [ ] 1. Setup and preparation
  - Create migration tracking document listing all templates with inline styles/scripts
  - Setup Git branch structure for incremental migration (feature/theme-migration)
  - Verify build pipeline works correctly (SCSS compilation, PostCSS purging, JS bundling)
  - Create before/after screenshot directory for visual regression testing
  - _Requirements: 8.1, 8.4_

- [ ] 2. Enhance safelist extraction system
  - [ ] 2.1 Update safelist extraction script to handle edge cases
    - Modify `src/purge/extract-b-safelist.js` to handle nested schema structures
    - Add support for extracting classes from `default` values in schema settings
    - Add error handling for malformed JSON in schemas
    - _Requirements: 9.1, 9.2_

  - [ ] 2.2 Integrate safelist extraction into build process
    - Add npm script to run safelist extraction before CSS build
    - Update build documentation with safelist extraction step
    - _Requirements: 9.1_

  - [ ]\* 2.3 Create tests for safelist extraction
    - Write test fixtures with sample schema structures
    - Verify extraction handles all setting types correctly
    - _Requirements: 9.2_

- [ ] 3. Create migration utility helpers
  - [ ] 3.1 Create style mapping reference document
    - Document common inline style → Bulma class mappings
    - Create quick reference table for developers
    - Include responsive class patterns
    - _Requirements: 6.1, 8.5_

  - [ ] 3.2 Create Alpine.js pattern examples
    - Document common inline script → Alpine.js directive patterns
    - Create examples for event handlers, toggles, forms
    - Include Shopify integration patterns
    - _Requirements: 6.1, 8.5_

- [ ] 4. Audit and categorize existing templates
  - [ ] 4.1 Scan all Liquid templates for inline styles
    - Create script to find all `style=` attributes in templates
    - Generate report with file paths and line numbers
    - Categorize by complexity (simple, medium, complex)
    - _Requirements: 8.1_

  - [ ] 4.2 Scan all Liquid templates for inline scripts
    - Create script to find all `<script>` tags and `onclick`/`onsubmit` attributes
    - Generate report with file paths and line numbers
    - Categorize by complexity and identify reusable patterns
    - _Requirements: 8.1_

  - [ ] 4.3 Prioritize templates for migration
    - Sort templates by complexity (simple first)
    - Identify templates with reusable patterns
    - Create migration order list
    - _Requirements: 8.1_

- [ ] 5. Create reusable Alpine.js components
  - [ ] 5.1 Create modal component
    - Implement modal component with open/close functionality
    - Add support for backdrop click and ESC key
    - Include loading states and error handling
    - Register in `src/alpine-bundle.js`
    - _Requirements: 2.3, 3.1, 10.1, 10.2_

  - [ ] 5.2 Create tabs component
    - Implement tabs component with active state management
    - Add keyboard navigation support
    - Include URL hash synchronization option
    - Register in `src/alpine-bundle.js`
    - _Requirements: 2.3, 3.1, 10.1, 10.2_

  - [ ] 5.3 Create accordion component
    - Implement accordion with expand/collapse functionality
    - Add support for single or multiple open panels
    - Use `@alpinejs/collapse` for smooth animations
    - Register in `src/alpine-bundle.js`
    - _Requirements: 2.3, 3.1, 10.1, 10.2_

  - [ ] 5.4 Create dropdown component
    - Implement dropdown with click-outside detection
    - Add keyboard navigation (arrow keys, ESC)
    - Include positioning options (left, right, center)
    - Register in `src/alpine-bundle.js`
    - _Requirements: 2.3, 3.1, 10.1, 10.2_

  - [ ] 5.5 Create filter component
    - Implement filter component for collection pages
    - Add support for multiple filter types (checkbox, range, select)
    - Include URL parameter synchronization
    - Integrate with Shopify filtering API
    - Register in `src/alpine-bundle.js`
    - _Requirements: 2.3, 3.1, 5.1, 10.1, 10.2_

  - [ ] 5.6 Enhance priceRange component
    - Implement dual-handle range slider functionality
    - Add min/max value display
    - Integrate with filter component
    - Update registration in `src/alpine-bundle.js`
    - _Requirements: 2.3, 3.1, 10.1, 10.2_

  - [ ]\* 5.7 Create component documentation
    - Document each component's API and usage
    - Add JSDoc comments to component files
    - Create usage examples for each component
    - _Requirements: 6.1_

- [ ] 6. Create custom Bulma utilities
  - [ ] 6.1 Audit existing custom styles for common patterns
    - Review all custom CSS in templates
    - Identify patterns that should be Bulma utilities
    - Document patterns that need custom SCSS
    - _Requirements: 1.3, 6.5_

  - [ ] 6.2 Create product card utilities
    - Add product card specific spacing utilities to SCSS
    - Create hover effect utilities for product images
    - Add badge positioning utilities if not covered by overlays
    - Update `src/bulma/sass/custom/_index.scss` to include new utilities
    - _Requirements: 1.3, 6.5_

  - [ ] 6.3 Create layout utilities
    - Add grid gap utilities for specific layouts
    - Create container width utilities for sections
    - Add aspect ratio utilities if needed beyond Bulma defaults
    - Update `src/bulma/sass/custom/_index.scss` to include new utilities
    - _Requirements: 1.3, 6.5_

  - [ ]\* 6.4 Test custom utilities compilation
    - Verify SCSS compiles without errors
    - Check that utilities are included in final CSS bundle
    - Verify purging doesn't remove needed utilities
    - _Requirements: 1.3_

- [ ] 7. Migrate layout templates
  - [ ] 7.1 Migrate theme.liquid
    - Replace inline styles with Bulma classes
    - Replace inline scripts with Alpine.js directives
    - Test header, footer, and main layout rendering
    - Take before/after screenshots
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 7.2 Migrate password.liquid (if exists)
    - Replace inline styles with Bulma classes
    - Replace inline scripts with Alpine.js directives
    - Test password page functionality
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 8. Migrate header and navigation
  - [ ] 8.1 Migrate header section
    - Replace inline styles with Bulma classes
    - Migrate mobile menu toggle to Alpine.js
    - Migrate search functionality to Alpine.js
    - Test responsive behavior across breakpoints
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 8.2 Migrate navigation menu
    - Replace inline styles with Bulma classes
    - Migrate dropdown menus to Alpine.js dropdown component
    - Test keyboard navigation
    - Test mobile menu functionality
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 8.3 Migrate cart drawer/notification
    - Replace inline styles with Bulma classes
    - Migrate cart drawer toggle to Alpine.js
    - Ensure cart update events work correctly
    - Test add to cart from multiple sources
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 5.1, 5.2, 7.1, 8.2, 8.3_

- [ ] 9. Migrate product templates
  - [ ] 9.1 Migrate product-card snippet
    - Replace inline styles with Bulma classes
    - Integrate with existing productCard Alpine.js component
    - Migrate quick add functionality
    - Test add to cart and quick view
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2, 5.1, 5.2, 7.1, 8.2, 8.3_

  - [ ] 9.2 Migrate product template
    - Replace inline styles with Bulma classes
    - Migrate variant selector to Alpine.js
    - Migrate image gallery/carousel
    - Migrate add to cart form
    - Test variant selection and availability
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 5.1, 5.2, 7.1, 8.2, 8.3_

  - [ ] 9.3 Migrate product recommendations section
    - Replace inline styles with Bulma classes
    - Integrate with carousel component if needed
    - Test product recommendations loading
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 10. Migrate collection templates
  - [ ] 10.1 Migrate collection template
    - Replace inline styles with Bulma classes
    - Migrate filtering to Alpine.js filter component
    - Migrate sorting dropdown
    - Test filter and sort functionality
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 5.1, 7.1, 8.2, 8.3_

  - [ ] 10.2 Migrate collection grid/list view toggle
    - Replace inline styles with Bulma classes
    - Migrate view toggle to Alpine.js
    - Test grid and list view rendering
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 10.3 Migrate pagination
    - Replace inline styles with Bulma classes
    - Migrate infinite scroll if present to Alpine.js with Intersect plugin
    - Test pagination navigation
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 11. Migrate cart template
  - [ ] 11.1 Migrate cart template
    - Replace inline styles with Bulma classes
    - Migrate quantity selectors to Alpine.js
    - Migrate remove item functionality
    - Migrate cart note functionality
    - Test cart updates and calculations
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 5.1, 5.2, 7.1, 8.2, 8.3_

  - [ ] 11.2 Migrate cart upsell/recommendations
    - Replace inline styles with Bulma classes
    - Integrate with carousel component if needed
    - Test recommendations loading
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 12. Migrate homepage sections
  - [ ] 12.1 Migrate hero/slideshow section
    - Replace inline styles with Bulma classes
    - Integrate with carousel component
    - Test autoplay and navigation
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 12.2 Migrate featured collection section
    - Replace inline styles with Bulma classes
    - Integrate with carousel component if needed
    - Test product card rendering
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 12.3 Migrate image with text section
    - Replace inline styles with Bulma classes
    - Migrate any interactive elements to Alpine.js
    - Test responsive layout
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 12.4 Migrate other homepage sections
    - Identify remaining homepage sections
    - Replace inline styles with Bulma classes
    - Migrate interactive elements to Alpine.js
    - Test each section individually
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 13. Migrate content pages
  - [ ] 13.1 Migrate page template
    - Replace inline styles with Bulma classes
    - Migrate any interactive elements to Alpine.js
    - Test content rendering
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 13.2 Migrate blog template
    - Replace inline styles with Bulma classes
    - Migrate any interactive elements to Alpine.js
    - Test article listing and pagination
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 13.3 Migrate article template
    - Replace inline styles with Bulma classes
    - Migrate any interactive elements to Alpine.js
    - Test article content and comments
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 14. Migrate account templates
  - [ ] 14.1 Migrate login template
    - Replace inline styles with Bulma classes
    - Migrate form validation to Alpine.js
    - Test login functionality
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 14.2 Migrate register template
    - Replace inline styles with Bulma classes
    - Migrate form validation to Alpine.js
    - Test registration functionality
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 14.3 Migrate account template
    - Replace inline styles with Bulma classes
    - Migrate tabs/sections to Alpine.js tabs component
    - Test order history and account details
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 14.4 Migrate addresses template
    - Replace inline styles with Bulma classes
    - Migrate add/edit/delete address forms to Alpine.js
    - Test address management functionality
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 15. Migrate search template
  - [ ] 15.1 Migrate search template
    - Replace inline styles with Bulma classes
    - Migrate search filters to Alpine.js
    - Migrate search results rendering
    - Test search functionality and filtering
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 15.2 Migrate predictive search
    - Replace inline styles with Bulma classes
    - Migrate predictive search to Alpine.js with AJAX plugin
    - Test search suggestions and navigation
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 5.1, 7.1, 8.2, 8.3_

- [ ] 16. Migrate remaining snippets
  - [ ] 16.1 Audit remaining snippets
    - List all snippets not yet migrated
    - Categorize by complexity
    - Prioritize by usage frequency
    - _Requirements: 8.1_

  - [ ] 16.2 Migrate utility snippets
    - Replace inline styles with Bulma classes in utility snippets
    - Migrate any interactive elements to Alpine.js
    - Test snippet rendering in various contexts
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

  - [ ] 16.3 Migrate form snippets
    - Replace inline styles with Bulma classes in form snippets
    - Migrate form validation to Alpine.js
    - Test form submission and validation
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.1, 8.2, 8.3_

- [ ] 17. Optimize and finalize
  - [ ] 17.1 Run safelist extraction
    - Execute `node src/purge/extract-b-safelist.js`
    - Review generated safelist for completeness
    - Add any missing classes to manual safelist
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 17.2 Build optimized bundles
    - Run production build for CSS with purging enabled
    - Run production build for JavaScript with minification
    - Verify bundle sizes meet targets (CSS < 100KB, JS < 50KB gzipped)
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 17.3 Performance testing
    - Run Lighthouse audits on key pages
    - Measure page load times on 3G connection
    - Verify TTI < 3s and FCP < 1.5s
    - Optimize if targets not met
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 17.4 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge (latest versions)
    - Test on Mobile Safari (iOS) and Chrome Mobile (Android)
    - Verify all interactive features work correctly
    - Fix any browser-specific issues
    - _Requirements: 7.1, 8.3_

  - [ ]\* 17.5 Accessibility audit
    - Run axe DevTools on all migrated templates
    - Test keyboard navigation on all interactive elements
    - Verify screen reader compatibility
    - Fix any accessibility issues found
    - _Requirements: 7.1_

- [ ] 18. Documentation and handoff
  - [ ] 18.1 Create component library documentation
    - Document all Alpine.js components with usage examples
    - Create visual examples of Bulma utilities
    - Document custom SCSS additions
    - _Requirements: 6.1, 6.3_

  - [ ] 18.2 Create maintenance guide
    - Document how to add new Alpine.js components
    - Document how to add custom Bulma styles
    - Document safelist extraction process
    - Document build and deployment process
    - _Requirements: 6.1, 6.3_

  - [ ] 18.3 Create migration patterns reference
    - Document common migration patterns used
    - Create before/after examples
    - Document troubleshooting tips
    - _Requirements: 6.1, 8.5_

  - [ ] 18.4 Team training
    - Conduct training session on new architecture
    - Review component library and usage
    - Review maintenance procedures
    - Answer team questions
    - _Requirements: 6.1_
