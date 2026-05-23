# shopify-cart

The cart component provides a mini shopping cart functionality for your website. Here's how it works:

1. Add a `button` component inside a [shopify-context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) that's associated with a product.
2. Call the `addLine()` method in the `button` component's `onclick` attribute to add the product to the customer's cart.
    - This method requires an event object or a product data object.
    - If using an event, the event target must be inside a product [context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context).

3. Display the cart using a native [HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).
    - To show it as a popup modal, call the `showModal()` method.

4. Apply discount codes automatically using the `discountCodes` attribute.
    - Pass a comma-separated list of discount codes that will be automatically applied to the cart.

5. Customize the cart's styling and content with CSS parts and slots. [View examples](https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart#examples)

> Note:
> The cart component doesn't support mixing products from multiple stores.

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
  <!-- The product added will be whatever
  variant is selected for the context product handle -->
  <button
    onclick="getElementById('cart').addLine(event).showModal();"
  >
    Add to cart
  </button>
</template>
</shopify-context>

<shopify-cart id="cart"></shopify-cart>

```

## Attributes and properties

### CartAttributes

### addLine

value: `(source: CartLineSource) => CartAttributes`

  - CartAttributes: interface CartAttributes {
  /** The [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target) for the checkout link. Defaults to "_top". */
  target?: string;

  /**
   * A property to get the open state of the cart.
   *
   * Example: `getElementById('cart').open`
   */
  open?: boolean;

  /**
   * A method to add an item to the cart. The source can either be an event triggered from an element within a product context or a product object with a variant id.
   */
  addLine?: (source: CartLineSource) => CartAttributes;

  /**
   * A method to display the underlying [cart as a modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) in a `dialog` element.
   */
  showModal?: () => CartAttributes;

  /**
   * A method to display the cart as a modal in a [`dialog` element modelessly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).
   */
  show?: () => CartAttributes;

  /**
   * A method to close the cart dialog.
   */
  close?: () => CartAttributes;
}
  - CartLineSource: EventWithinProductContext | ProductToAddToCart
A method to add an item to the cart. The source can either be an event triggered from an element within a product context or a product object with a variant id.

### close

value: `() => CartAttributes`

  - CartAttributes: interface CartAttributes {
  /** The [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target) for the checkout link. Defaults to "_top". */
  target?: string;

  /**
   * A property to get the open state of the cart.
   *
   * Example: `getElementById('cart').open`
   */
  open?: boolean;

  /**
   * A method to add an item to the cart. The source can either be an event triggered from an element within a product context or a product object with a variant id.
   */
  addLine?: (source: CartLineSource) => CartAttributes;

  /**
   * A method to display the underlying [cart as a modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) in a `dialog` element.
   */
  showModal?: () => CartAttributes;

  /**
   * A method to display the cart as a modal in a [`dialog` element modelessly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).
   */
  show?: () => CartAttributes;

  /**
   * A method to close the cart dialog.
   */
  close?: () => CartAttributes;
}
A method to close the cart dialog.

### open

value: `boolean`

A property to get the open state of the cart.

Example: `getElementById('cart').open`

### show

value: `() => CartAttributes`

  - CartAttributes: interface CartAttributes {
  /** The [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target) for the checkout link. Defaults to "_top". */
  target?: string;

  /**
   * A property to get the open state of the cart.
   *
   * Example: `getElementById('cart').open`
   */
  open?: boolean;

  /**
   * A method to add an item to the cart. The source can either be an event triggered from an element within a product context or a product object with a variant id.
   */
  addLine?: (source: CartLineSource) => CartAttributes;

  /**
   * A method to display the underlying [cart as a modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) in a `dialog` element.
   */
  showModal?: () => CartAttributes;

  /**
   * A method to display the cart as a modal in a [`dialog` element modelessly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).
   */
  show?: () => CartAttributes;

  /**
   * A method to close the cart dialog.
   */
  close?: () => CartAttributes;
}
A method to display the cart as a modal in a [`dialog` element modelessly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).

### showModal

value: `() => CartAttributes`

  - CartAttributes: interface CartAttributes {
  /** The [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target) for the checkout link. Defaults to "_top". */
  target?: string;

  /**
   * A property to get the open state of the cart.
   *
   * Example: `getElementById('cart').open`
   */
  open?: boolean;

  /**
   * A method to add an item to the cart. The source can either be an event triggered from an element within a product context or a product object with a variant id.
   */
  addLine?: (source: CartLineSource) => CartAttributes;

  /**
   * A method to display the underlying [cart as a modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) in a `dialog` element.
   */
  showModal?: () => CartAttributes;

  /**
   * A method to display the cart as a modal in a [`dialog` element modelessly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).
   */
  show?: () => CartAttributes;

  /**
   * A method to close the cart dialog.
   */
  close?: () => CartAttributes;
}
A method to display the underlying [cart as a modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) in a `dialog` element.

### target

value: `string`

The [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target) for the checkout link. Defaults to "_top".

### EventWithinProductContext

An event triggered from an element within a product context. The selected product is calculated from the event target by looking for the closest product context upward in the DOM. It automatically uses whatever variant is selected by any `<shopify-variant-selector>` in the product context.

### target

value: `HTMLElement`


### ProductToAddToCart

A product to add to the cart.

### quantity

value: `number`

The quantity of the product to add to the cart.

### sellingPlanId

value: `string`

The selling plan ID of the product to add to the cart. Only use for selling subscriptions.

### variantId

value: `string`

The variant ID of the product to add to the cart.

## Examples

The cart component provides a mini shopping cart functionality for your website. Here's how it works:

1. Add a `button` component inside a [shopify-context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) that's associated with a product.
2. Call the `addLine()` method in the `button` component's `onclick` attribute to add the product to the customer's cart.
    - This method requires an event object or a product data object.
    - If using an event, the event target must be inside a product [context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context).

3. Display the cart using a native [HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).
    - To show it as a popup modal, call the `showModal()` method.

4. Apply discount codes automatically using the `discountCodes` attribute.
    - Pass a comma-separated list of discount codes that will be automatically applied to the cart.

5. Customize the cart's styling and content with CSS parts and slots. [View examples](https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart#examples)

> Note:
> The cart component doesn't support mixing products from multiple stores.

Add `<div>` tags with `slot` attributes to show custom content on the empty state and checkout button. Add a `<style>` tag to include CSS parts that change the default styling of the cart's dialog, primary buttons, and secondary buttons.```html
<shopify-cart>
  <!-- Override the empty state with translated text -->
  <div slot="empty">
    Ihr Warenkorb ist leer
  </div>
  <!-- Override the checkout button with translated text -->
  <div slot="checkout-button">
    Zur Kasse
  </div>
  <!-- Override the apply discount button with translated text -->
  <div slot="apply-discount-button">
    Anwenden
  </div>
  <!-- Override the discounts section title with translated text -->
  <div slot="discounts-title">
    Rabatte
  </div>

  <!-- Override the discount apply error message with translated text -->
  <div slot="discount-apply-error">
    Dieser Rabattcode kann nicht angewendet werden.
  </div>
</shopify-cart>

<style>
  shopify-cart::part(dialog) {
    border-radius: 0.5rem;
  }
  shopify-cart::part(primary-button) {
    background-color: #627059;
    border: 0;
    border-radius: 0;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
  }
  shopify-cart::part(secondary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(tertiary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(discount-code) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
</style>

```

Add a product to the cart without a product context. This is useful if you already have a product GID.```html
<shopify-store
  store-domain="hydrogen-preview.myshopify.com"
>
</shopify-store>

<shopify-cart id="cart"></shopify-cart>

<button onclick="addToCart()">Add to cart</button>

<script>
  function addToCart() {
    const product = {
      variantId:
        "gid://shopify/ProductVariant/46565423349816",
      quantity: 1,
      // Optionally pass a sellingPlanId for subscriptions
      sellingPlanId:
        "gid://shopify/SellingPlan/8448376888",
    };

    document
      .getElementById("cart")
      // Manually add any product variant to the cart
      .addLine(product)
      .showModal();
  }
</script>

```

Automatically apply discount codes to the cart by setting the `discount-codes` attribute. The discount codes will be applied whenever items are added, removed, or updated in the cart.```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- Product context for adding items to cart -->
<shopify-context type="product" handle="handle-of-product">
  <template>
    <h3><shopify-data query="product.title"></shopify-data></h3>
    <p>Price: <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></p>
    
    <button 
      onclick="getElementById('cart').addLine(event); getElementById('cart').show();"
      shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"
    >
      Add to cart
    </button>
  </template>
</shopify-context>

<!-- Cart with automatic discount codes -->
<shopify-cart 
  id="cart" 
  discount-codes="SAVE20,FREE-SHIPPING,WELCOME10">
</shopify-cart>
```

## CSS parts

CSS parts allow you to target and override the default styling within the cart component.

### CartParts

### dialog

value: `CSSPart`

  - CSSPart: string
The dialog element.

### discount-code

value: `CSSPart`

  - CSSPart: string
Discount code label.

### discount-error

value: `CSSPart`

  - CSSPart: string
Discount error message.

### input-field

value: `CSSPart`

  - CSSPart: string
Input field. Used to style the input field that applies a discount code.

### line-heading

value: `CSSPart`

  - CSSPart: string
The cart line-item title element.

### line-image

value: `CSSPart`

  - CSSPart: string
The cart line-item image element.

### line-options

value: `CSSPart`

  - CSSPart: string
The cart line-item options element.

### line-price

value: `CSSPart`

  - CSSPart: string
The cart line-item quantity element.

### primary-button

value: `CSSPart`

  - CSSPart: string
The primary button element. Used to style the checkout link.

### secondary-button

value: `CSSPart`

  - CSSPart: string
The secondary button element. Used to style the buttons that modify a cart-line item.

### tertiary-button

value: `CSSPart`

  - CSSPart: string
The tertiary button element. Used to style the button that applies a discount code.

## Examples

The cart component provides a mini shopping cart functionality for your website. Here's how it works:

1. Add a `button` component inside a [shopify-context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) that's associated with a product.
2. Call the `addLine()` method in the `button` component's `onclick` attribute to add the product to the customer's cart.
    - This method requires an event object or a product data object.
    - If using an event, the event target must be inside a product [context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context).

3. Display the cart using a native [HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).
    - To show it as a popup modal, call the `showModal()` method.

4. Apply discount codes automatically using the `discountCodes` attribute.
    - Pass a comma-separated list of discount codes that will be automatically applied to the cart.

5. Customize the cart's styling and content with CSS parts and slots. [View examples](https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart#examples)

> Note:
> The cart component doesn't support mixing products from multiple stores.

Add `<div>` tags with `slot` attributes to show custom content on the empty state and checkout button. Add a `<style>` tag to include CSS parts that change the default styling of the cart's dialog, primary buttons, and secondary buttons.```html
<shopify-cart>
  <!-- Override the empty state with translated text -->
  <div slot="empty">
    Ihr Warenkorb ist leer
  </div>
  <!-- Override the checkout button with translated text -->
  <div slot="checkout-button">
    Zur Kasse
  </div>
  <!-- Override the apply discount button with translated text -->
  <div slot="apply-discount-button">
    Anwenden
  </div>
  <!-- Override the discounts section title with translated text -->
  <div slot="discounts-title">
    Rabatte
  </div>

  <!-- Override the discount apply error message with translated text -->
  <div slot="discount-apply-error">
    Dieser Rabattcode kann nicht angewendet werden.
  </div>
</shopify-cart>

<style>
  shopify-cart::part(dialog) {
    border-radius: 0.5rem;
  }
  shopify-cart::part(primary-button) {
    background-color: #627059;
    border: 0;
    border-radius: 0;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
  }
  shopify-cart::part(secondary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(tertiary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(discount-code) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
</style>

```

Add a product to the cart without a product context. This is useful if you already have a product GID.```html
<shopify-store
  store-domain="hydrogen-preview.myshopify.com"
>
</shopify-store>

<shopify-cart id="cart"></shopify-cart>

<button onclick="addToCart()">Add to cart</button>

<script>
  function addToCart() {
    const product = {
      variantId:
        "gid://shopify/ProductVariant/46565423349816",
      quantity: 1,
      // Optionally pass a sellingPlanId for subscriptions
      sellingPlanId:
        "gid://shopify/SellingPlan/8448376888",
    };

    document
      .getElementById("cart")
      // Manually add any product variant to the cart
      .addLine(product)
      .showModal();
  }
</script>

```

Automatically apply discount codes to the cart by setting the `discount-codes` attribute. The discount codes will be applied whenever items are added, removed, or updated in the cart.```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- Product context for adding items to cart -->
<shopify-context type="product" handle="handle-of-product">
  <template>
    <h3><shopify-data query="product.title"></shopify-data></h3>
    <p>Price: <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></p>
    
    <button 
      onclick="getElementById('cart').addLine(event); getElementById('cart').show();"
      shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"
    >
      Add to cart
    </button>
  </template>
</shopify-context>

<!-- Cart with automatic discount codes -->
<shopify-cart 
  id="cart" 
  discount-codes="SAVE20,FREE-SHIPPING,WELCOME10">
</shopify-cart>
```

## Slots

Slots allow you to override the default content of the cart component.

### CartSlots

### apply-discount-button

value: `SlotElement`

  - SlotElement: string
The content to display in the apply discount button. Useful to add a custom apply discount button text.

### checkout-button

value: `SlotElement`

  - SlotElement: string
The content to display in the checkout button. Useful to add a custom checkout button text.

### discount-apply-error

value: `SlotElement`

  - SlotElement: string
The content to display when a discount code cannot be applied. Useful to add a custom error message for internationalization

### discounts-title

value: `SlotElement`

  - SlotElement: string
The title of the discount section. Useful to add a custom discount section title for internationalization

### empty

value: `SlotElement`

  - SlotElement: string
The content to display when the cart is empty.

### extension

value: `SlotElement`

  - SlotElement: string
Extend the cart with additional content below the checkout button. Useful to add upsell products or other content.

## Examples

The cart component provides a mini shopping cart functionality for your website. Here's how it works:

1. Add a `button` component inside a [shopify-context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) that's associated with a product.
2. Call the `addLine()` method in the `button` component's `onclick` attribute to add the product to the customer's cart.
    - This method requires an event object or a product data object.
    - If using an event, the event target must be inside a product [context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context).

3. Display the cart using a native [HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).
    - To show it as a popup modal, call the `showModal()` method.

4. Apply discount codes automatically using the `discountCodes` attribute.
    - Pass a comma-separated list of discount codes that will be automatically applied to the cart.

5. Customize the cart's styling and content with CSS parts and slots. [View examples](https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart#examples)

> Note:
> The cart component doesn't support mixing products from multiple stores.

Add `<div>` tags with `slot` attributes to show custom content on the empty state and checkout button. Add a `<style>` tag to include CSS parts that change the default styling of the cart's dialog, primary buttons, and secondary buttons.```html
<shopify-cart>
  <!-- Override the empty state with translated text -->
  <div slot="empty">
    Ihr Warenkorb ist leer
  </div>
  <!-- Override the checkout button with translated text -->
  <div slot="checkout-button">
    Zur Kasse
  </div>
  <!-- Override the apply discount button with translated text -->
  <div slot="apply-discount-button">
    Anwenden
  </div>
  <!-- Override the discounts section title with translated text -->
  <div slot="discounts-title">
    Rabatte
  </div>

  <!-- Override the discount apply error message with translated text -->
  <div slot="discount-apply-error">
    Dieser Rabattcode kann nicht angewendet werden.
  </div>
</shopify-cart>

<style>
  shopify-cart::part(dialog) {
    border-radius: 0.5rem;
  }
  shopify-cart::part(primary-button) {
    background-color: #627059;
    border: 0;
    border-radius: 0;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
  }
  shopify-cart::part(secondary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(tertiary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(discount-code) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
</style>

```

Add a product to the cart without a product context. This is useful if you already have a product GID.```html
<shopify-store
  store-domain="hydrogen-preview.myshopify.com"
>
</shopify-store>

<shopify-cart id="cart"></shopify-cart>

<button onclick="addToCart()">Add to cart</button>

<script>
  function addToCart() {
    const product = {
      variantId:
        "gid://shopify/ProductVariant/46565423349816",
      quantity: 1,
      // Optionally pass a sellingPlanId for subscriptions
      sellingPlanId:
        "gid://shopify/SellingPlan/8448376888",
    };

    document
      .getElementById("cart")
      // Manually add any product variant to the cart
      .addLine(product)
      .showModal();
  }
</script>

```

Automatically apply discount codes to the cart by setting the `discount-codes` attribute. The discount codes will be applied whenever items are added, removed, or updated in the cart.```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- Product context for adding items to cart -->
<shopify-context type="product" handle="handle-of-product">
  <template>
    <h3><shopify-data query="product.title"></shopify-data></h3>
    <p>Price: <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></p>
    
    <button 
      onclick="getElementById('cart').addLine(event); getElementById('cart').show();"
      shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"
    >
      Add to cart
    </button>
  </template>
</shopify-context>

<!-- Cart with automatic discount codes -->
<shopify-cart 
  id="cart" 
  discount-codes="SAVE20,FREE-SHIPPING,WELCOME10">
</shopify-cart>
```

## Examples

The cart component provides a mini shopping cart functionality for your website. Here's how it works:

1. Add a `button` component inside a [shopify-context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) that's associated with a product.
2. Call the `addLine()` method in the `button` component's `onclick` attribute to add the product to the customer's cart.
    - This method requires an event object or a product data object.
    - If using an event, the event target must be inside a product [context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context).

3. Display the cart using a native [HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).
    - To show it as a popup modal, call the `showModal()` method.

4. Apply discount codes automatically using the `discountCodes` attribute.
    - Pass a comma-separated list of discount codes that will be automatically applied to the cart.

5. Customize the cart's styling and content with CSS parts and slots. [View examples](https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart#examples)

> Note:
> The cart component doesn't support mixing products from multiple stores.

Add `<div>` tags with `slot` attributes to show custom content on the empty state and checkout button. Add a `<style>` tag to include CSS parts that change the default styling of the cart's dialog, primary buttons, and secondary buttons.```html
<shopify-cart>
  <!-- Override the empty state with translated text -->
  <div slot="empty">
    Ihr Warenkorb ist leer
  </div>
  <!-- Override the checkout button with translated text -->
  <div slot="checkout-button">
    Zur Kasse
  </div>
  <!-- Override the apply discount button with translated text -->
  <div slot="apply-discount-button">
    Anwenden
  </div>
  <!-- Override the discounts section title with translated text -->
  <div slot="discounts-title">
    Rabatte
  </div>

  <!-- Override the discount apply error message with translated text -->
  <div slot="discount-apply-error">
    Dieser Rabattcode kann nicht angewendet werden.
  </div>
</shopify-cart>

<style>
  shopify-cart::part(dialog) {
    border-radius: 0.5rem;
  }
  shopify-cart::part(primary-button) {
    background-color: #627059;
    border: 0;
    border-radius: 0;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
  }
  shopify-cart::part(secondary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(tertiary-button) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
  shopify-cart::part(discount-code) {
    background-color: #ffffff;
    color: #000;
    fill: #000; 
    border: 2px solid #000;
    border-radius: 0;
  }
</style>

```

Add a product to the cart without a product context. This is useful if you already have a product GID.```html
<shopify-store
  store-domain="hydrogen-preview.myshopify.com"
>
</shopify-store>

<shopify-cart id="cart"></shopify-cart>

<button onclick="addToCart()">Add to cart</button>

<script>
  function addToCart() {
    const product = {
      variantId:
        "gid://shopify/ProductVariant/46565423349816",
      quantity: 1,
      // Optionally pass a sellingPlanId for subscriptions
      sellingPlanId:
        "gid://shopify/SellingPlan/8448376888",
    };

    document
      .getElementById("cart")
      // Manually add any product variant to the cart
      .addLine(product)
      .showModal();
  }
</script>

```

Automatically apply discount codes to the cart by setting the `discount-codes` attribute. The discount codes will be applied whenever items are added, removed, or updated in the cart.```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- Product context for adding items to cart -->
<shopify-context type="product" handle="handle-of-product">
  <template>
    <h3><shopify-data query="product.title"></shopify-data></h3>
    <p>Price: <shopify-money query="product.selectedOrFirstAvailableVariant.price"></shopify-money></p>
    
    <button 
      onclick="getElementById('cart').addLine(event); getElementById('cart').show();"
      shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"
    >
      Add to cart
    </button>
  </template>
</shopify-context>

<!-- Cart with automatic discount codes -->
<shopify-cart 
  id="cart" 
  discount-codes="SAVE20,FREE-SHIPPING,WELCOME10">
</shopify-cart>
```

