# Megamenu issue analysis

## Observations
- The live header for the theme comes from the `aa-header` section configured in `sections/header-group.json`. This section renders a Bulma-based navbar instead of the Dawn-style header that uses the `header-mega-menu` snippet.
- Inside `sections/aa-header.liquid`, menu items with children are rendered as simple Bulma dropdowns (`div.b-navbar-item.b-has-dropdown`) that only output second-level links. There is no `header-menu` custom element, no `details`/`summary` structure, and none of the `mega-menu` classes that Shopify's megamenu CSS and JavaScript target.
- The Dawn megamenu implementation exists in `snippets/header-mega-menu.liquid` and is supported by the `details-disclosure.js` web component and `component-mega-menu.css`, but that snippet is never rendered by the Bulma header.

## Why the megamenu does not work
Because the active header section does not render the megamenu markup or initialize the supporting web component, the megamenu styles and behaviors never apply. As a result, menu items only show a basic dropdown and any deeper navigation structure cannot be displayed in the intended multi-column megamenu layout.

## Plan to fix
1. Update `aa-header` to support a megamenu option (e.g., via a section setting) or switch the header to render the existing `header-mega-menu` snippet for desktop layouts while keeping the Bulma styling wrapper.
2. When rendering megamenu items, use the Dawn markup (`<header-menu><details class="mega-menu">…`) so `details-disclosure.js` can manage open/close behavior and `component-mega-menu.css` can style the grid layout.
3. Ensure the megamenu CSS and JavaScript assets (`component-mega-menu.css`, `details-disclosure.js`) are loaded for the header experience; add explicit includes if the Bulma header bypasses Dawn's default asset pipeline.
4. Validate in both desktop and mobile breakpoints that dropdowns and megamenu layouts open and close correctly, including keyboard focus and hover interactions. Adjust Bulma overrides as needed to avoid conflicts with the Dawn classes.
