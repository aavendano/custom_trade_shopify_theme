# shopify-list-context

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

```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- The context is bound to the store -->
<shopify-list-context
  type="product"
  query="products"
  first="10"
>
  <!-- The template is repeated for each item
    in the array -->
  <template>
    <h2>
      <shopify-data
        query="product.title"
      ></shopify-data>
    </h2>
  </template>
</shopify-list-context>

```

## Attributes

### ListContextAttributes

### first

value: `number`

The number of items to return.

### metaobject-definition-type

value: `string`

The metaobject definition type for the context. Required when the context type is `metaobject`.

### nextPage

value: `() => void`

Load the next page of items in the list.

### previousPage

value: `() => void`

Load the previous page of items in the list.

### query

value: `string`

Defines where the list exists, either at the root or relative to a parent context. For example:

1. At the root, query a list of all products, `query="products"`
2. Within a parent collection context, query the products on that collection, `query="collection.products"`

### reverse

value: `() => void`

Reverse the order of the items in the list.

### reverseOrder

value: `boolean`

If present, reverses the sort order (descending instead of ascending)

### sortKey

value: `string`

Sets the key to sort the items by (e.g., 'TITLE', 'PRICE', etc.).

Available sort keys depend on the context type and can be found in the Storefront API documentation (e.g. for product contexts, see [ProductSortKeys](https://shopify.dev/docs/api/storefront/latest/enums/productsortkeys)).

### type

value: `string`

The type of the context. This needs to match the [GraphQL Storefront API](https://shopify.dev/docs/api/storefront) type you are querying. For example, if you are querying a product, the type should be `type="product"`.

## Related

- [shopify-context](https://shopify.dev/docs/api/storefront-web-components/components/shopify-context)

## Examples

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

Sorting products by title ascending and descending using sort-key and reverse-order.```html
<shopify-store store-domain="https://your-store.myshopify.com"></shopify-store>

<!-- Sort by title ascending -->
<shopify-list-context type="product" query="products" first="3" sort-key="TITLE">
  <template>
    <h2><shopify-data query="product.title"></shopify-data></h2>
  </template>
</shopify-list-context>

<!-- Sort by title descending -->
<shopify-list-context type="product" query="products" first="3" sort-key="TITLE" reverse-order>
  <template>
    <h2><shopify-data query="product.title"></shopify-data></h2>
  </template>
</shopify-list-context> 
```

## Examples

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

Sorting products by title ascending and descending using sort-key and reverse-order.```html
<shopify-store store-domain="https://your-store.myshopify.com"></shopify-store>

<!-- Sort by title ascending -->
<shopify-list-context type="product" query="products" first="3" sort-key="TITLE">
  <template>
    <h2><shopify-data query="product.title"></shopify-data></h2>
  </template>
</shopify-list-context>

<!-- Sort by title descending -->
<shopify-list-context type="product" query="products" first="3" sort-key="TITLE" reverse-order>
  <template>
    <h2><shopify-data query="product.title"></shopify-data></h2>
  </template>
</shopify-list-context> 
```

