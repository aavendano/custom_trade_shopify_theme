# shopify-media

Accepts a reference to an [Image](https://shopify.dev/docs/api/storefront/latest/objects/Image) or [Media](https://shopify.dev/docs/api/storefront/latest/interfaces/Media) reference and generates an image or video element with `srcset` and `sizes` attributes. This component must be a child of a `shopify-context` component. It takes a query attribute that defines the context it's a part of, and the field to query. 

If you want the media to automatically change based on which variant is selected on the [variant-selector component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-variant-selector), make sure to reference the product image on the `product.selectedOrFirstAvailableVariant.image` field.

See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.

> Note:
> When rendering an image, the media component uses the [`unpic-img`](https://unpic.pics/img/lit/) element internally, so you can also pass `height`, `width`, `layout`, `aspect-ratio`, `priority`, `breakpoints`, and `sizes` attributes to control the scale and size of the image. Learn more about image props in the [Unpic documentation](https://unpic.pics/img/lit/#image-props).

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
      <!-- Query the featured image of the product.
        Renders an image element  -->
      <shopify-media
        width="200"
        height="300"
        query="product.featuredImage"
      ></shopify-media>
    </h1>
  </template>
</shopify-context>
```

## Attributes

### MediaAttributes

### aspectRatio

value: `number`

Instead of providing a width and height, you can provide an aspect ratio. This is passed to the [\`aspectRatio\`](https://unpic.pics/img/webc/#aspect-ratio) attribute of an underlying \`unpic-img\` element.

### breakpoints

value: `string`

The breakpoints of the image. This is passed to the [breakpoints](https://unpic.pics/img/webc/#breakpoints) attribute of an underlying \`unpic-img\` element.

### height

value: `number`

The height of the image. Required, unless width is provided with an aspectRatio.

### layout

value: `"fixed" | "constrained" | "fullWidth"`

The resizing behavior of the image. This is passed to the [layout](https://unpic.pics/img/webc/#layout) attribute of an underlying \`unpic-img\` element.

### priority

value: `boolean`

Whether to prioritize the image. This is passed to the [priority](https://unpic.pics/img/webc/#priority) attribute of an underlying \`unpic-img\` element.

### query

value: `string`

Defines the context to reference and field to query. For example, `query="product.featuredImage"` queries the title of the product featured image, and `query="product.selectedOrFirstAvailableVariant.image"` queries the image of a specific product variant based on the `shopify-variant-selector` component.

### role

value: `string | null`

The accessibility role of the image. This is set automatically by the media component, but you can override it if needed.

### sizes

value: `string`

The sizes of the image. This is set automatically by the media component, but you can override it if needed.

### video-autoplay

value: `boolean`

Used for video media. By default, videos [autoplay](https://developer.mozilla.org/docs/Web/HTML/Element/video#autoplay). To disable autoplay, set to `video-autoplay="false"`.

### video-controls

value: `boolean`

Used for video media. By default, [video controls](https://developer.mozilla.org/docs/Web/HTML/Element/video#controls) are shown. To disable them, set to `video-controls="false"`.

### video-loop

value: `boolean`

Used for video media. By default, videos [loop](https://developer.mozilla.org//docs/Web/HTML/Element/video#loop). To disable looping, set to `video-loop="false"`.

### video-muted

value: `boolean`

Used for video media. By default, videos are [muted](https://developer.mozilla.org/docs/Web/HTML/Element/video#muted). To enable audio, set to `video-muted="false"`.

### video-playsinline

value: `boolean`

Used for video media. By default, videos [play inline](https://developer.mozilla.org/docs/Web/HTML/Element/video#playsinline). To disable inline playback, set to `video-playsinline="false"`.

### width

value: `number`

The width of the image. Required, unless height is provided with an aspectRatio.

