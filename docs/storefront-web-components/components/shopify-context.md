# shopify-context

The context component defines which Shopify data should be available in different parts of your page.

Each `<shopify-context>` component requires two attributes:

- `type`: Specifies what kind of data you want (for example, `product`).
- `handle` or `gid`: Identifies the specific item. For example, the handle for the URL [`demostore.mock.shop/products/men-t-shirt`](https://demostore.mock.shop/products/men-t-shirt) is `men-t-shirt`. The `gid` attribute can be used to identify the item by its unique id, e.g. `gid://shopify/Product/7982853619734`.

If you're working with a single storefront, then you can add the `<shopify-context>` component anywhere on your page (it doesn't need to be inside the `<shopify-store>` component). If you're working with multiple storefronts, then nest the context inside its corresponding store component.

Every `<shopify-context>` component also requires a `<template>` component, which contains the data you want to display. That template won't be rendered until the context is loaded. Render placeholder content outside the template with an attribute `shopify-loading-placeholder`. This content will be displayed until the context is loaded.

See the [playground](https://webcomponents.shopify.dev/playground) for complete examples.

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
    <!-- The data component is bound to the product
     context and queries the title field -->
    <h1>
      <shopify-data
        query="product.title"
      ></shopify-data>
    </h1>
  </template>
  <!-- Render placeholder content
   until the context is loaded -->
  <div shopify-loading-placeholder>Loading...</div>
</shopify-context>

```

## Attributes

### ContextAttributes

### gid

value: `string`

The unique id for the context. Required on some objects, like products, collections, and blogs, if the `handle` attribute isn't used.

### handle

value: `string`

The handle for the context. Required on some objects, like products, collections, and blogs. The handle is required unless the `wait-for-update` attribute is included or the `gid` attribute is used instead.

### key

value: `string`

The key for the metafield. Required when the context type is `metafield`.

### metaobject-definition-type

value: `string`

The metaobject definition type for the context. Required when the context type is `metaobject`.

### namespace

value: `string`

The namespace for the metafield. Required when the context type is `metafield`.

### query

value: `string`

The query path for accessing nested data within a parent context.

Required when this context is nested inside another context. The query should specify the path to access the desired data from the parent.

Example: If the parent context is a product, and you want to access its first available variant: query="product.selectedOrFirstAvailableVariant"

### type

value: `string`

The type of the context. This needs to match the [GraphQL Storefront API](https://shopify.dev/docs/api/storefront) type you are querying. For example, if you are querying a product, the type should be `type="product"`.

### update

value: `(e: Event) => void`

Updates this context to match the data from another context of the same type.

Common use case: When displaying a list of products, you might want to show a detailed view of a single product in a modal. This method allows you to update the modal's context to display the selected product's data.

How it works:

1. The event target must be inside the source context you want to copy from
2. This context will update its handle to match the source context
3. The data will be automatically refreshed to show the new content

### wait-for-update

value: `boolean`

Wait to render the context until the update method is called. This is useful for dynamically rendering a context.

## Related

- [shopify-list-context](https://shopify.dev/docs/api/storefront-web-components/components/shopify-list-context)

## Examples

The context component defines which Shopify data should be available in different parts of your page.

Each `<shopify-context>` component requires two attributes:

- `type`: Specifies what kind of data you want (for example, `product`).
- `handle` or `gid`: Identifies the specific item. For example, the handle for the URL [`demostore.mock.shop/products/men-t-shirt`](https://demostore.mock.shop/products/men-t-shirt) is `men-t-shirt`. The `gid` attribute can be used to identify the item by its unique id, e.g. `gid://shopify/Product/7982853619734`.

If you're working with a single storefront, then you can add the `<shopify-context>` component anywhere on your page (it doesn't need to be inside the `<shopify-store>` component). If you're working with multiple storefronts, then nest the context inside its corresponding store component.

Every `<shopify-context>` component also requires a `<template>` component, which contains the data you want to display. That template won't be rendered until the context is loaded. Render placeholder content outside the template with an attribute `shopify-loading-placeholder`. This content will be displayed until the context is loaded.

See the [playground](https://webcomponents.shopify.dev/playground) for complete examples.

Show a list of products, and clicking each product opens a dialog with product details```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
  country="CA"
  language="FR"
>
</shopify-store>

<script>
  function showProductDetails(event) {
    // Update a dialog context with a selected product
    document.getElementById('dialog-context')
      .update(event);

    // Show the dialog
    document.getElementById('dialog')
      .showModal();
  }
</script>

<shopify-list-context
  type="product"
  query="products"
  first="10"
>
  <!-- This template is repeated for each product-->
  <template>
    <button
      onclick="showProductDetails(event)"
    >
      <shopify-data
        query="product.title"
      ></shopify-data>
    </button>
  </template>
</shopify-list-context>

<dialog id="dialog">
  <shopify-context
    id="dialog-context"
    type="product"
    wait-for-update
  >
    <template>
      <div>
        <shopify-data
          query="product.description"
        ></shopify-data>
      </div>
    </template>
    <div
      shopify-loading-placeholder
    >
      Loading...
    </div>
  </shopify-context>
</dialog>

```

Show a list of products, and clicking the next and previous buttons loads the next and previous pages of products```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
  country="CA"
  language="FR"
>
</shopify-store>

<shopify-list-context
  type="product"
  query="products"
  first="10"
>
  <!-- This template is repeated for each product-->
  <template>
    <shopify-data
      query="product.title"
    ></shopify-data>
  </template>
</shopify-list-context>
<button
  id="previous"
  onclick="getElementById('list-context').previousPage();"
>
  Previous
</button>
<button
  id="next"
  onclick="getElementById('list-context').nextPage();"
>
  Next
</button>

<script>
  // Listen for the list context to update
  // and disable the next and previous buttons when 
  // the list is at the end or beginning
  document
    .querySelector("shopify-context")
    .addEventListener(
      "shopify-list-context-update",
      (event) => {
        const {
          hasNextPage,
          hasPreviousPage,
        } = event.detail;
        if (!hasNextPage) {
          document
            .getElementById("next")
            .setAttribute(
              "disabled",
              "true",
            );
        } else {
          document
            .getElementById("next")
            .removeAttribute("disabled");
        }
        if (!hasPreviousPage) {
          document
            .getElementById("previous")
            ?.setAttribute(
              "disabled",
              "true",
            );
        } else {
          document
            .getElementById("previous")
            .removeAttribute("disabled");
        }
      },
    );
</script>

```

Show a metafield value```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <shopify-context
      type="metafield"
      query="product.metafield"
      key="your_metafield_key"
      namespace="your_metafield_namespace"
    >
      <template>
        <div>
          <shopify-data
            query="metafield.value"
          ></shopify-data>
        </div>
      </template>
    </shopify-context>
  </template>
</shopify-context>

```

Use a metafield to reference a single product```html
<shopify-store
  store-domain="https://your-store.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- Setup a context for the metafield -->
    <shopify-context
      type="metafield"
      key="related_products"
      key="your_metafield_key"
      namespace="your_metafield_namespace"
    >
      <template>
        <!-- Setup a new context for the metafield reference -->
        <shopify-context
          type="product"
          query="metafield.reference"
        >
          <template>
            <div>
              <!-- Render the title of the metafield reference -->
              <shopify-data
                query="product.title"
              ></shopify-data>
            </div>
          </template>
        </shopify-context>
      </template>
    </shopify-context>
  </template>
</shopify-context>

```

Use a metafield to references a list of products```html
<shopify-store
  store-domain="https://your-store.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- Setup a context for the metafield -->
    <shopify-context
      type="metafield"
      key="related_products"
      key="your_metafield_key"
      namespace="your_metafield_namespace"
    >
      <template>
        <!-- Setup a list context for the metafield references -->
        <shopify-list-context
          type="product"
          query="metafield.references"
          first="5"
        >
          <template>
            <div>
              <shopify-data
                query="product.title"
              ></shopify-data>
            </div>
          </template>
        </shopify-list-context>
      </template>
    </shopify-context>
  </template>
</shopify-context>

```

Render a metaobject context with a text field and a reference media field```html
<!-- pass the name of the metaobject as an attribute -->
<shopify-context
  type="metaobject"
  handle="toronto"
  metaobject-definition-type="stores"
>
  <template>
    <!-- render a field on the metaobject -->
    <h1>
      <shopify-context
        type="field"
        query="metaobject.field"
        key="title"
      >
        <template>
          <shopify-data
            query="field.value"
          ></shopify-data>
        </template>
      </shopify-context>
    </h1>

    <!-- render a reference field on the metaobject -->
    <p>
      <shopify-context
        type="field"
        query="metaobject.field"
        key="featured_image"
      >
        <template>
          <shopify-context
            type="media"
            query="field.reference"
          >
            <template>
              <shopify-media
                query="media"
                width="100"
                height="100"
              ></shopify-media>
            </template>
          </shopify-context>
        </template>
      </shopify-context>
    </p>
  </template>
</shopify-context>

```

## Examples

The context component defines which Shopify data should be available in different parts of your page.

Each `<shopify-context>` component requires two attributes:

- `type`: Specifies what kind of data you want (for example, `product`).
- `handle` or `gid`: Identifies the specific item. For example, the handle for the URL [`demostore.mock.shop/products/men-t-shirt`](https://demostore.mock.shop/products/men-t-shirt) is `men-t-shirt`. The `gid` attribute can be used to identify the item by its unique id, e.g. `gid://shopify/Product/7982853619734`.

If you're working with a single storefront, then you can add the `<shopify-context>` component anywhere on your page (it doesn't need to be inside the `<shopify-store>` component). If you're working with multiple storefronts, then nest the context inside its corresponding store component.

Every `<shopify-context>` component also requires a `<template>` component, which contains the data you want to display. That template won't be rendered until the context is loaded. Render placeholder content outside the template with an attribute `shopify-loading-placeholder`. This content will be displayed until the context is loaded.

See the [playground](https://webcomponents.shopify.dev/playground) for complete examples.

Show a list of products, and clicking each product opens a dialog with product details```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
  country="CA"
  language="FR"
>
</shopify-store>

<script>
  function showProductDetails(event) {
    // Update a dialog context with a selected product
    document.getElementById('dialog-context')
      .update(event);

    // Show the dialog
    document.getElementById('dialog')
      .showModal();
  }
</script>

<shopify-list-context
  type="product"
  query="products"
  first="10"
>
  <!-- This template is repeated for each product-->
  <template>
    <button
      onclick="showProductDetails(event)"
    >
      <shopify-data
        query="product.title"
      ></shopify-data>
    </button>
  </template>
</shopify-list-context>

<dialog id="dialog">
  <shopify-context
    id="dialog-context"
    type="product"
    wait-for-update
  >
    <template>
      <div>
        <shopify-data
          query="product.description"
        ></shopify-data>
      </div>
    </template>
    <div
      shopify-loading-placeholder
    >
      Loading...
    </div>
  </shopify-context>
</dialog>

```

Show a list of products, and clicking the next and previous buttons loads the next and previous pages of products```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
  country="CA"
  language="FR"
>
</shopify-store>

<shopify-list-context
  type="product"
  query="products"
  first="10"
>
  <!-- This template is repeated for each product-->
  <template>
    <shopify-data
      query="product.title"
    ></shopify-data>
  </template>
</shopify-list-context>
<button
  id="previous"
  onclick="getElementById('list-context').previousPage();"
>
  Previous
</button>
<button
  id="next"
  onclick="getElementById('list-context').nextPage();"
>
  Next
</button>

<script>
  // Listen for the list context to update
  // and disable the next and previous buttons when 
  // the list is at the end or beginning
  document
    .querySelector("shopify-context")
    .addEventListener(
      "shopify-list-context-update",
      (event) => {
        const {
          hasNextPage,
          hasPreviousPage,
        } = event.detail;
        if (!hasNextPage) {
          document
            .getElementById("next")
            .setAttribute(
              "disabled",
              "true",
            );
        } else {
          document
            .getElementById("next")
            .removeAttribute("disabled");
        }
        if (!hasPreviousPage) {
          document
            .getElementById("previous")
            ?.setAttribute(
              "disabled",
              "true",
            );
        } else {
          document
            .getElementById("previous")
            .removeAttribute("disabled");
        }
      },
    );
</script>

```

Show a metafield value```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <shopify-context
      type="metafield"
      query="product.metafield"
      key="your_metafield_key"
      namespace="your_metafield_namespace"
    >
      <template>
        <div>
          <shopify-data
            query="metafield.value"
          ></shopify-data>
        </div>
      </template>
    </shopify-context>
  </template>
</shopify-context>

```

Use a metafield to reference a single product```html
<shopify-store
  store-domain="https://your-store.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- Setup a context for the metafield -->
    <shopify-context
      type="metafield"
      key="related_products"
      key="your_metafield_key"
      namespace="your_metafield_namespace"
    >
      <template>
        <!-- Setup a new context for the metafield reference -->
        <shopify-context
          type="product"
          query="metafield.reference"
        >
          <template>
            <div>
              <!-- Render the title of the metafield reference -->
              <shopify-data
                query="product.title"
              ></shopify-data>
            </div>
          </template>
        </shopify-context>
      </template>
    </shopify-context>
  </template>
</shopify-context>

```

Use a metafield to references a list of products```html
<shopify-store
  store-domain="https://your-store.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- Setup a context for the metafield -->
    <shopify-context
      type="metafield"
      key="related_products"
      key="your_metafield_key"
      namespace="your_metafield_namespace"
    >
      <template>
        <!-- Setup a list context for the metafield references -->
        <shopify-list-context
          type="product"
          query="metafield.references"
          first="5"
        >
          <template>
            <div>
              <shopify-data
                query="product.title"
              ></shopify-data>
            </div>
          </template>
        </shopify-list-context>
      </template>
    </shopify-context>
  </template>
</shopify-context>

```

Render a metaobject context with a text field and a reference media field```html
<!-- pass the name of the metaobject as an attribute -->
<shopify-context
  type="metaobject"
  handle="toronto"
  metaobject-definition-type="stores"
>
  <template>
    <!-- render a field on the metaobject -->
    <h1>
      <shopify-context
        type="field"
        query="metaobject.field"
        key="title"
      >
        <template>
          <shopify-data
            query="field.value"
          ></shopify-data>
        </template>
      </shopify-context>
    </h1>

    <!-- render a reference field on the metaobject -->
    <p>
      <shopify-context
        type="field"
        query="metaobject.field"
        key="featured_image"
      >
        <template>
          <shopify-context
            type="media"
            query="field.reference"
          >
            <template>
              <shopify-media
                query="media"
                width="100"
                height="100"
              ></shopify-media>
            </template>
          </shopify-context>
        </template>
      </shopify-context>
    </p>
  </template>
</shopify-context>

```

