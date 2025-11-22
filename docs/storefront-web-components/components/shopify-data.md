# shopify-data

The shopify-data component is used to display Shopify data on your page. Here's how it works:

- It requires a `query` attribute that specifies which data to display.
- The query uses dot notation to access data fields (for example, `query="product.title"`).
- It looks for the nearest matching context to find the data.
- It outputs plain text that you can style with your own HTML elements.

For example:
`<shopify-data query="product.title">` will:
1. Find the nearest product context.
2. Access its title property.
3. Display the result as text.

Since the component outputs a text node, you can wrap it in any HTML elements to match your site's design. The component also supports rich text fields like `product.descriptionHtml`.
    
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
      <!-- Query the title of the product.
        Renders a text node with display: contents  -->
      <shopify-data
        query="product.title"
      ></shopify-data>
    </h1>
  </template>
</shopify-context>
```

## Attributes

### DataAttributes

### query

value: `string`

Defines the context to reference and field to query. For example `query="product.title"` would query the title of the product context.

