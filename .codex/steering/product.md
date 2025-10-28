# Product Guidance

- Understand this repo houses the custom Shopify Online Store 2.0 theme for PlayLoveToys, focused on fast-loading ecommerce product merchandising.
- Preserve the storefront experience: keep Bulma-styled (`b-` prefixed) components, Alpine.js interactions, and TwicPics-driven media delivery functional across all templates.
- Maintain business rules: honor metafield-driven FAQs (see `sections/faq.liquid` and `layout/theme.liquid` JSON-LD blocks), respect localization snippets, and ensure cart/checkout flows in `assets/cart.js` and `snippets/cart-drawer.liquid` remain intact.
- Prioritize Core Web Vitals improvements without breaking merchandising widgets (mega menu, quick add, predictive search) or partner integrations like Plausible analytics configured in `layout/theme.liquid`.
