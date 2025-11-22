# shopify-money

Accepts query a reference to a [Money object](https://shopify.dev/docs/api/storefront/2024-04/objects/MoneyV2), and uses the store's country and language market to format it correctly. This component must be a child of a [`shopify-context`](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) component. The component takes a query attribute that defines the context it's a part of, and the field to query. This component produces a text node with the formatted price.

Usually you want a product price to update based on the selected variant, so make sure to reference the `product.selectedOrFirstAvailableVariant.price` field if you are using the [shopify-variant-selector](https://shopify.dev/docs/api/storefront-web-components/components/shopify-variant-selector) component.

See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.

```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- The context is bound to the store -->
<shopify-context
  type="product"
  handle="handle-of-product"
>
  <template>
    <h1>
<!-- Query the selected or first available variant's
price. Renders a text node with the formatted price. -->
      <shopify-money
        format="money_with_currency"
        query="product.selectedOrFirstAvailableVariant.price"
      ></shopify-money>
    </h1>
  </template>
</shopify-context>
```

## Attributes

### MoneyAttributes

### format

value: `Format`

  - Format: "money" | "money_without_currency" | "money_with_currency"
The format of the price. Defaults to `money`.

### query

value: `string`

Defines the context to reference and field to query. For example `query="product.title"` would query the title of the product context.

