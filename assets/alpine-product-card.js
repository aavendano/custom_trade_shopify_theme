document.addEventListener('alpine:init', () => {
    Alpine.data('productCard', ({ productUrl, sectionId, productId }) => ({
        loading: false,
        modalOpen: false,
        errorMessage: '',
        quickAddInfo: '',

        init() {
            // Initialize logic if needed
        },

        addToCart(formElement) {
            this.loading = true;
            this.errorMessage = '';

            const formData = new FormData(formElement);

            // Add sections to update if cart drawer is present
            // We assume a standard cart notification or drawer component might exist
            // If not, we just redirect.
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
                        return;
                    }

                    // Success - Dispatch event for other components (like Cart Drawer)
                    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: response } }));

                    if (cartNotification) {
                         cartNotification.renderContents(response);
                    } else {
                        // Fallback or explicit redirect if no drawer
                        // window.location = window.routes.cart_url;
                        // For now, let's trigger a refresh or generic event
                        console.log('Added to cart');
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.errorMessage = e.message;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }));
});
