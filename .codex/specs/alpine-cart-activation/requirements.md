# Requirements Document

## Introduction

The cart experience needs to fully embrace Alpine.js + Alpine-AJAX so that line items, totals, discounts, notes, and footer cards update seamlessly without a full page reload. The redesigned Bulma-based layout is already in place, but the interactive behavior must align with Shopify's AJAX Cart API, keep fragment refreshes scoped to `[data-cart-fragment]`, and maintain compatibility with existing Shopify features and mobile-friendly UX expectations.

## Requirements

### Requirement 1

**User Story:** As a shopper, I want quantity controls that instantly reflect pricing changes, so that I can adjust my cart without waiting for a full reload.

#### Acceptance Criteria

1. WHEN a shopper clicks the `+` button THEN the system SHALL call `/cart/change.js` with `quantity + 1` for the target line AND SHALL refresh only `[data-cart-fragment]`.
2. WHEN a shopper clicks the `-` button THEN the system SHALL prevent quantities below 1 and SHALL update the cart via `/cart/change.js`.
3. WHEN a shopper types a number into the quantity input THEN the system SHALL validate it as an integer ≥ 1 AND SHALL synchronize Alpine state with Shopify's response.
4. IF rapid clicks occur on the quantity buttons THEN the system SHALL serialize requests or debounce updates to avoid race conditions and mismatched UI state.
5. WHEN a quantity update request is in-flight THEN the system SHALL visually disable both the `+` and `−` buttons until the request resolves.

### Requirement 2

**User Story:** As a shopper, I want a reliable remove button, so that deleting an item immediately updates my cart totals and layout.

#### Acceptance Criteria

1. WHEN the shopper clicks the remove button THEN the system SHALL send `/cart/change.js` with `quantity: 0` for that line and SHALL refresh `[data-cart-fragment]`.
2. IF the removed item was the last line in the cart THEN the system SHALL render the empty-state warnings and disable checkout actions.
3. WHEN the fragment reload completes THEN Alpine components SHALL reinitialize without console errors for remaining items.

### Requirement 3

**User Story:** As a shopper, I want cart totals, discounts, and notes to stay accurate, so that I trust the checkout amount and can leave instructions.

#### Acceptance Criteria

1. WHEN Shopify returns updated cart data THEN the system SHALL update subtotal, discounts, estimated total, and tax/shipping notes inside the footer card using the refreshed fragment.
2. WHEN a cart note already exists THEN the system SHALL render the saved note in the textarea during fragment refreshes.
3. WHEN a shopper edits the note THEN the system SHALL persist it using `/cart/update.js` or the checkout submission without breaking the AJAX fragment refresh.
4. IF multi-currency or discount data is present THEN the system SHALL display formatted amounts and discount titles identical to Shopify's response.

### Requirement 4

**User Story:** As a theme developer, I want Alpine.js architecture per line item, so that state stays predictable after fragment reloads.

#### Acceptance Criteria

1. WHEN `[data-cart-fragment]` is refreshed THEN each cart item snippet (`cart-item-b.liquid`) SHALL initialize its own `x-data` scope with line-specific state (quantity, loading, errors).
2. IF the footer card or sticky checkout bar is present THEN its Alpine scope SHALL rehydrate after fragment updates without duplicating event listeners.
3. WHEN `$ajax.refresh('[data-cart-fragment]')` completes THEN Alpine state SHALL match the rendered DOM values for every line item.
4. WHEN Alpine detects AJAX errors THEN the system SHALL expose at least a console warning and keep controls usable for retries.

### Requirement 5

**User Story:** As a shopper, I want the cart page to feel like a cohesive mobile app, so that navigating and continuing shopping remains smooth.

#### Acceptance Criteria

1. WHEN the cart has items THEN the header's continue-shopping button SHALL link to `routes.all_products_collection_url` and remain clickable after fragment refreshes.
2. WHEN the cart becomes empty THEN the centered continue-shopping button SHALL still navigate correctly without layout jumps.
3. IF the sticky/mobile checkout bar is enabled THEN it SHALL stay fixed on mobile, avoid overlapping content, and remain synchronized with totals after fragment refreshes.
4. WHEN the cart fragment refresh occurs THEN the viewport scroll position SHALL remain stable to preserve mobile-app-like UX.

### Requirement 6

**User Story:** As a QA engineer, I want a deterministic AJAX workflow, so that the full test suite can pass consistently.

#### Acceptance Criteria

1. WHEN any AJAX endpoint responds with an error THEN the system SHALL surface a visible or logged error and avoid leaving stale UI state.
2. WHEN multiple updates happen concurrently (e.g., qty change + remove) THEN the system SHALL queue or cancel requests to keep Shopify data authoritative.
3. IF Shopify's `/cart.js` fallback is required THEN the system SHALL gracefully fetch and re-render `[data-cart-fragment]` without reloading the full page.
4. WHEN automated QA runs the provided checklist THEN every listed scenario SHALL pass without manual workarounds.
