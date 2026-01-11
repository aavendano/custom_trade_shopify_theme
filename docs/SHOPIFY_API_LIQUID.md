# Shopify API with Liquid

This document provides an overview of accessing Shopify store data through Liquid templates. In Shopify themes, you don't directly call APIs - instead, you access data through Liquid objects and filters that are populated server-side.

## Overview

Liquid is Shopify's templating language that allows you to access store data without making API calls. The data is made available through Liquid objects like `product`, `collection`, `cart`, etc.

## Key Liquid Objects

### Product Data

```liquid
{{ product.title }}
<!-- Product title -->
{{ product.description }}
<!-- Product description -->
{{ product.price | money }}
<!-- Formatted price -->
{{ product.compare_at_price }}
<!-- Compare at price -->

<!-- Variant information -->
{{ product.selected_or_first_available_variant.sku }}
{{ product.selected_or_first_available_variant.inventory_quantity }}
{{ product.selected_or_first_available_variant.available }}

<!-- Product properties -->
{{ product.vendor }}
<!-- Product vendor -->
{{ product.product_type }}
<!-- Product type -->
{{ product.tags | join: ', ' }}
<!-- Product tags -->

<!-- Media -->
{% for image in product.images %}
  <img src="{{ image | image_url: width: 400 }}" alt="{{ image.alt }}">
{% endfor %}

<!-- Collections -->
{% for collection in product.collections %}
  <a href="{{ collection.url }}">{{ collection.title }}</a>
{% endfor %}
```

### Collection Data

```liquid
{{ collection.title }}
<!-- Collection title -->
{{ collection.description }}
<!-- Collection description -->
{{ collection.products_count }}
<!-- Number of products -->

<!-- Products in collection -->
{% for product in collection.products %}
  <div class="product">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% endfor %}
```

### Cart Data

```liquid
{{ cart.item_count }}
<!-- Number of items in cart -->
{{ cart.total_price | money }}
<!-- Cart total -->
{{ cart.taxes_included }}
<!-- Taxes included? -->

<!-- Cart items -->
{% for item in cart.items %}
  <div class="cart-item">
    <h4>{{ item.product.title }}</h4>
    <p>Quantity: {{ item.quantity }}</p>
    <p>Price: {{ item.line_price | money }}</p>
  </div>
{% endfor %}
```

### Shop Data

```liquid
{{ shop.name }}
<!-- Store name -->
{{ shop.domain }}
<!-- Store domain -->
{{ shop.currency }}
<!-- Store currency -->
{{ shop.timezone }}
<!-- Store timezone -->

<!-- Policies -->
{{ shop.shipping_policy.body }}
{{ shop.refund_policy.body }}
{{ shop.privacy_policy.body }}
```

## Liquid Filters

### Money and Currency

```liquid
{{ product.price | money }}
<!-- $19.99 -->
{{ product.price | money_with_currency }}
<!-- $19.99 USD -->
{{ product.price | money_without_currency }}
<!-- 19.99 -->
```

### Text Manipulation

```liquid
{{ product.title | escape }}
<!-- HTML escape -->
{{ product.title | upcase }}
<!-- UPPERCASE -->
{{ product.title | downcase }}
<!-- lowercase -->
{{ product.title | capitalize }}
<!-- Capitalize -->
{{ 'Hello World' | split: ' ' }}
<!-- Split string -->
{{ product.tags | join: ', ' }}
<!-- Join array -->
```

### Date and Time

```liquid
{{ article.published_at | date: '%B %d, %Y' }}
<!-- January 15, 2024 -->
{{ 'now' | date: '%Y' }}
<!-- Current year -->
```

### Math Operations

```liquid
{{ product.price | times: 1.1 }}
<!-- Add 10% -->
{{ product.price | divided_by: 100 }}
<!-- Convert cents to dollars -->
{{ product.price | plus: 5 }}
<!-- Add $5.00 -->
{{ product.price | minus: 2 }}
<!-- Subtract $2.00 -->
```

### Array and Object Filters

```liquid
{{ product.images | first | image_url }}
<!-- First image URL -->
{{ product.variants | size }}
<!-- Number of variants -->
{{ product.tags | sort | join: ', ' }}
<!-- Sorted tags -->
{{ collection.products | where: 'available' }}
<!-- Available products only -->
```

## Control Flow

### Conditionals

```liquid
{% if product.available %}
  <p>In stock</p>
{% else %}
  <p>Out of stock</p>
{% endif %}

{% if product.price < 100 %}
  <span class="sale">Under $100!</span>
{% endif %}

{% unless product.has_only_default_variant %}
  <!-- Show variant picker -->
{% endunless %}
```

### Loops

```liquid
{% for variant in product.variants %}
  <option value="{{ variant.id }}">{{ variant.title }}</option>
{% endfor %}

{% for image in product.images limit: 3 %}
  <img src="{{ image | image_url: width: 300 }}" alt="{{ image.alt }}">
{% endfor %}

{% for tag in product.tags %}
  <span class="tag">{{ tag }}</span>
{% endfor %}
```

### Case Statements

```liquid
{% case product.type %}
  {% when 'physical' %}
    <p>Ships to you</p>
  {% when 'digital' %}
    <p>Instant download</p>
  {% when 'service' %}
    <p>Book a session</p>
{% endcase %}
```

## Metafields

Access custom data stored in metafields:

```liquid
{{ product.metafields.custom.material }}
{{ product.metafields.seo.title }}
{{ product.metafields.reviews.rating.value }}
```

## Forms and User Input

### Product Forms

```liquid
{% form 'product', product %}
  <input
    type="hidden"
    name="id"
    value="{{ product.selected_or_first_available_variant.id }}"
  >
  <button type="submit">Add to Cart</button>
{% endform %}
```

### Search Forms

```liquid
{% form 'search', routes.search_url %}
  <input type="search" name="q" placeholder="Search products...">
  <button type="submit">Search</button>
{% endform %}
```

## Pagination

```liquid
{% paginate collection.products by 24 %}
  {% for product in collection.products %}
    <!-- Product display -->
  {% endfor %}

  {% if paginate.pages > 1 %}
    <div class="pagination">
      {% if paginate.previous %}
        <a href="{{ paginate.previous.url }}">Previous</a>
      {% endif %}

      {% for page in paginate.parts %}
        {% if page.is_link %}
          <a href="{{ page.url }}">{{ page.title }}</a>
        {% elsif page.title == paginate.current_page %}
          <span class="current">{{ page.title }}</span>
        {% endif %}
      {% endfor %}

      {% if paginate.next %}
        <a href="{{ paginate.next.url }}">Next</a>
      {% endif %}
    </div>
  {% endif %}
{% endpaginate %}
```

## Translations

```liquid
{{ 'products.product.add_to_cart' | t }}
<!-- Translated text -->
{{ 'cart.general.item_count' | t: count: 5 }}
<!-- With variables -->
```

## Settings and Theme Customization

```liquid
{{ settings.logo | image_url: width: 200 }}
{{ settings.primary_color }}
{{ section.settings.show_price }}

{% style %}
  .custom-section {
    background-color: {{ section.settings.background_color }};
    padding: {{ section.settings.padding }}px;
  }
{% endstyle %}
```

## Common Patterns

### Product Card Component

```liquid
<div class="product-card">
  <a href="{{ product.url }}">
    <img
      src="{{ product.featured_image | image_url: width: 300 }}"
      alt="{{ product.title }}"
    >
  </a>
  <h3>
    <a href="{{ product.url }}">{{ product.title }}</a>
  </h3>
  <p class="price">
    {% if product.compare_at_price > product.price %}
      <span class="sale-price">{{ product.price | money }}</span>
      <span class="original-price">{{ product.compare_at_price | money }}</span>
    {% else %}
      <span class="regular-price">{{ product.price | money }}</span>
    {% endif %}
  </p>
  {% if product.available %}
    <button>Add to Cart</button>
  {% else %}
    <span>Sold Out</span>
  {% endif %}
</div>
```

### Breadcrumb Navigation

```liquid
<nav class="breadcrumb">
  <a href="/">Home</a>
  {% if collection %}
    <span>/</span>
    <a href="{{ collection.url }}">{{ collection.title }}</a>
  {% endif %}
  {% if product %}
    <span>/</span>
    <span>{{ product.title }}</span>
  {% endif %}
</nav>
```

## Best Practices

1. **Use appropriate filters**: Always use `| money` for prices, `| escape` for user content
2. **Check for nil values**: Use `{% if variable %}` or `{% unless variable == blank %}`
3. **Limit loops**: Use `limit` parameter to prevent performance issues
4. **Cache expensive operations**: Avoid complex calculations in loops
5. **Use semantic HTML**: Proper structure for accessibility
6. **Handle edge cases**: Consider products without images, variants, etc.

## Resources

- [Shopify Liquid Reference](https://shopify.dev/docs/themes/liquid/reference)
- [Liquid Cheat Sheet](https://www.shopify.com/partners/shopify-cheat-sheet)
- [Theme Development Documentation](https://shopify.dev/docs/themes)
- [Liquid Objects Reference](https://shopify.dev/docs/themes/liquid/reference/objects)

## Next Steps

1. Explore the existing theme files to see Liquid in action
2. Create custom sections using Liquid
3. Learn about metafields for custom data
4. Study theme settings and customization
5. Practice with different Liquid objects and filters

Remember: Liquid templates are rendered server-side, so all data is available without API calls. Focus on presentation logic rather than data fetching.
