# shopify-variant-selector

Use the `<shopify-variant-selector>` component to display a form for selecting product options. The variant selector must be a child of a product context. Any data, money, or media component that references `selectedOrFirstAvailableVariant` will automatically update when a variant is selected.

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
    <shopify-variant-selector></shopify-variant-selector>

    <!-- Fields on `selectedOrFirstAvailableVariant`
     automatically update when a variant is selected -->
    <shopify-money
      query="product.selectedOrFirstAvailableVariant.price"
    ></shopify-money>

    <shopify-media
      query="product.selectedOrFirstAvailableVariant.image"
      width="200"
      height="200"
    ></shopify-media>
  </template>
</shopify-context>

```

## Attributes

### VariantSelectorAttributes

### visible-option

value: `string`

Only show a single option. Default all options are visible. This allows you to have multiple variant selectors, each rendering a single option, and arrange them as you like.

Additionally, when calling `context.update(event)`, the selected options in the current context will be applied to the variant selector in the destination context. This allows you to have a card with only one option visible, and a modal where all options are visible, and the selected options in the card will be applied to the modal.

## Examples

Use the `<shopify-variant-selector>` component to display a form for selecting product options. The variant selector must be a child of a product context. Any data, money, or media component that references `selectedOrFirstAvailableVariant` will automatically update when a variant is selected.

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
    <shopify-variant-selector>
    </shopify-variant-selector>
  </template>
</shopify-context>

<style>
  shopify-variant-selector::part(form) {
    /** Change the layout of the variant selector */
    flex-direction: row;
    gap: 10px;
  }

  shopify-variant-selector::part(label) {
    /** Change the label of the variant selector */
    font-weight: bold;
  }
</style>

```

## CSS Parts

### VariantSelectorParts

### color-swatch

value: `CSSPart`

  - CSSPart: string
The color swatch element.

### color-swatch-disabled

value: `CSSPart`

  - CSSPart: string
A part for the color swatch it is unavailable for sale.

### color-swatch-label

value: `CSSPart`

  - CSSPart: string
The color swatch label element.

### color-swatch-selected

value: `CSSPart`

  - CSSPart: string
A part for the color swatch when it is selected.

### form

value: `CSSPart`

  - CSSPart: string
The form element. This element has a flex layout, so targeting the form element allows you to control the layout of the variant selector.

### label

value: `CSSPart`

  - CSSPart: string
The label element for each option group.

### radio

value: `CSSPart`

  - CSSPart: string
The radio option element.

### radio-disabled

value: `CSSPart`

  - CSSPart: string
A part for the radio option when it is unavailable for sale.

### radio-selected

value: `CSSPart`

  - CSSPart: string
The radio selected element.

### select

value: `CSSPart`

  - CSSPart: string
The select element.

## Examples

Use the `<shopify-variant-selector>` component to display a form for selecting product options. The variant selector must be a child of a product context. Any data, money, or media component that references `selectedOrFirstAvailableVariant` will automatically update when a variant is selected.

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
    <shopify-variant-selector>
    </shopify-variant-selector>
  </template>
</shopify-context>

<style>
  shopify-variant-selector::part(form) {
    /** Change the layout of the variant selector */
    flex-direction: row;
    gap: 10px;
  }

  shopify-variant-selector::part(label) {
    /** Change the label of the variant selector */
    font-weight: bold;
  }
</style>

```

## Examples

Use the `<shopify-variant-selector>` component to display a form for selecting product options. The variant selector must be a child of a product context. Any data, money, or media component that references `selectedOrFirstAvailableVariant` will automatically update when a variant is selected.

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
    <shopify-variant-selector>
    </shopify-variant-selector>
  </template>
</shopify-context>

<style>
  shopify-variant-selector::part(form) {
    /** Change the layout of the variant selector */
    flex-direction: row;
    gap: 10px;
  }

  shopify-variant-selector::part(label) {
    /** Change the label of the variant selector */
    font-weight: bold;
  }
</style>

```

