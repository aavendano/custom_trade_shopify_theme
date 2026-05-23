## shopify-cart

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
[View shopify-cart](https://shopify.dev/docs/api/storefront-web-components/components/shopify-cart)

## shopify-context

The context component defines which Shopify data should be available in different parts of your page.

Each `<shopify-context>` component requires two attributes:

- `type`: Specifies what kind of data you want (for example, `product`).
- `handle` or `gid`: Identifies the specific item. For example, the handle for the URL [`demostore.mock.shop/products/men-t-shirt`](https://demostore.mock.shop/products/men-t-shirt) is `men-t-shirt`. The `gid` attribute can be used to identify the item by its unique id, e.g. `gid://shopify/Product/7982853619734`.

If you're working with a single storefront, then you can add the `<shopify-context>` component anywhere on your page (it doesn't need to be inside the `<shopify-store>` component). If you're working with multiple storefronts, then nest the context inside its corresponding store component.

Every `<shopify-context>` component also requires a `<template>` component, which contains the data you want to display. That template won't be rendered until the context is loaded. Render placeholder content outside the template with an attribute `shopify-loading-placeholder`. This content will be displayed until the context is loaded.

See the [playground](https://webcomponents.shopify.dev/playground) for complete examples.
[View shopify-context](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context)

## shopify-list-context

The [list context component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-list-context) allows you to display multiple items in a repeating format. To use it, you need several key attributes:

1. `type`: Defines what you're listing (such as 'product' or 'collection')
2. `query`: Specifies which data fields you want to display
3. `first`: Sets the number of items to show in the list
4. `sort-key` (optional): Sets the key to sort the items by (e.g., 'TITLE', 'PRICE', etc.). Available sort keys depend on the context type and can be found in the Storefront API documentation (e.g. for product contexts, see [ProductSortKeys](https://shopify.dev/docs/api/storefront/latest/enums/productsortkeys)).
5. `reverse-order` (optional): If present, reverses the sort order (descending instead of ascending)

Inside the list context, a template component defines how each item should appear. This template will automatically repeat for each item in your list. When you reference data within the template (using shopify-data or other components), it will automatically pull from the current item being displayed.

**Sorting**

- Use the `sort-key` attribute to specify the field to sort by. For example, `sort-key="TITLE"` will sort products alphabetically by title.
- Add the `reverse-order` boolean attribute to reverse the sort order (e.g., from ascending to descending).

> Note:
>  The list context can be nested inside a context component or other list context components.

See the [playground](https://webcomponents.shopify.dev/playground) for examples.
[View shopify-list-context](https://shopify.dev/docs/api/storefront-web-components/components/shopify-list-context)

## shopify-data

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
[View shopify-data](https://shopify.dev/docs/api/storefront-web-components/components/shopify-data)

## shopify-media

Accepts a reference to an [Image](https://shopify.dev/docs/api/storefront/latest/objects/Image) or [Media](https://shopify.dev/docs/api/storefront/latest/interfaces/Media) reference and generates an image or video element with `srcset` and `sizes` attributes. This component must be a child of a `shopify-context` component. It takes a query attribute that defines the context it's a part of, and the field to query. 

If you want the media to automatically change based on which variant is selected on the [variant-selector component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-variant-selector), make sure to reference the product image on the `product.selectedOrFirstAvailableVariant.image` field.

See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.

> Note:
> When rendering an image, the media component uses the [`unpic-img`](https://unpic.pics/img/lit/) element internally, so you can also pass `height`, `width`, `layout`, `aspect-ratio`, `priority`, `breakpoints`, and `sizes` attributes to control the scale and size of the image. Learn more about image props in the [Unpic documentation](https://unpic.pics/img/lit/#image-props).
[View shopify-media](https://shopify.dev/docs/api/storefront-web-components/components/shopify-media)

## shopify-money

Accepts query a reference to a [Money object](https://shopify.dev/docs/api/storefront/2024-04/objects/MoneyV2), and uses the store's country and language market to format it correctly. This component must be a child of a [`shopify-context`](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context) component. The component takes a query attribute that defines the context it's a part of, and the field to query. This component produces a text node with the formatted price.

Usually you want a product price to update based on the selected variant, so make sure to reference the `product.selectedOrFirstAvailableVariant.price` field if you are using the [shopify-variant-selector](https://shopify.dev/docs/api/storefront-web-components/components/shopify-variant-selector) component.

See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.
[View shopify-money](https://shopify.dev/docs/api/storefront-web-components/components/shopify-money)

## shopify-store

Use the `<shopify-store>` component to set up your credentials and market configuration for a storefront. You can optionally add a public access token, which gives you access to your store's inventory, metafields, and metaobjects. You can get a public access token by [adding the Headless channel](https://shopify.dev/docs/api/storefront-web-components/getting-started#connect-your-store) in your Shopify admin.
    
See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.
[View shopify-store](https://shopify.dev/docs/api/storefront-web-components/components/shopify-store)

## shopify-variant-selector

Use the `<shopify-variant-selector>` component to display a form for selecting product options. The variant selector must be a child of a product context. Any data, money, or media component that references `selectedOrFirstAvailableVariant` will automatically update when a variant is selected.

See the [playground](https://webcomponents.shopify.dev/playground) for more complete examples.
[View shopify-variant-selector](https://shopify.dev/docs/api/storefront-web-components/components/shopify-variant-selector)

