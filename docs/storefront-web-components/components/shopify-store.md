# shopify-store

Use the `<shopify-store>` component to set up your credentials and market configuration for a storefront. You can optionally add a public access token, which gives you access to your store's inventory, metafields, and metaobjects. You can get a public access token by [adding the Headless channel](https://shopify.dev/docs/api/storefront-web-components/getting-started#connect-your-store) in your Shopify admin.
    
See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.

```html
<!-- Optionally define market configuration, which defaults
 to US/EN. The public-access-token attribute is optional,
 and only necessary to access inventory, metafields,
 and metaobjects.
-->
<shopify-store
  store-domain="https://your-store.myshopify.com"
  public-access-token="optional-access-token"
  country="CA"
  language="FR"
>
</shopify-store>

<!-- The context is bound to the store -->
<shopify-context
  type="product"
  handle="handle-of-product"
>
  <template> ... </template>
</shopify-context>

<!-- If you want to display products from multiple
  storefronts on the same page, nest contexts inside
  multiple store components-->
<shopify-store
  store-domain="https://your-other-store.myshopify.com"
  country="CA"
  language="FR"
>
  <shopify-context
    type="product"
    handle="handle-of-product"
  >
    <template> ... </template>
  </shopify-context>
</shopify-store>
```

## Attributes

### StoreAttributes

### buyNow

value: `(e: Event, options?: BuyNowOptions) => void`

  - BuyNowOptions: interface BuyNowOptions {
  discountCodes?: string[];
  target?: Target;
}
A method to open the checkout page with a selected product.

### country

value: `CountryCode`

The country of the store.

### language

value: `LanguageCode`

The language of the store.

### public-access-token

value: `string`

The public access token from the [Headless channel](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/manage-headless-channels) for the store. This attribute is required if you want to access product inventory count, metafields, or metaobjects.

### store-domain

value: `string`

The myshopify.com domain of the store.

### BuyNowOptions

### discountCodes

value: `string[]`


### target

value: `Target`

  - Target: "_blank" | "_self" | "_parent" | "_top" | "_unfencedTop"

