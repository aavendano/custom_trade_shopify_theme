// assets/cart-store.js

document.addEventListener('alpine:init', () => {
    Alpine.store('cart', {
        cart: window.__CART__ || null,
        isBusy: false,
        error: null,

        async refresh() {
            try {
                this.cart = await CartApi.get();
            } catch (err) {
                this.error = err;
            }
        },

        async add(variantId, qty = 1, properties = null) {
            if (this.isBusy) return;
            this.isBusy = true;


            try {
                await CartApi.add(variantId, qty, properties);
                await this.refresh();
                await refreshCartFragment();
                return { ok: true, result };
            } catch (err) {
                return { ok: false, error: err.message || 'Error updating cart' };
            } finally {
                this.isBusy = false;
            }
        },

        async change(id, qty) {
            if (this.isBusy) return;
            this.isBusy = true;

            try {
                await CartApi.change(id, qty);
                await this.refresh();
                await refreshCartFragment();
                return { ok: true, result };
            } catch (err) {
                return { ok: false, error: err.message || 'Error updating cart' };
            } finally {
                this.isBusy = false;
            }
        }
    });
});
