# Design Document

## Overview

This design document outlines the architecture and implementation strategy for migrating the PlayLoveToys Shopify theme from inline styles and scattered JavaScript to a unified system using Bulma CSS (prefixed with `b-`) and Alpine.js components. The migration will be performed incrementally, template by template, to minimize risk and ensure continuous functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Shopify Liquid Templates                  │
│  (layout/*.liquid, sections/*.liquid, snippets/*.liquid)    │
│                                                              │
│  ┌────────────────┐              ┌─────────────────┐       │
│  │ Bulma Classes  │              │ Alpine.js       │       │
│  │ (b-* prefix)   │              │ Directives      │       │
│  │                │              │ (x-data, x-on)  │       │
│  └────────┬───────┘              └────────┬────────┘       │
└───────────┼──────────────────────────────┼─────────────────┘
            │                              │
            ▼                              ▼
┌───────────────────────┐      ┌──────────────────────────┐
│  @assets/             │      │  @assets/                │
│  a-bulma-full.css     │      │  alpine-bundle.js        │
│                       │      │                          │
│  Compiled from:       │      │  Compiled from:          │
│  src/bulma/bulma.scss │      │  src/alpine-bundle.js    │
└───────────────────────┘      └──────────────────────────┘
            │                              │
            ▼                              ▼
┌───────────────────────┐      ┌──────────────────────────┐
│  SCSS Source          │      │  Alpine Components       │
│  src/bulma/sass/      │      │  src/bulma/scripts/      │
│  - utilities/         │      │  - carousel.js           │
│  - custom/            │      │  - product-card.js       │
│  - components/        │      │  - [new components]      │
│  - elements/          │      │                          │
└───────────────────────┘      └──────────────────────────┘
```

### Build Pipeline

```
┌──────────────────┐
│  SCSS Source     │
│  (src/bulma/)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Sass Compiler   │
│  (with custom    │
│   variables)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PostCSS         │
│  - PurgeCSS      │
│  - Safelist      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  a-bulma-full.css│
│  (optimized)     │
└──────────────────┘

┌──────────────────┐
│  Alpine Source   │
│  (src/)          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Bundler         │
│  (Rollup/Vite)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  alpine-bundle.js│
│  (minified)      │
└──────────────────┘
```

## Components and Interfaces

### 1. Bulma CSS System

#### 1.1 Core Configuration

**File**: `src/bulma/bulma.scss`

**Purpose**: Main entry point that configures brand colors, typography, and imports all Bulma modules.

**Key Configurations**:

- Brand colors: `$plt-purple`, `$plt-pink`, `$plt-teal`
- Typography: Roboto Condensed (primary), Inter (secondary)
- Custom dimensions: 75, 100, 150, 320, 400, 460, 520px
- Class prefix: `b-`

#### 1.2 Custom Overlays System

**File**: `src/bulma/sass/custom/overlays.scss`

**Purpose**: Provides badge and overlay utilities for product images and cards.

**Components**:

- **Positioning helpers**: `.b-tag-top-left`, `.b-tag-top-right`, `.b-tag-bottom-left`, `.b-tag-bottom-right`, `.b-tag-center`
- **Responsive positioning**: `.b-tag-responsive`, `.b-tag-responsive-2`
- **Badge variants**: `.b-badge-{color}`, `.b-badge-pill-{color}`, `.b-badge-circle-{color}`
- **Gradients**: `.b-overlay-gradient-bottom`, `.b-overlay-gradient-full`

**Usage Pattern**:

```liquid
<div class="b-has-image-overlay">
  <img src="..." class="b-image">
  <span class="b-badge-pill-primary b-tag-top-right">New</span>
  <div class="b-overlay-gradient-bottom"></div>
</div>
```

#### 1.3 CSS Purging System

**File**: `src/postcss.config.cjs`

**Purpose**: Removes unused CSS classes while preserving classes used in Liquid templates and schemas.

**Process**:

1. Scans: `layout/*.liquid`, `templates/**/*.liquid`, `sections/*.liquid`, `snippets/*.liquid`, `blocks/*.liquid`
2. Loads safelist from: `src/purge/b-safelist.json`
3. Preserves classes in safelist + classes found in templates
4. Outputs optimized CSS

**Safelist Extraction**:

**File**: `src/purge/extract-b-safelist.js`

**Purpose**: Automatically extracts Bulma classes from Liquid schema settings.

**Process**:

1. Scans: `blocks/**/*.liquid`, `sections/**/*.liquid`, `snippets/**/*.liquid`
2. Parses `{% schema %}` blocks
3. Extracts classes with `b-` prefix from: `select`, `radio`, `button_group`, `segmented`, `checkbox` options
4. Outputs to: `src/purge/b-safelist.json`

**Run**: `node src/purge/extract-b-safelist.js` (should be part of build process)

### 2. Alpine.js System

#### 2.1 Core Bundle

**File**: `src/alpine-bundle.js`

**Purpose**: Main entry point that registers Alpine.js plugins and components.

**Structure**:

```javascript
import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import intersect from "@alpinejs/intersect";
import ajax from "@imacrayon/alpine-ajax";
import customComponent from "./bulma/scripts/custom/component.js";

// Register plugins
Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(ajax);
Alpine.plugin(customComponent);

// Register inline components (for simple cases)
Alpine.data("componentName", () => ({
  // component logic
}));

window.Alpine = Alpine;
Alpine.start();
```

#### 2.2 Component Plugin Pattern

**Location**: `src/bulma/scripts/custom/`

**Pattern**:

```javascript
export default function (Alpine) {
  Alpine.data("componentName", (config = {}) => ({
    // Reactive properties
    property: config.property || "default",

    // Computed properties
    get computedValue() {
      return this.property.toUpperCase();
    },

    // Lifecycle
    init() {
      // Initialization logic
    },

    // Methods
    methodName() {
      // Method logic
    },
  }));
}
```

**Usage in Liquid**:

```liquid
<div x-data="componentName({ property: 'value' })">
  <span x-text="computedValue"></span>
  <button @click="methodName">Action</button>
</div>
```

#### 2.3 Existing Components

##### Carousel Component

**File**: `src/bulma/scripts/custom/carousel.js`

**Features**:

- Slide navigation (previous/next)
- Autoplay with configurable interval
- Pause on visibility (IntersectionObserver)
- Touch/swipe support
- Smooth scrolling

**Configuration**:

```javascript
{
  slides: '.slide-selector', // CSS selector or array of elements
  intervalTime: 5000 // milliseconds, 0 to disable autoplay
}
```

**API**:

- `previous()` - Navigate to previous slide
- `next()` - Navigate to next slide
- `pause()` - Pause autoplay
- `resume()` - Resume autoplay
- `setAutoplayIntervalTime(ms)` - Update interval

**Properties**:

- `currentSlideIndex` - Current slide index (0-based)
- `currentSlide` - Current slide element
- `isPaused` - Autoplay pause state

##### Product Card Component

**File**: `src/bulma/scripts/custom/product-card.js`

**Features**:

- Quick add modal
- Add to cart with loading states
- Error handling
- Shopify cart integration
- Section rendering for dynamic updates

**Configuration**:

```javascript
{
  productUrl: '/products/handle',
  sectionId: 'section-id',
  productId: 'product-id'
}
```

**API**:

- `addToCart(formElement)` - Add product to cart
- `openQuickAdd()` - Open quick add modal
- `closeModal()` - Close modal

**Properties**:

- `loading` - Loading state
- `modalOpen` - Modal visibility
- `errorMessage` - Error message
- `quickAddInfo` - Cached product HTML

### 3. Migration Patterns

#### 3.1 Inline Style Migration

**Pattern**: Replace inline styles with Bulma utility classes

**Before**:

```liquid
<div style="display: flex; justify-content: space-between; padding: 1rem; background: #f5f5f5;">
  <span style="font-weight: bold; color: #333;">Title</span>
</div>
```

**After**:

```liquid
<div class="b-is-flex b-is-justify-content-space-between b-p-4 b-has-background-light">
  <span class="b-has-text-weight-bold b-has-text-dark">Title</span>
</div>
```

**Mapping Reference**:

- `display: flex` → `b-is-flex`
- `justify-content: space-between` → `b-is-justify-content-space-between`
- `padding: 1rem` → `b-p-4` (or specific: `b-px-4`, `b-py-4`)
- `background: #f5f5f5` → `b-has-background-light`
- `font-weight: bold` → `b-has-text-weight-bold`
- `color: #333` → `b-has-text-dark`

#### 3.2 Custom Style Migration

**Pattern**: Add custom styles to SCSS source when Bulma doesn't provide them

**Before** (inline or in custom CSS):

```css
.custom-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 0.4rem;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

**After** (add to `src/bulma/sass/custom/`):

```scss
// src/bulma/sass/custom/badges.scss
@use "../utilities/initial-variables" as iv;

.#{iv.$class-prefix}badge-gradient-purple {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 0.4rem;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

Then import in `src/bulma/sass/custom/_index.scss`:

```scss
@forward "badges";
```

#### 3.3 Inline Script Migration

**Pattern**: Replace inline JavaScript with Alpine.js directives

**Before**:

```liquid
<button onclick="this.classList.toggle('active'); document.getElementById('menu').classList.toggle('is-hidden');">
  Toggle Menu
</button>
<div id="menu" class="is-hidden">Menu content</div>
```

**After**:

```liquid
<div x-data="{ menuOpen: false }">
  <button @click="menuOpen = !menuOpen">Toggle Menu</button>
  <div x-show="menuOpen" x-collapse>Menu content</div>
</div>
```

#### 3.4 Event Handler Migration

**Pattern**: Replace inline event handlers with Alpine.js directives

**Before**:

```liquid
<form onsubmit="event.preventDefault(); addToCart(this); return false;">
  <button type="submit">Add to Cart</button>
</form>
```

**After**:

```liquid
<form
  @submit.prevent="addToCart($el)"
  x-data="productCard({ productUrl: '...', sectionId: '...', productId: '...' })"
>
  <button type="submit" :disabled="loading">
    <span x-show="!loading">Add to Cart</span>
    <span x-show="loading">Adding...</span>
  </button>
  <p x-show="errorMessage" x-text="errorMessage" class="b-has-text-danger"></p>
</form>
```

#### 3.5 Dynamic Style Migration

**Pattern**: Replace Liquid-generated inline styles with CSS custom properties or utility classes

**Before**:

```liquid
<div style="background-color: {{ section.settings.bg_color }}; padding: {{ section.settings.spacing }}px;">
  Content
</div>
```

**After** (Option 1: CSS Custom Properties):

```liquid
<div
  style="--bg-color: {{ section.settings.bg_color }};"
  class="b-p-{{ section.settings.spacing }} custom-bg"
>
  Content
</div>
```

```scss
// In SCSS
.custom-bg {
  background-color: var(--bg-color);
}
```

**After** (Option 2: Utility Classes):

```liquid
{% assign spacing_class = 'b-p-' | append: section.settings.spacing %}
<div class="{{ spacing_class }} b-has-background-{{ section.settings.bg_color }}">
  Content
</div>
```

### 4. Component Creation Workflow

#### 4.1 When to Create a Component

Create a new Alpine.js component when:

1. Interactive pattern is used more than twice
2. Logic is complex enough to benefit from encapsulation
3. State management is needed
4. Component needs to be configurable

#### 4.2 Component Creation Steps

1. **Create component file**: `src/bulma/scripts/custom/component-name.js`
2. **Implement component logic** using the plugin pattern
3. **Register in bundle**: Import and register in `src/alpine-bundle.js`
4. **Document usage**: Add JSDoc comments and usage examples
5. **Test in template**: Use in a Liquid template with `x-data`

#### 4.3 Component Template

```javascript
/**
 * Component Name
 *
 * Description of what the component does
 *
 * @param {Object} config - Configuration object
 * @param {string} config.option1 - Description of option1
 * @param {number} config.option2 - Description of option2
 *
 * @example
 * <div x-data="componentName({ option1: 'value', option2: 100 })">
 *   <button @click="methodName">Action</button>
 * </div>
 */
export default function (Alpine) {
  Alpine.data("componentName", (config = {}) => ({
    // Configuration with defaults
    option1: config.option1 || "default",
    option2: config.option2 || 0,

    // Internal state
    internalState: false,

    // Computed properties
    get computedValue() {
      return this.option1.toUpperCase();
    },

    // Lifecycle
    init() {
      console.log("Component initialized");
      // Setup logic
    },

    // Public methods
    methodName() {
      this.internalState = !this.internalState;
    },

    // Private methods (convention: prefix with _)
    _privateMethod() {
      // Internal logic
    },
  }));
}
```

## Data Models

### 1. Component Configuration

Components receive configuration through the `x-data` attribute:

```typescript
interface ComponentConfig {
  [key: string]: any; // Component-specific configuration
}
```

### 2. Carousel Configuration

```typescript
interface CarouselConfig {
  slides: string | HTMLElement[]; // CSS selector or array of slide elements
  intervalTime: number; // Autoplay interval in milliseconds (0 to disable)
}

interface CarouselState {
  currentSlideIndex: number;
  isPaused: boolean;
  touchStartX: number | null;
  touchEndX: number | null;
}
```

### 3. Product Card Configuration

```typescript
interface ProductCardConfig {
  productUrl: string; // Product page URL
  sectionId: string; // Section ID for rendering
  productId: string; // Product ID
}

interface ProductCardState {
  loading: boolean;
  modalOpen: boolean;
  errorMessage: string;
  quickAddInfo: string; // Cached product HTML
}
```

### 4. Safelist Data

```typescript
interface Safelist {
  classes: string[]; // Array of Bulma classes to preserve
}
```

Example:

```json
["b-has-text-centered-desktop", "b-is-size-1-mobile", "b-badge-primary"]
```

## Error Handling

### 1. CSS Build Errors

**Scenario**: SCSS compilation fails

**Handling**:

- Build process should fail with clear error message
- Error should indicate which SCSS file has the issue
- Provide line number and description

**Prevention**:

- Use Sass linter (stylelint)
- Validate variable usage
- Test builds locally before deployment

### 2. CSS Purging Errors

**Scenario**: Required classes are purged

**Handling**:

- Add classes to manual safelist in `src/postcss.config.cjs`
- Re-run safelist extraction script
- Verify class usage in templates

**Prevention**:

- Run safelist extraction before each build
- Use consistent class naming
- Document dynamic class usage

### 3. Alpine.js Component Errors

**Scenario**: Component initialization fails

**Handling**:

- Log error to console with component name
- Provide fallback behavior when possible
- Display user-friendly error message

**Example**:

```javascript
init() {
  try {
    // Initialization logic
  } catch (error) {
    console.error(`[componentName] Initialization failed:`, error)
    this.errorMessage = 'Component failed to load. Please refresh the page.'
  }
}
```

### 4. Shopify API Errors

**Scenario**: Cart API request fails

**Handling**:

- Display error message to user
- Publish error event for tracking
- Provide retry mechanism

**Example**:

```javascript
addToCart(formElement) {
  this.loading = true
  this.errorMessage = ''

  fetch(window.routes.cart_add_url, config)
    .then(response => response.json())
    .then(response => {
      if (response.status) {
        // Error from Shopify
        this.errorMessage = response.description || 'Failed to add to cart'
        this._publishError(response)
        return
      }
      // Success
      this._publishSuccess(response)
    })
    .catch(error => {
      console.error('[productCard] Cart error:', error)
      this.errorMessage = 'Network error. Please try again.'
    })
    .finally(() => {
      this.loading = false
    })
}
```

### 5. Migration Errors

**Scenario**: Migrated template doesn't match original behavior

**Handling**:

- Revert to previous version via Git
- Document the issue
- Analyze differences
- Adjust migration approach

**Prevention**:

- Test each template after migration
- Compare visual appearance side-by-side
- Test all interactive features
- Use browser DevTools to verify styles

## Testing Strategy

### 1. Visual Regression Testing

**Approach**: Compare before/after screenshots of migrated templates

**Tools**:

- Browser DevTools (screenshot feature)
- Manual visual inspection
- Side-by-side comparison

**Process**:

1. Take screenshot of original template
2. Migrate template
3. Take screenshot of migrated template
4. Compare for differences
5. Adjust if needed

### 2. Functional Testing

**Approach**: Test all interactive features after migration

**Test Cases**:

- Click handlers work correctly
- Forms submit properly
- Modals open/close
- Carousels navigate
- Cart updates reflect correctly
- Error states display properly

**Process**:

1. List all interactive features in template
2. Test each feature manually
3. Verify console for errors
4. Test on multiple devices/browsers

### 3. Performance Testing

**Approach**: Measure page load and bundle sizes

**Metrics**:

- CSS bundle size (before/after purging)
- JavaScript bundle size
- Page load time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)

**Tools**:

- Chrome DevTools (Lighthouse)
- Network tab (bundle sizes)
- Performance tab (timing)

**Targets**:

- CSS bundle: < 100KB (gzipped)
- JS bundle: < 50KB (gzipped)
- TTI: < 3s on 3G
- FCP: < 1.5s

### 4. Cross-Browser Testing

**Browsers**:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Test Areas**:

- Bulma class rendering
- Alpine.js functionality
- Touch interactions (mobile)
- Responsive breakpoints

### 5. Accessibility Testing

**Approach**: Ensure migrated templates maintain accessibility

**Test Cases**:

- Keyboard navigation works
- Screen reader compatibility
- Focus states visible
- ARIA attributes preserved
- Color contrast meets WCAG AA

**Tools**:

- axe DevTools
- WAVE browser extension
- Keyboard-only navigation
- Screen reader (NVDA/VoiceOver)

### 6. Shopify Integration Testing

**Approach**: Verify Shopify-specific features work correctly

**Test Cases**:

- Cart add/update/remove
- Product variant selection
- Section rendering
- Theme settings apply correctly
- Payment buttons initialize
- Pub/sub events fire

**Process**:

1. Test in Shopify development store
2. Verify cart drawer updates
3. Test product quick add
4. Verify section rendering
5. Check theme customizer

## Migration Workflow

### Phase 1: Preparation

1. **Audit current templates**
   - Identify all templates with inline styles
   - Identify all templates with inline scripts
   - Document current functionality
   - Prioritize templates by complexity

2. **Setup tooling**
   - Verify build process works
   - Test safelist extraction
   - Setup version control branches
   - Create testing checklist

3. **Create reference documentation**
   - Document Bulma class mappings
   - Document Alpine.js patterns
   - Create migration examples
   - Setup team guidelines

### Phase 2: Component Development

1. **Identify reusable patterns**
   - Analyze interactive features across templates
   - Group similar functionality
   - Design component APIs

2. **Create Alpine.js components**
   - Implement components following plugin pattern
   - Add comprehensive documentation
   - Test components in isolation
   - Register in Alpine bundle

3. **Create custom Bulma styles**
   - Identify styles not covered by Bulma
   - Add to SCSS source
   - Follow naming conventions
   - Test compilation

### Phase 3: Template Migration

1. **Select template for migration**
   - Start with simple templates
   - Progress to complex templates
   - One template at a time

2. **Migrate styles**
   - Replace inline styles with Bulma classes
   - Add custom styles to SCSS if needed
   - Test visual appearance
   - Verify responsive behavior

3. **Migrate scripts**
   - Replace inline scripts with Alpine.js
   - Use existing components where possible
   - Create new components if needed
   - Test interactivity

4. **Test migrated template**
   - Visual regression test
   - Functional test
   - Cross-browser test
   - Performance test

5. **Document migration**
   - Note patterns used
   - Document any issues
   - Update migration guide

6. **Commit and deploy**
   - Commit to version control
   - Deploy to development store
   - Test in production-like environment
   - Get stakeholder approval

### Phase 4: Optimization

1. **Run safelist extraction**
   - Execute `node src/purge/extract-b-safelist.js`
   - Review generated safelist
   - Add manual entries if needed

2. **Build optimized bundles**
   - Compile SCSS with purging
   - Bundle and minify JavaScript
   - Verify bundle sizes

3. **Performance testing**
   - Measure page load times
   - Check bundle sizes
   - Run Lighthouse audits
   - Optimize if needed

### Phase 5: Documentation

1. **Update team documentation**
   - Document new patterns
   - Update style guide
   - Create component library
   - Add troubleshooting guide

2. **Create maintenance guide**
   - How to add new components
   - How to add custom styles
   - How to update safelist
   - How to test changes

## Rollback Strategy

### Git-Based Rollback

1. **Before migration**: Create feature branch
2. **During migration**: Commit after each template
3. **If issues**: Revert specific commits or entire branch
4. **After verification**: Merge to main branch

### Template-Level Rollback

1. Keep backup of original template
2. If migrated template has issues, restore backup
3. Fix issues in development
4. Re-deploy when ready

### Emergency Rollback

1. Revert to previous theme version in Shopify
2. Investigate issues offline
3. Fix and re-deploy when stable

## Performance Considerations

### CSS Optimization

- **Purging**: Remove unused classes (target: 70-80% reduction)
- **Minification**: Compress CSS (target: 30-40% reduction)
- **Gzipping**: Server-side compression (target: 60-70% reduction)
- **Critical CSS**: Inline critical styles (future enhancement)

### JavaScript Optimization

- **Tree shaking**: Remove unused Alpine.js features
- **Minification**: Compress JavaScript
- **Defer loading**: Load Alpine.js with `defer` attribute
- **Code splitting**: Split components if bundle grows large (future enhancement)

### Runtime Performance

- **Alpine.js**: Lightweight reactivity (~15KB gzipped)
- **Minimal inline JS**: Only Alpine.js directives
- **Efficient selectors**: Use specific selectors in components
- **Lazy loading**: Load components only when needed (future enhancement)

## Security Considerations

### XSS Prevention

- **Liquid escaping**: Always escape user input in Liquid
- **Alpine.js**: Use `x-text` instead of `x-html` for user content
- **Form validation**: Validate on both client and server

### CSRF Protection

- **Shopify forms**: Use Shopify's CSRF tokens
- **AJAX requests**: Include CSRF token in headers

### Content Security Policy

- **Inline scripts**: Minimize inline scripts (Alpine.js directives are safe)
- **External resources**: Load from trusted CDNs only
- **Nonce/hash**: Use CSP nonces for any required inline scripts

## Future Enhancements

### 1. Component Library

Create a visual component library (Storybook) showing:

- All available Alpine.js components
- Usage examples
- Configuration options
- Interactive demos

### 2. Automated Testing

Implement automated testing:

- Visual regression tests (Percy, Chromatic)
- E2E tests (Playwright, Cypress)
- Unit tests for Alpine.js components (Jest)

### 3. Performance Monitoring

Add performance monitoring:

- Real User Monitoring (RUM)
- Bundle size tracking
- Page load metrics
- Error tracking (Sentry)

### 4. Advanced Optimizations

- Critical CSS extraction
- Code splitting for large components
- Service worker for caching
- Image optimization pipeline

### 5. Developer Tools

- CLI tool for creating new components
- Template migration helper script
- Automated safelist extraction in build
- Live reload for development
