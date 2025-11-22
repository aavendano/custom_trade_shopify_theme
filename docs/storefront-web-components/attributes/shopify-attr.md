# shopify-attr

Use the `shopify-attr` attribute to bind an attribute to data from Shopify. Anywhere within the template of a [shopify-context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context), you can use the `shopify-attr--attribute-name` attribute to bind an attribute to data from Shopify. For example, `shopify-attr--href="product.onlineStoreUrl"` can be used to bind the `href` attribute to the `onlineStoreUrl` field on a product context.

See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.

```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
  country="CA"
  language="FR"
>
</shopify-store>
<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- the href attribute is bound to the
      product.onlineStoreUrl field -->
    <a shopify-attr--href="product.onlineStoreUrl">
      View product
    </a>
  </template>
</shopify-context>
```

