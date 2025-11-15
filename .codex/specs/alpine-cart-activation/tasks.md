# Implementation Plan

- [x] 1. Bootstrap AlpineCart utilities and mount fragment controller
  - Create `assets/alpine-cart.js` (or equivalent) defining `window.CartApi` helpers for `/cart/change.js`, `/cart/update.js`, `/cart.js` with serialized JSON bodies and shared error handling
  - Initialize a `cartFragment()` Alpine data factory that tracks `cart`, `isRefreshing`, `pendingRequests`, `lastError`, and exposes `refreshFragment`, `queueRequest`, and `handleError`
  - Wrap `[data-cart-fragment]` container in `sections/main-cart-items.liquid` with `x-data="cartFragment()"`, hydrate from `window.__CART__`, ensure `$ajax.refresh` + `Alpine.nextTick()` emit `cart:updated`, and maintain scroll stability per Requirement 5.4
  - Add bindings for loading indicators and keep continue-shopping link active after fragment refreshes
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.4, 6.1, 6.2_

- [x] 2. Implement cart item Alpine scope
  - Update `snippets/cart-item-b.liquid` to instantiate `x-data="cartItem(props)"` with line metadata (line id, quantity, rules, remove URL)
  - Bind `+/-` buttons and quantity input to `increase()`, `decrease()`, `changeQuantity()`, ensuring buttons disable while `isUpdating`
  - Handle manual input validation, `remove()` flow when qty hits 0, and display inline errors for HTTP 422 responses
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.3, 6.1_

- [ ] 2.1 Serialize quantity/remove requests
  - Ensure `cartItem` calls `cartFragment.queueRequest` so rapid clicks get serialized/debounced and Alpine state stays in sync
  - Re-enable controls only after Shopify responds and fragment refresh completes
  - _Requirements: 1.4, 1.5, 6.2_

- [ ] 3. Refresh fragment and rehydrate Alpine scopes
  - Implement `$ajax.refresh('[data-cart-fragment]')` within `cartFragment.refreshFragment`, waiting for `Alpine.nextTick()` before emitting `cart:updated` and synchronizing focus for accessibility
  - Guarantee that line components and footer scopes remount without duplicate listeners; verify empty-state renders when cart empties
  - _Requirements: 2.2, 2.3, 2.4, 3.1, 4.2, 4.3, 5.2_

- [ ] 4. Footer/sticky card Alpine scope
  - Add `x-data="cartFooter()"` in `sections/main-cart-footer.liquid` to manage totals, discounts, sticky behavior, and note textarea value
  - Implement debounced note persistence via `CartApi.update`, reacting to `cart:updated` events for totals synchronization
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.3_

- [ ] 5. Continue-shopping and empty state behaviors
  - Confirm both continue-shopping buttons retain correct links post-refresh and empty cart renders proper warnings, disabled checkout, and centered CTA
  - _Requirements: 2.2, 5.1, 5.2_

- [ ] 6. Error handling UX
  - Surface error banners/toasts or inline messages when `cartFragment.handleError` receives failures, including HTTP 422 quantity rule violations
  - Ensure controls re-enable for retries and console warnings log details for QA
  - _Requirements: 4.4, 6.1, 6.3_

- [ ] 7. QA automation hooks
  - Add data attributes or test ids needed for Playwright/Cypress scripts to cover the provided checklist (quantity, remove, notes, sticky footer, responsive behavior)
  - _Requirements: 6.4, 8.x, 9.x, 10.x, 11.x_
