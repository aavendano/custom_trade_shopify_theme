# 🎨 Frontend Development Style Guide - Advanced Slideshow Banner Pattern

## 📋 Overview

This document defines the programming patterns, architecture decisions, and development standards used in the optimized slideshow banner component. These patterns should be applied consistently across all frontend components in the project to ensure maintainability, performance, and developer experience.

**Target Audience:** LLM Assistants, Frontend Developers, Code Reviewers
**Last Updated:** October 2025
**Applies to:** All Liquid templates, CSS, and JavaScript components

---

## 🏗️ Architecture Patterns

### 1.1 Component Structure

**Pattern:** Single-file component architecture with clear separation of concerns

```liquid
<!-- HTML Structure -->
<section class="component-name">
  <div class="component-container">
    <!-- Component content -->
  </div>
</section>

<!-- JavaScript -->
<script>
function componentName{{ section.id | replace: '-', '_' }}() {
  return {
    // Reactive state
    // Methods
    // Lifecycle hooks
  }
}
</script>

<!-- Styles -->
{% style %}
  /* Component-specific styles */
{% endstyle %}
```

**✅ DO:**
- Keep HTML, JavaScript, and CSS in the same file
- Use semantic section names and IDs
- Group related functionality together

**❌ DON'T:**
- Split component logic across multiple files
- Mix different component concerns
- Use generic class names

### 1.2 Naming Conventions

**CSS Classes:**
```css
/* ✅ GOOD */
.banner-section-{{ section.id }}
.slideshow-container-{{ section.id }}
.nav-button-{{ section.id }}

/* ❌ BAD */
.section
.container
.button
```

**JavaScript Functions:**
```javascript
// ✅ GOOD
function slideshowSection{{ section.id | replace: '-', '_' }}() {
  return {
    currentSlide: 0,
    isTransitioning: false,
    // methods...
  }
}

// ❌ BAD
function init() {
  return { x: 0, y: false }
}
```

**Variable Naming:**
- Use `camelCase` for JavaScript variables
- Use `kebab-case` for CSS classes
- Use `{{ section.id | replace: '-', '_' }}` for unique identifiers

---

## 🎨 CSS Organization & Bulma Integration

### 2.1 CSS Structure Pattern

**Required Structure:**
```liquid
{% style %}
  /* 1. Component-specific variables */
  .component-name-{{ section.id }} {
    /* Base styles */
  }

  /* 2. Layout and positioning - Use Bulma utilities */
  .component-container-{{ section.id }} {
    @apply relative overflow-hidden;
  }

  /* 3. Interactive elements */
  .nav-element-{{ section.id }} {
    @apply cursor-pointer transition-all duration-300;
  }

  /* 4. Responsive styles - Use Bulma breakpoints */
  @media (max-width: 768px) {
    .component-name-{{ section.id }} {
      @apply text-sm;
    }
  }

  /* 5. Custom animations (keep at bottom) */
  @keyframes customAnimation {
    from { /* ... */ }
    to { /* ... */ }
  }
{% endstyle %}
```

### 2.2 Bulma Integration Strategy

**✅ Prioritized Bulma Classes:**

1. **Layout & Positioning:**
   ```css
   @apply relative overflow-hidden;
   @apply absolute top-1/2 transform -translate-y-1/2;
   @apply flex justify-between items-center;
   ```

2. **Spacing:**
   ```css
   @apply p-4 m-2 gap-2;
   @apply mt-8 mb-4 ml-4 mr-4;
   ```

3. **Typography:**
   ```css
   @apply text-center text-lg font-bold;
   @apply text-white;
   ```

4. **Interactive Elements:**
   ```css
   @apply cursor-pointer transition-all duration-300;
   @apply hover:scale-110 focus:outline-none;
   ```

5. **Responsive Design:**
   ```css
   @apply w-full md:w-1/2 lg:w-1/3;
   @apply text-sm md:text-base lg:text-lg;
   ```

**✅ Bulma Class Usage Priority:**
1. **Layout utilities** (flex, grid, positioning)
2. **Spacing utilities** (margins, padding)
3. **Typography utilities** (text sizes, colors)
4. **Interactive utilities** (hover, focus, cursor)
5. **Responsive utilities** (breakpoints, responsive sizing)

### 2.3 Custom CSS Guidelines

**✅ When to Use Custom CSS:**
- Complex animations and transitions
- Dynamic Shopify settings integration
- Touch behaviors and gestures
- Component-specific functionality

**✅ Custom CSS Organization:**
```css
/* 1. Dynamic backgrounds (Shopify settings) */
.banner-content-{{ section.id }} {
  background: linear-gradient({{ section.settings.gradient_direction }}, ...);
}

/* 2. Touch behaviors */
.slideshow-container-{{ section.id }} {
  touch-action: pan-y;
}

/* 3. Custom animations */
@keyframes slideInSmooth {
  /* Animation keyframes */
}
```

---

## ⚡ JavaScript & Alpine.js Patterns

### 3.1 Alpine.js Component Structure

**Required Pattern:**
```javascript
function componentName{{ section.id | replace: '-', '_' }}() {
  return {
    // 1. Reactive State
    blocks: [],
    currentSlide: 0,
    isLoading: false,
    isTransitioning: false,

    // 2. Initialization
    init() {
      this.loadData();
      this.setupEventListeners();
    },

    // 3. Data Loading
    loadData() {
      // Load component data
    },

    // 4. Event Handlers
    handleClick() {
      // Handle user interactions
    },

    // 5. Business Logic
    nextSlide() {
      if (this.canAdvance()) {
        this.currentSlide++;
      }
    },

    // 6. Utility Methods
    canAdvance() {
      return this.currentSlide < this.blocks.length - 1;
    }
  }
}
```

### 3.2 State Management

**✅ Reactive State Pattern:**
```javascript
// ✅ GOOD - Clear, reactive state
return {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  // Methods that modify state
  selectItem(item) {
    this.selectedItem = item;
  }
}

// ❌ BAD - Unclear state management
return {
  x: [],
  y: null,
  z: false,
  // Unclear what these represent
}
```

### 3.3 Error Handling & Sandbox Compatibility

**Required Pattern:**
```javascript
// Safe localStorage wrapper
function safeLocalStorage() {
  try {
    if (window.self !== window.top) {
      // Sandboxed environment
      return {
        getItem: function(key) {
          try {
            return localStorage.getItem(key);
          } catch (e) {
            console.warn('[Component] localStorage failed:', e.message);
            return null;
          }
        },
        // ... other methods with error handling
      };
    }
    return localStorage;
  } catch (e) {
    // Fallback for environments without localStorage
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    };
  }
}
```

### 3.4 Dynamic Class Building Optimization

**Pattern:** Loop-based dynamic class building for responsive settings

When dealing with multiple responsive settings (alignment, sizing, etc.), instead of writing repetitive if-else statements, use a loop-based approach with arrays of setting names:

```liquid
{% liquid
  // ✅ EFFICIENT: Loop-based approach
  assign alignment_settings = 'text_alignment_mobile,text_alignment_tablet,text_alignment_desktop,text_alignment_widescreen,text_alignment_fullhd' | split: ','
  assign size_settings = 'text_size_mobile,text_size_tablet,text_size_desktop,text_size_widescreen,text_size_fullhd' | split: ','

  assign alignment_classes = ''
  assign size_classes = ''

  for setting in alignment_settings
    assign value = block.settings[setting]
    if value != ''
      assign alignment_classes = alignment_classes | append: ' ' | append: value
    endif
  endfor

  for setting in size_settings
    assign value = block.settings[setting]
    if value != ''
      assign size_classes = size_classes | append: ' ' | append: value
    endif
  endfor
%}

<!-- ❌ INEFFICIENT: Repetitive if-else statements -->
{% liquid
  assign alignment_classes = ''

  if block.settings.text_alignment_mobile != ''
    assign alignment_classes = alignment_classes | append: ' ' | append: block.settings.text_alignment_mobile
  endif

  if block.settings.text_alignment_tablet != ''
    assign alignment_classes = alignment_classes | append: ' ' | append: block.settings.text_alignment_tablet
  endif

  if block.settings.text_alignment_desktop != ''
    assign alignment_classes = alignment_classes | append: ' ' | append: block.settings.text_alignment_desktop
  endif

  if block.settings.text_alignment_widescreen != ''
    assign alignment_classes = alignment_classes | append: ' ' | append: block.settings.text_alignment_widescreen
  endif

  if block.settings.text_alignment_fullhd != ''
    assign alignment_classes = alignment_classes | append: ' ' | append: block.settings.text_alignment_fullhd
  endif
%}
```

**✅ Benefits of Loop-Based Approach:**
- **Maintainable**: Easy to add new breakpoints or settings
- **Scalable**: No need to modify logic when adding new responsive options
- **Clean**: Reduces code duplication significantly
- **Consistent**: Same pattern can be reused across components
- **Readable**: Intent is clear - "for each setting in this list, check if it has a value"

**✅ When to Use:**
- Multiple related settings with the same conditional logic
- Dynamic setting names that follow a pattern
- Need to add/remove settings frequently
- Clean, maintainable code is a priority

**✅ Array Building Pattern:**
```liquid
// Create comma-separated string and split into array
assign setting_names = 'mobile,tablet,desktop,widescreen,fullhd' | split: ','

// Use in loop for dynamic access
for setting in setting_names
  assign value = block.settings['text_alignment_' | append: setting]
  if value != ''
    assign classes = classes | append: ' ' | append: value
  endif
endfor
```

### 3.4 Touch Event Handling

**Required Pattern for Mobile Support:**
```javascript
return {
  // Touch state
  touchStartX: 0,
  touchStartY: 0,
  minSwipeDistance: 50,

  // Touch handlers
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  },

  handleTouchMove(e) {
    if (!this.touchStartX || !this.touchStartY) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = this.touchStartX - currentX;
    const diffY = this.touchStartY - currentY;

    // Prevent vertical scrolling during horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  },

  handleTouchEnd(e) {
    // Handle swipe gestures
    const endX = e.changedTouches[0].clientX;
    const diffX = this.touchStartX - endX;

    if (Math.abs(diffX) > this.minSwipeDistance) {
      if (diffX > 0) {
        this.nextSlide(); // Swipe left
      } else {
        this.previousSlide(); // Swipe right
      }
    }

    // Reset touch coordinates
    this.touchStartX = 0;
    this.touchStartY = 0;
  }
}
```

---

## 📱 Responsive Design Strategy

### 4.1 Mobile-First Approach

**Required Pattern:**
```css
/* 1. Base styles (mobile-first) */
.component-element {
  @apply w-full text-sm p-2;
}

/* 2. Tablet styles */
@media (min-width: 768px) {
  .component-element {
    @apply md:w-1/2 md:text-base md:p-4;
  }
}

/* 3. Desktop styles */
@media (min-width: 1024px) {
  .component-element {
    @apply lg:w-1/3 lg:text-lg lg:p-6;
  }
}
```

### 4.2 Touch-Friendly Design

**Required for Interactive Elements:**
```css
/* Touch-friendly sizing */
@media (hover: none) and (pointer: coarse) {
  .nav-button-{{ section.id }} {
    @apply w-11 h-11 text-lg; /* Larger touch targets */
  }

  .interactive-element-{{ section.id }} {
    @apply min-h-12; /* Minimum 48px touch target */
  }
}
```

---

## 🛡️ Error Handling & Compatibility

### 5.1 Sandbox Environment Handling

**Required Pattern:**
```javascript
function handleSandboxEnvironment() {
  if (window.self !== window.top) {
    console.warn('[Component] Running in sandboxed environment');

    // Handle CSP violations gracefully
    window.addEventListener('error', function(event) {
      if (event.message.includes('Content Security Policy')) {
        console.warn('[Component] CSP violation detected, continuing gracefully');
        event.preventDefault();
      }
    });

    // Handle localStorage restrictions
    const storage = safeLocalStorage();

    // Handle touch event interventions
    handleTouchInterventions();
  }
}
```

### 5.2 Graceful Degradation

**Required Pattern:**
```javascript
// Provide fallbacks for unsupported features
function initializeComponent() {
  try {
    // Try modern approach first
    loadModernFeatures();
  } catch (error) {
    console.warn('[Component] Modern features failed, using fallbacks');
    // Fallback to basic functionality
    loadBasicFeatures();
  }
}
```

---

## 🚀 Performance Optimization

### 6.1 CSS Optimization

**✅ DO:**
- Use Bulma utilities instead of custom CSS where possible
- Group related styles together
- Use semantic class names
- Minimize specificity conflicts

**❌ DON'T:**
- Write verbose custom CSS when Bulma utilities exist
- Use overly specific selectors
- Mix different naming conventions

### 6.2 JavaScript Optimization

**✅ DO:**
- Use Alpine.js reactive patterns
- Debounce expensive operations
- Clean up event listeners
- Use efficient DOM manipulation

**❌ DON'T:**
- Use jQuery or heavy frameworks
- Poll for changes
- Leave event listeners active
- Manipulate DOM inefficiently

### 6.3 Asset Loading

**✅ DO:**
- Load only necessary fonts
- Use efficient image formats
- Implement lazy loading where appropriate

---

## 🔧 Development Workflow

### 7.1 Component Development Process

1. **Plan the component structure**
   - Define required functionality
   - Identify state management needs
   - Plan responsive breakpoints

2. **Build with Bulma first**
   - Use Bulma utilities for layout and styling
   - Add custom CSS only when necessary
   - Implement responsive design with Bulma breakpoints

3. **Add Alpine.js functionality**
   - Implement reactive state
   - Add event handlers
   - Include error handling

4. **Test across environments**
   - Test in Shopify theme editor (sandboxed)
   - Test on mobile devices
   - Test responsive breakpoints

5. **Optimize and refine**
   - Remove unused CSS
   - Optimize JavaScript performance
   - Ensure accessibility

### 7.2 Code Review Checklist

**✅ Must Have:**
- [ ] Bulma utilities used where possible
- [ ] Responsive design implemented
- [ ] Touch event handling included
- [ ] Sandbox environment compatibility
- [ ] Error handling and graceful degradation
- [ ] Semantic HTML structure
- [ ] Accessible markup and ARIA labels
- [ ] Performance optimizations applied

**✅ Nice to Have:**
- [ ] Custom animations enhance UX
- [ ] Advanced touch gestures
- [ ] Progressive enhancement features
- [ ] Performance monitoring

---

## 📋 Component Template

Use this template for all new components:

```liquid
<!-- Component Name -->
<section class="component-name-{{ section.id }}">
  <div class="component-container-{{ section.id }}">
    <!-- Component HTML -->
  </div>
</section>

<script>
function componentName{{ section.id | replace: '-', '_' }}() {
  return {
    // Reactive state
    data: [],
    isLoading: false,

    // Lifecycle
    init() {
      this.loadData();
    },

    // Methods
    loadData() {
      // Load component data
    },

    handleInteraction() {
      // Handle user interactions
    }
  }
}
</script>

{% style %}
  /* Component styles using Bulma utilities */
  .component-name-{{ section.id }} {
    @apply relative;
  }

  /* Custom styles only when necessary */
  .custom-element-{{ section.id }} {
    /* Custom functionality */
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .component-name-{{ section.id }} {
      @apply text-sm;
    }
  }
{% endstyle %}
```

---

## 🎯 Success Metrics

**Performance:**
- CSS bundle size reduction > 50%
- JavaScript execution time < 100ms
- Mobile performance score > 90

**Maintainability:**
- Code duplication < 10%
- Consistent patterns across components
- Clear separation of concerns

**User Experience:**
- Touch interaction support on all components
- Responsive design on all screen sizes
- Smooth animations and transitions

**Developer Experience:**
- Easy to understand and modify
- Consistent patterns across project
- Clear documentation and comments

---

*This style guide ensures consistent, maintainable, and high-performance frontend components across the entire project. All new components should follow these patterns to maintain code quality and developer productivity.*
