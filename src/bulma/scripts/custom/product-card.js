/**
 * Product Card Alpine.js Component - Enhanced for Task 13
 * Provides quick-add functionality for product cards
 * 
 * Features:
 * - Quick add to cart without page navigation
 * - Loading states and error handling
 * - Integration with Alpine cart store
 * - Success/error notifications
 * - Modal quick view support
 * - Accessibility compliant
 */

export default function (Alpine) {
    Alpine.data('productCard', ({ productUrl, sectionId, productId, variantId, quantity = 1 }) => ({
        // Configuration
        productId: productId || null,
        variantId: variantId || null,
        quantity: quantity,

        // State
        loading: false,
        modalOpen: false,
        errorMessage: '',
        successMessage: '',
        quickAddInfo: '',

        /**
         * Initialize component
         */
        init() {
            // Validate required configuration
            if (!this.productId) {
                console.warn('Product Card: productId is recommended for analytics');
            }

            // Listen for cart updates
            this.$watch('$store.cart.item_count', () => {
                // Clear success message when cart updates
                if (this.successMessage) {
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3000);
                }
            });
        },

        /**
         * Quick add product to cart using Alpine cart store
         * @returns {Promise<void>}
         */
        async quickAdd() {
            // Validate variant
            if (!this.variantId) {
                this.errorMessage = 'Please select a variant';
                this.clearErrorAfterDelay();
                return;
            }

            // Reset messages
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = true;

            try {
                // Check if cart store is available
                if (!this.$store.cart || typeof this.$store.cart.addItem !== 'function') {
                    throw new Error('Cart store not available');
                }

                // Add to cart via Alpine cart store
                await this.$store.cart.addItem(this.variantId, this.quantity);

                // Show success message
                this.successMessage = 'Added to cart!';

                // Dispatch event for analytics and other components
                window.dispatchEvent(new CustomEvent('product-added-to-cart', {
                    detail: {
                        productId: this.productId,
                        variantId: this.variantId,
                        quantity: this.quantity
                    }
                }));

                // Open cart drawer (if available)
                window.dispatchEvent(new CustomEvent('cart-drawer-open'));

            } catch (error) {
                console.error('Quick add failed:', error);

                // Set user-friendly error message
                this.errorMessage = this.getErrorMessage(error);
                this.clearErrorAfterDelay();

            } finally {
                this.loading = false;
            }
        },

        /**
         * Legacy add to cart using form submission (fallback)
         * @param {HTMLFormElement} formElement - The form element
         */
        addToCart(formElement) {
            this.loading = true;
            this.errorMessage = '';

            const formData = new FormData(formElement);

            // Add sections to update if cart drawer is present
            const cartNotification = document.querySelector('cart-notification');
            if (cartNotification) {
                formData.append(
                    'sections',
                    cartNotification.getSectionsToRender().map((section) => section.id)
                );
                formData.append('sections_url', window.location.pathname);
            }

            const config = {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/javascript'
                },
                body: formData
            };

            fetch(window.routes.cart_add_url, config)
                .then(response => response.json())
                .then(response => {
                    if (response.status) {
                        // Error
                        this.errorMessage = response.errors || response.description || response.message;

                        // Publish error event
                        if (window.publish && window.PUB_SUB_EVENTS) {
                            window.publish(window.PUB_SUB_EVENTS.cartError, {
                                source: 'product-form',
                                productVariantId: formData.get('id'),
                                errors: response.errors || response.description,
                                message: response.message
                            });
                        }
                        return;
                    }

                    // Success
                    if (window.publish && window.PUB_SUB_EVENTS) {
                        window.publish(window.PUB_SUB_EVENTS.cartUpdate, {
                            source: 'product-form',
                            productVariantId: formData.get('id'),
                            cartData: response
                        });
                    } else if (cartNotification) {
                        cartNotification.renderContents(response);
                    } else {
                        window.location = window.routes.cart_url;
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.errorMessage = e.message;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * Open quick add modal
         */
        openQuickAdd() {
            if (this.quickAddInfo) {
                this.modalOpen = true;
                return;
            }

            this.loading = true;

            fetch(productUrl)
                .then(response => response.text())
                .then(responseText => {
                    const parser = new DOMParser();
                    const responseHTML = parser.parseFromString(responseText, 'text/html');
                    const productElement = responseHTML.querySelector('product-info');

                    if (productElement) {
                        this.preprocessHTML(productElement);
                        this.quickAddInfo = productElement.outerHTML;
                        this.modalOpen = true;

                        // Initialize Shopify Payment Buttons and XR if needed
                        this.$nextTick(() => {
                            if (window.Shopify && Shopify.PaymentButton) {
                                Shopify.PaymentButton.init();
                            }
                            if (window.ProductModel) window.ProductModel.loadShopifyXR();
                        });
                    } else {
                        console.error('Product info not found in response');
                        this.errorMessage = 'Failed to load product details';
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.errorMessage = 'Failed to load product details';
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        /**
         * Preprocess HTML for modal
         * @param {HTMLElement} productElement - The product element
         */
        preprocessHTML(productElement) {
            const oldId = sectionId;
            const newId = `quickadd-${sectionId}`;

            // Replace IDs to prevent conflicts
            productElement.innerHTML = productElement.innerHTML.replaceAll(oldId, newId);

            Array.from(productElement.attributes).forEach((attribute) => {
                if (attribute.value.includes(oldId)) {
                    productElement.setAttribute(attribute.name, attribute.value.replace(oldId, newId));
                }
            });

            productElement.dataset.originalSection = sectionId;

            // Remove unwanted elements that might conflict or are not needed in modal
            productElement.querySelectorAll('pickup-availability, product-modal, modal-dialog').forEach(el => el.remove());

            // Prevent URL switching when selecting variants
            productElement.setAttribute('data-update-url', 'false');
        },

        /**
         * Close modal
         */
        closeModal() {
            this.modalOpen = false;
        },

        /**
         * Get user-friendly error message
         * @param {Error} error - The error object
         * @returns {string} User-friendly error message
         */
        getErrorMessage(error) {
            const message = error.message || error.toString();

            if (message.includes('sold out') || message.includes('unavailable')) {
                return 'This product is currently sold out';
            }

            if (message.includes('network') || message.includes('fetch') || message.includes('Failed to fetch')) {
                return 'Network error. Please check your connection';
            }

            if (message.includes('limit') || message.includes('maximum')) {
                return 'Cart limit reached';
            }

            if (message.includes('not available')) {
                return 'Cart store not available';
            }

            return 'Failed to add to cart. Please try again';
        },

        /**
         * Clear error message after delay
         */
        clearErrorAfterDelay() {
            setTimeout(() => {
                this.errorMessage = '';
            }, 5000);
        },

        /**
         * Update quantity
         * @param {number} newQuantity - New quantity value
         */
        setQuantity(newQuantity) {
            const qty = parseInt(newQuantity, 10);

            if (isNaN(qty) || qty < 1) {
                this.quantity = 1;
            } else if (qty > 99) {
                this.quantity = 99;
            } else {
                this.quantity = qty;
            }
        },

        /**
         * Increment quantity
         */
        incrementQuantity() {
            if (this.quantity < 99) {
                this.quantity++;
            }
        },

        /**
         * Decrement quantity
         */
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        }

    }));
}
