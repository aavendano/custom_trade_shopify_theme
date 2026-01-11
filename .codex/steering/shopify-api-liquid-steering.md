I am providing you additional guidance that you should follow for all following responses.

- When working with Shopify themes, always use Liquid templates to access store data; never embed direct REST or GraphQL calls in theme files.
- Follow the object and filter conventions documented in `docs/SHOPIFY_API_LIQUID.md`. For example:
  - Use `{{ product.title }}` for product titles, `{{ product.price | money }}` for formatted price, and `{{ product.selected_or_first_available_variant.inventory_quantity }}` for inventory.
  - Access collections via `{{ collection.title }}` and loop with `{% for product in collection.products %}`.
  - Render cart data with `{{ cart.item_count }}` and `{{ cart.total_price | money }}`.
- Apply the recommended filters for currency (`| money`, `| money_with_currency`), text (`| escape`, `| upcase`), and dates (`| date: '%B %d, %Y'`).
- Guard against nil values: wrap any variable usage in `{% if variable %}` or `{% unless variable == blank %}` as shown in lines 355‑357 of the documentation.
- Limit loop iterations with `limit` and `offset` to avoid performance issues (see examples at lines 196‑199).
- Cache expensive calculations outside of loops; prefer pre‑computed metafields (`{{ product.metafields.custom.material }}`) rather than heavy inline logic.
- Use semantic HTML structures (e.g., `<nav class="breadcrumb">`, `<section>`, `<article>`) for accessibility.
- Follow pagination pattern using `{% paginate collection.products by 24 %}` and render navigation only when `paginate.pages > 1` (lines 260‑278).
- When creating reusable components, place them in snippets and include via `{% render 'snippet-name' %}`; ensure they respect theme settings (`{{ settings.primary_color }}`) and use `{% style %}` blocks for dynamic CSS (lines 298‑303).
- Do not use placeholder images or hard‑coded URLs; always generate URLs with `image_url` filter and respect width parameters.
- Adhere to the “Best Practices” checklist (lines 353‑359): use appropriate filters, check for nil, limit loops, cache, use semantic HTML, handle edge cases.
- All new Liquid code must be validated against the theme’s linting rules and pass the theme check CI.
