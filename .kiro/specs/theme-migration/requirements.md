# Requirements Document

## Introduction

This document defines the requirements for migrating the PlayLoveToys Shopify theme from inline styles and scattered JavaScript to a unified architecture using Bulma CSS (with `b-` prefix) and Alpine.js components. The migration aims to improve maintainability, performance, and developer experience while preserving all existing functionality.

## Glossary

- **Theme System**: The Shopify Liquid-based theme that renders the storefront
- **Bulma Bundle**: The compiled CSS file at `@assets/a-bulma-full.css` containing all Bulma classes with `b-` prefix
- **Alpine Bundle**: The compiled JavaScript file containing Alpine.js core and custom components
- **Inline Styles**: CSS styles applied directly in HTML via `style` attributes
- **Inline Scripts**: JavaScript code embedded directly in Liquid templates via `<script>` tags
- **Component**: A reusable Alpine.js data component registered as a plugin
- **Liquid Template**: Shopify template files (.liquid) in layout, sections, snippets, and blocks directories
- **SCSS Source**: Source Sass files in `src/bulma/sass/` that compile to the Bulma Bundle
- **Safelist**: JSON file containing Bulma classes that must be preserved during CSS purging

## Requirements

### Requirement 1: CSS Architecture Migration

**User Story:** As a theme developer, I want all styling to be applied through Bulma CSS classes, so that styles are consistent, maintainable, and optimized.

#### Acceptance Criteria

1. WHEN a developer needs to style an element, THE Theme System SHALL use Bulma classes with `b-` prefix exclusively
2. WHEN inline styles exist in a Liquid Template, THE Theme System SHALL replace them with equivalent Bulma classes
3. WHEN a required style does not exist in Bulma, THE Theme System SHALL add the style to SCSS Source and compile to Bulma Bundle
4. IF custom CSS classes exist outside Bulma, THEN THE Theme System SHALL migrate them to SCSS Source or replace with Bulma equivalents
5. WHERE a Liquid Template uses dynamic styles via Liquid variables, THE Theme System SHALL convert them to Bulma utility classes or CSS custom properties

### Requirement 2: JavaScript Architecture Migration

**User Story:** As a theme developer, I want all interactivity to be handled through Alpine.js components, so that JavaScript is modular, non-blocking, and maintainable.

#### Acceptance Criteria

1. WHEN a developer needs to add interactivity, THE Theme System SHALL use Alpine.js components from Alpine Bundle
2. WHEN Inline Scripts exist in a Liquid Template, THE Theme System SHALL replace them with Alpine.js declarative directives
3. WHEN a new interactive pattern is needed, THE Theme System SHALL create a reusable Alpine.js Component and register it in Alpine Bundle
4. IF JavaScript functionality requires initialization, THEN THE Theme System SHALL use Alpine.js lifecycle hooks (`init`, `$nextTick`, etc.)
5. WHERE event handling is needed, THE Theme System SHALL use Alpine.js directives (`x-on`, `@click`, etc.) instead of inline event handlers

### Requirement 3: Component Reusability

**User Story:** As a theme developer, I want to reuse interactive components across multiple templates, so that I can maintain consistency and reduce code duplication.

#### Acceptance Criteria

1. WHEN a Component is created, THE Theme System SHALL register it as an Alpine.js plugin in Alpine Bundle
2. WHEN a Component is used in multiple locations, THE Theme System SHALL accept configuration parameters via `x-data` attributes
3. WHEN a Component needs styling, THE Theme System SHALL use Bulma classes that can be customized via parameters
4. IF a Component pattern is used more than twice, THEN THE Theme System SHALL extract it into a reusable Alpine.js Component
5. WHERE Components need to communicate, THE Theme System SHALL use Alpine.js stores or Shopify pub/sub events

### Requirement 4: Performance Optimization

**User Story:** As a store visitor, I want the theme to load quickly and not block page rendering, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN the Bulma Bundle is generated, THE Theme System SHALL purge unused CSS classes based on Liquid Template usage
2. WHEN Bulma classes are used in Liquid Template schemas, THE Theme System SHALL add them to Safelist automatically
3. WHEN Alpine Bundle loads, THE Theme System SHALL defer execution until DOM is ready without blocking rendering
4. IF inline JavaScript exists, THEN THE Theme System SHALL minimize it to only Alpine.js directives
5. WHERE CSS is needed, THE Theme System SHALL serve a single optimized Bulma Bundle file

### Requirement 5: Shopify Integration

**User Story:** As a theme developer, I want Alpine.js components to integrate seamlessly with Shopify features, so that cart, checkout, and product functionality work correctly.

#### Acceptance Criteria

1. WHEN a Component interacts with the cart, THE Theme System SHALL use Shopify Cart API endpoints
2. WHEN cart updates occur, THE Theme System SHALL publish Shopify pub/sub events for cart drawer updates
3. WHEN product forms are submitted, THE Theme System SHALL handle Shopify section rendering for dynamic updates
4. IF Shopify Payment Buttons are present, THEN THE Theme System SHALL initialize them after Alpine.js renders content
5. WHERE product variants are selected, THE Theme System SHALL update URLs and availability without full page reload

### Requirement 6: Developer Experience

**User Story:** As a theme developer, I want clear patterns and documentation for styling and interactivity, so that I can work efficiently and consistently.

#### Acceptance Criteria

1. WHEN a developer adds a new feature, THE Theme System SHALL provide documented patterns for Bulma classes and Alpine.js usage
2. WHEN Bulma classes are used in schemas, THE Theme System SHALL automatically extract them to Safelist via build script
3. WHEN a Component is created, THE Theme System SHALL follow a consistent plugin registration pattern
4. IF a migration task is performed, THEN THE Theme System SHALL document the before/after pattern for reference
5. WHERE custom styles are needed, THE Theme System SHALL provide clear guidelines for adding to SCSS Source

### Requirement 7: Backward Compatibility

**User Story:** As a store owner, I want the migration to preserve all existing functionality, so that my store continues to work without disruption.

#### Acceptance Criteria

1. WHEN a template is migrated, THE Theme System SHALL maintain identical visual appearance and behavior
2. WHEN interactive features are converted to Alpine.js, THE Theme System SHALL preserve all event handlers and logic
3. WHEN styles are converted to Bulma classes, THE Theme System SHALL match existing spacing, colors, and layouts
4. IF Shopify theme settings exist, THEN THE Theme System SHALL continue to respect them after migration
5. WHERE third-party integrations exist, THE Theme System SHALL ensure they continue to function correctly

### Requirement 8: Migration Process

**User Story:** As a theme developer, I want a systematic migration process, so that I can migrate templates incrementally without breaking the site.

#### Acceptance Criteria

1. WHEN starting migration, THE Theme System SHALL identify all Liquid Templates with inline styles or scripts
2. WHEN migrating a template, THE Theme System SHALL convert one template at a time to minimize risk
3. WHEN a template is migrated, THE Theme System SHALL test functionality before proceeding to next template
4. IF migration introduces issues, THEN THE Theme System SHALL provide rollback capability via version control
5. WHERE templates are migrated, THE Theme System SHALL document changes and patterns used

### Requirement 9: CSS Purging and Safelist Management

**User Story:** As a theme developer, I want unused CSS to be automatically removed while preserving classes used in theme settings, so that the bundle size is optimized.

#### Acceptance Criteria

1. WHEN the build process runs, THE Theme System SHALL scan all Liquid Templates for Bulma class usage
2. WHEN Bulma classes appear in schema settings, THE Theme System SHALL extract them to Safelist automatically
3. WHEN PostCSS processes the CSS, THE Theme System SHALL remove classes not in templates or Safelist
4. IF a class is needed but purged, THEN THE Theme System SHALL add it to manual Safelist in PostCSS config
5. WHERE schema options use Bulma classes, THE Theme System SHALL detect them in select, radio, button_group, segmented, and checkbox types

### Requirement 10: Alpine.js Component Architecture

**User Story:** As a theme developer, I want Alpine.js components to follow consistent patterns, so that they are predictable and easy to maintain.

#### Acceptance Criteria

1. WHEN a Component is created, THE Theme System SHALL export it as a function that receives Alpine as parameter
2. WHEN a Component is registered, THE Theme System SHALL use `Alpine.data()` to make it available in templates
3. WHEN a Component needs configuration, THE Theme System SHALL accept parameters in the component factory function
4. IF a Component needs lifecycle logic, THEN THE Theme System SHALL use the `init()` method
5. WHERE Components need reactive state, THE Theme System SHALL use Alpine.js reactive properties and getters
