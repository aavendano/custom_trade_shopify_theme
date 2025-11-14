# Shopping Cart Technical Guide

This document outlines the required functionalities and technical elements for creating a new HTML structure for the shopping cart. Adhering to this guide will ensure that the new markup is compatible with the existing JavaScript logic.

## I. Main Container

The entire shopping cart component must be wrapped in a `<cart-items>` custom element.

-   **Element**: `<cart-items>`
-   **Classes**:
    -   `is-empty`: This class should be present when the cart is empty. The JavaScript logic will toggle this class based on the cart's status.
-   **Example**:
    ```html
    <cart-items class="isolate{% if cart == empty %} is-empty{% endif %}">
      <!-- ... cart content ... -->
    </cart-items>
    ```

## II. Cart Content and Form

The main content of the cart, including the list of items and the checkout form, must be contained within a `<form>` element.

-   **Element**: `<form>`
-   **ID**: `cart`
-   **Action**: Must point to `{{ routes.cart_url }}`.
-   **Method**: `post`
-   **Example**:
    ```html
    <form action="{{ routes.cart_url }}" method="post" id="cart">
      <!-- ... cart items and footer ... -->
    </form>
    ```

## III. Cart Items List

The list of items in the cart must be structured as a `<table>`. The JavaScript relies on this structure to find and update items.

-   **Container ID**: The `<div>` or `<table>` that directly wraps the cart items must have the ID `main-cart-items`.
-   **JS Contents Wrapper**: Inside the container, there must be a `<div>` with the class `js-contents`. This is the element that the JavaScript will replace when the cart is updated.
-   **Item Rows**: Each item in the cart must be a `<tr>` with the class `cart-item` and a unique ID in the format `CartItem-{{ item.index | plus: 1 }}`.
-   **Example**:
    ```html
    <div id="main-cart-items" data-id="{{ section.id }}">
      <div class="js-contents">
        <table class="cart-items">
          <tbody>
            <tr class="cart-item" id="CartItem-1">
              <!-- ... item details ... -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    ```

## IV. Quantity Controls

The quantity inputs and buttons are critical for the cart's functionality. They must be structured correctly for the JavaScript to handle updates.

-   **Quantity Input**:
    -   **Element**: `<input type="number">`
    -   **Name**: `updates[]`
    -   **ID**: `Quantity-{{ item.index | plus: 1 }}`
    -   **Data Attribute**: `data-index="{{ item.index | plus: 1 }}"`
-   **Remove Button**:
    -   **Element**: A custom element `<cart-remove-button>` is used.
    -   **ID**: `Remove-{{ item.index | plus: 1 }}`
    -   **Data Attribute**: `data-index="{{ item.index | plus: 1 }}"`
-   **Loading Spinner**: Each item row should contain a loading spinner element that can be shown/hidden during updates. The JavaScript looks for elements with the class `loading__spinner`.

## V. Live Regions and Status Elements

These elements are used for accessibility and to provide feedback to the user.

-   **Main Status Element**: An element with the ID `shopping-cart-line-item-status` is used to announce loading states to screen readers.
-   **Live Region**: An element with the ID `cart-live-region-text` is used to announce changes in the cart.
-   **Item-Specific Errors**: Each cart item should have a container for error messages with an ID in the format `Line-item-error-{{ item.index | plus: 1 }}`.

## VI. Cart Footer

The cart footer, which contains the subtotal and checkout button, also has specific requirements.

-   **ID**: The footer container should have the ID `main-cart-footer`.
-   **JS Contents Wrapper**: Similar to the cart items, the footer should have a `<div>` with the class `js-contents` that will be updated.
-   **Checkout Button**:
    -   **Element**: `<button>`
    -   **Name**: `checkout`

By following these guidelines, you can create a new HTML structure for the shopping cart that will integrate seamlessly with the existing JavaScript, preserving all the dynamic functionalities.
