# Design Document

## Overview

The redesigned cart already renders Bulma card layouts, but interactivity is incomplete. This design enables a fully reactive cart powered by Alpine.js scopes per line item and Alpine-AJAX helpers for Shopify endpoints. The cart section becomes a self-contained component that reads the initial cart payload, performs `fetch`/`$ajax` updates against `/cart/change.js`, `/cart/update.js`, and `/cart.js`, and refreshes only `[data-cart-fragment]`. A shared fragment controller manages concurrency, loading states, focus management, and the sticky/mobile footer, preserving Shopify compatibility and the mobile-app UX target.

## Architecture

1. **Fragment Controller (cartFragment Alpine scope)**
   - Lives on the root element that wraps `[data-cart-fragment]` (e.g., `<section class="..." data-cart-fragment>`).
   - Holds canonical `cart` data, `isRefreshing`, `pendingRequests`, and helper methods (`refreshFragment`, `handleError`).
   - Coordinates refreshes by calling `$ajax.refresh('[data-cart-fragment]')` after any successful mutation.
   - Emits Alpine events (`cart:updated`, `cart:error`) so nested scopes can respond.

2. **Line Item Component (cartItem Alpine scope)**
   - Instantiated inside `snippets/cart-item-b.liquid` with per-line props (line id, quantity rules, URLs).
   - Manages local state: `quantity`, `isUpdating`, `error`.
   - Buttons call shared utility `queueChange(line, delta)` to serialize quantity requests and visually disable controls while in-flight.

3. **Footer/Sticky Card Component (cartFooter Alpine scope)**
   - Resides in `sections/main-cart-footer.liquid` and subscribes to `cart:updated` events.
   - Displays totals, discounts, notes, and handles note submission via `/cart/update.js`.

4. **Utility Module (optional `alpine-cart.js`)**
   - Defines `window.CartApi` helpers for calling Shopify AJAX endpoints with JSON bodies, centralizing fetch options and error normalization.
   - Provides a simple request queue/lock to avoid overlapping updates.

```mermaid
graph TD
  A[Cart UI Section data-cart-fragment] --> B[cartFragment Alpine scope]
  B -->|initializes| C[cartItem scopes]
  B -->|initializes| D[cartFooter scope]
  C -->|request change| E[CartApi.change(line, quantity)]
  D -->|note update| F[CartApi.update(note)]
  E -->|success| B
  F -->|success| B
  B -->|refresh| G[$ajax.refresh('[data-cart-fragment]')]
  G -->|HTML+Events| A
```

## Components and Interfaces

- **cartFragment (`x-data="cartFragment()"`)**
  - `state`: `{ cart: ShopifyCartJSON, isRefreshing: false, pendingRequests: 0, lastError: null }`
  - `refreshFragment(reason)` → triggers `$ajax.refresh` and reinitializes Alpine scopes once HTML replaces the fragment.
  - `queueRequest(promiseFactory)` → increments `pendingRequests`, awaits promise, handles errors, decrements counter.
  - `handleError(error)` → logs warning, sets `lastError`, emits `cart:error`.
  - After each `$ajax.refresh('[data-cart-fragment]')`, waits for `Alpine.nextTick()` before emitting `cart:updated` to ensure all scopes remount.

- **cartItem (`x-data="cartItem(linePayload)"`)**
  - Props from Liquid: `{ line, quantity, rules, max, min, increment, removeUrl }`
  - Methods:
    - `increase()` / `decrease()` call `changeQuantity(quantity ± increment)` with guard for min/max.
    - `changeQuantity(newQty)` uses `CartApi.change(line, newQty)` inside `cartFragment.queueRequest` and delegates to `remove()` when `newQty === 0`.
    - `onInputBlur()` validates manual entry (integer ≥ 1) or auto-removes on 0 per requirements.
    - `remove()` sends `CartApi.change(line, 0)`.
  - UI bindings:
    - `x-bind:disabled="isUpdating || !canUpdate"` on `+/-` buttons.
    - `x-bind:aria-busy="isUpdating"` on subtotal rows.
    - `x-show="error"` for inline messaging.

- **cartFooter (`x-data="cartFooter()"`)**
  - Tracks `note`, `discounts`, `totals`, `isStickyEnabled`.
  - Handles note submission via debounced `CartApi.update({ note })`.
  - Watches `window.addEventListener('cart:updated', ...)` to sync totals/prices.

- **CartApi Utility**
  - `change({ line, quantity })` → POST `/cart/change.js` with JSON body `{ "line": number, "quantity": number }`.
  - `update(payload)` → POST `/cart/update.js` for notes or attributes.
  - `fetchCart()` → GET `/cart.js` fallback when refresh fails.
  - Wraps `fetch` to include `credentials: 'same-origin'`, `headers: { 'Content-Type': 'application/json' }`.

## Data Models

- **LineItemState**
  - `lineId: number`
  - `quantity: number`
  - `increment: number`
  - `min: number`
  - `max: number | null`
  - `isUpdating: boolean`
  - `error: string | null`

- **CartState**
  - `items: LineItemState[]`
  - `totals: { subtotal: number, total: number, discounts: Discount[] }`
  - `note: string`
  - `currency: ShopifyMoneyFormat`
  - `fragmentSelector: '[data-cart-fragment]'`

- **Discount**
  - `title: string`
  - `value: string`
  - `scope: 'cart' | 'line'`

Data flows:
1. Liquid bootstraps initial `window.__CART__ = {{ cart | json }}` for Alpine hydration.
2. Each `cartItem` clones the relevant portion for local state but defers to `cartFragment` events for authoritative updates.
3. After any mutation, the refreshed HTML is re-rendered; Alpine's `x-init` hooks rehydrate states.

## Error Handling

- All CartApi promises reject with `{ message, status }`; `cartFragment.handleError` logs via `console.warn` and optionally displays a toast/inline alert.
- Quantity controls disable during `isUpdating` to prevent overlapping requests (Requirement 1.5).
- If `$ajax.refresh` fails, fallback to `CartApi.fetchCart()` to rebuild the fragment via a hidden template render and `innerHTML` replacement.
- Sticky footer listens for `cart:error` to show a compact error banner but keeps checkout button enabled unless cart truly empty.
- Network failures keep the current DOM while re-enabling controls for manual retry.
 - If Shopify returns HTTP 422 (quantity rule violation), the originating `cartItem` surfaces the rule message via its `error` state and re-enables controls for correction.

## Testing Strategy

1. **Unit-like Alpine tests (manual/Playwright)**
   - Simulate `increase/decrease` to confirm request sequencing and button disabling.
   - Validate manual quantity inputs, note persistence, and remove button behavior (Requirements 1–3).

2. **Fragment Refresh Regression**
   - Use Cypress/Playwright to assert that `[data-cart-fragment]` innerHTML changes without full page reload and Alpine scopes stay functional (Requirements 4 & 5).

3. **QA Checklist Automation**
   - Convert the provided checklist points into automated scripts where possible (e.g., `tests/cart-quantity.spec.js`, `tests/cart-remove.spec.js`).
   - Ensure totals/discounts update after every mutation and that the continue-shopping links remain intact.

4. **Error Scenarios**
   - Mock `/cart/change.js` failure responses to confirm `lastError` handling and UI messaging (Requirement 6).
   - Stress-test rapid clicks with throttled network to ensure debouncing/locking works.

5. **Responsive & Sticky Footer**
   - Use viewport-based tests to ensure sticky behavior on mobile and proper alignment on desktop, confirming no overlap with cart items.

This design satisfies all requirements by clearly separating concerns across Alpine scopes, centralizing AJAX coordination, and ensuring fragment refreshes remain scoped, resilient, and mobile-first.
