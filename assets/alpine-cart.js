'use strict';

(() => {
  const CART_FRAGMENT_SELECTOR = '[data-cart-fragment]';
  const JSON_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const ensureFetch = () => {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      return window.fetch.bind(window);
    }

    if (typeof fetch === 'function') {
      return fetch;
    }

    throw new Error('Fetch API is not available in this environment.');
  };

  const dispatchWindowEvent = (name, detail = {}) => {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function' || typeof CustomEvent !== 'function') {
      return;
    }

    window.dispatchEvent(new CustomEvent(name, { detail }));
  };

  const parseResponsePayload = async (response) => {
    const contentType = response.headers && typeof response.headers.get === 'function' ? response.headers.get('content-type') : '';
    const isJson = typeof contentType === 'string' && contentType.indexOf('json') > -1;

    if (isJson && typeof response.json === 'function') {
      return response.json();
    }

    if (typeof response.text === 'function') {
      return response.text();
    }

    return null;
  };

  const sendJson = async (url, { method = 'POST', body, headers = {} } = {}) => {
    const fetchFn = ensureFetch();
    const options = {
      method,
      credentials: 'same-origin',
      headers: { ...JSON_HEADERS, ...headers },
    };

    if (typeof body !== 'undefined' && method.toUpperCase() !== 'GET') {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    if (method.toUpperCase() === 'GET') {
      delete options.body;
    }

    const response = await fetchFn(url, options);
    const payload = await parseResponsePayload(response);

    if (!response.ok) {
      const error = new Error((payload && payload.message) || 'Cart request failed');
      error.status = response.status;
      error.body = payload;
      throw error;
    }

    return payload;
  };

  const normalizeQuantity = (value) => {
    const qty = Number(value);
    if (!Number.isFinite(qty) || qty < 0) {
      return 0;
    }
    return qty;
  };

  const CartApi = {
    change({ line, quantity }) {
      if (typeof line === 'undefined' || line === null) {
        throw new Error('CartApi.change requires a line number.');
      }

      return sendJson('/cart/change.js', {
        method: 'POST',
        body: {
          line,
          quantity: normalizeQuantity(quantity),
        },
      });
    },

    update(payload = {}) {
      return sendJson('/cart/update.js', {
        method: 'POST',
        body: payload,
      });
    },

    fetchCart() {
      return sendJson('/cart.js', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    },
  };

  window.CartApi = CartApi;

  const getAjaxHelper = () => {
    if (typeof window.$ajax === 'undefined' || typeof window.$ajax.refresh !== 'function') {
      throw new Error('Alpine-AJAX helper is required for cart refreshes.');
    }

    return window.$ajax;
  };

  document.addEventListener('alpine:init', () => {
    const ajaxHelper = () => {
      try {
        return getAjaxHelper();
      } catch (error) {
        return null;
      }
    };

    const withFragmentQueue = (fragment, task) => {
      if (fragment && typeof fragment.queueRequest === 'function') {
        return fragment.queueRequest(task);
      }
      return task();
    };

    const safeRefresh = (fragment, reason) => {
      if (fragment && typeof fragment.refreshFragment === 'function') {
        return fragment.refreshFragment(reason);
      }

      const helper = ajaxHelper();
      if (helper) {
        return helper.refresh(CART_FRAGMENT_SELECTOR).then(() => Alpine.nextTick());
      }

      return Promise.resolve();
    };

    Alpine.data('cartFragment', () => ({
      cart: null,
      isRefreshing: false,
      pendingRequests: 0,
      lastError: null,
      fragmentSelector: CART_FRAGMENT_SELECTOR,
      refreshPromise: null,

      hydrate(cartPayload) {
        if (!cartPayload) {
          return;
        }

        this.cart = cartPayload;
        window.__CART__ = cartPayload;
      },

      queueRequest(task) {
        if (typeof task !== 'function') {
          return Promise.reject(new Error('queueRequest expects a function.'));
        }

        this.pendingRequests += 1;

        let result;
        try {
          result = task();
        } catch (error) {
          this.pendingRequests = Math.max(0, this.pendingRequests - 1);
          this.handleError(error);
          return Promise.reject(error);
        }

        return Promise.resolve(result)
          .catch((error) => {
            this.handleError(error);
            throw error;
          })
          .finally(() => {
            this.pendingRequests = Math.max(0, this.pendingRequests - 1);
          });
      },

      refreshFragment(reason = 'manual') {
        if (this.refreshPromise) {
          return this.refreshPromise;
        }

        const previousScrollY = window.scrollY || 0;
        this.isRefreshing = true;

        const helper = ajaxHelper();
        if (!helper) {
          this.isRefreshing = false;
          const error = new Error('Unable to refresh cart fragment without Alpine-AJAX.');
          this.handleError(error);
          return Promise.reject(error);
        }

        this.refreshPromise = helper
          .refresh(this.fragmentSelector)
          .then(() => Alpine.nextTick())
          .then(() => {
            window.scrollTo({ top: previousScrollY, behavior: 'auto' });
            this.isRefreshing = false;
            dispatchWindowEvent('cart:updated', { reason });
            return this.cart;
          })
          .catch((error) => {
            this.isRefreshing = false;
            this.handleError(error);
            return CartApi.fetchCart()
              .then((payload) => {
                this.cart = payload;
                window.__CART__ = payload;
                return payload;
              })
              .catch((fallbackError) => {
                this.handleError(fallbackError);
              });
          })
          .finally(() => {
            this.refreshPromise = null;
          });

        return this.refreshPromise;
      },

      handleError(error) {
        this.lastError = error;
        console.warn('[cartFragment]', error);
        dispatchWindowEvent('cart:error', { error });
      },
    }));

    if (!window.__CART_ITEM_SCOPE_INITIALIZED__) {
      window.__CART_ITEM_SCOPE_INITIALIZED__ = true;

      Alpine.data('cartItem', (config = {}) => ({
        line: config.line,
        fragment: config.fragment || null,
        quantity: Number(config.quantity) || 1,
        localQuantity: Number(config.quantity) || 1,
        min: Number.isFinite(config.min) ? Number(config.min) : 1,
        max: Number.isFinite(config.max) ? Number(config.max) : null,
        increment: Number(config.increment) && Number(config.increment) > 0 ? Number(config.increment) : 1,
        canUpdate: config.canUpdate !== false,
        canRemove: config.canRemove !== false,
        isUpdating: false,
        error: null,

        init() {
          this.localQuantity = this.quantity;
        },

        canIncrease() {
          if (!this.canUpdate) {
            return false;
          }
          if (this.max === null) {
            return true;
          }
          return this.quantity + this.increment <= this.max;
        },

        canDecrease() {
          if (!this.canUpdate) {
            return false;
          }
          return this.quantity - this.increment >= this.min;
        },

        normalizeQuantity(value) {
          const qty = Math.trunc(Number(value));
          if (!Number.isFinite(qty)) {
            return this.quantity;
          }
          if (qty <= 0) {
            return 0;
          }
          let normalized = qty;
          if (this.max !== null) {
            normalized = Math.min(normalized, this.max);
          }
          normalized = Math.max(normalized, this.min);
          return normalized;
        },

        handleManualChange(value) {
          if (!this.canUpdate) {
            this.localQuantity = this.quantity;
            return;
          }

          const parsed = Number(value);
          if (!Number.isFinite(parsed)) {
            this.localQuantity = this.quantity;
            return;
          }

          if (parsed <= 0) {
            this.localQuantity = 0;
            return this.remove();
          }

          this.localQuantity = parsed;
          return this.changeQuantity(parsed);
        },

        increase() {
          if (!this.canUpdate || this.isUpdating || !this.canIncrease()) {
            return;
          }
          const target = this.quantity + this.increment;
          this.localQuantity = target;
          return this.changeQuantity(target);
        },

        decrease() {
          if (!this.canUpdate || this.isUpdating || !this.canDecrease()) {
            return;
          }
          const target = this.quantity - this.increment;
          this.localQuantity = target;
          return this.changeQuantity(target);
        },

        remove() {
          if (!this.canRemove) {
            return;
          }
          this.error = null;
          this.localQuantity = 0;
          return this.sendQuantity(0, 'remove');
        },

        changeQuantity(value) {
          const normalized = this.normalizeQuantity(value);
          if (normalized === 0) {
            return this.remove();
          }
          if (normalized === this.quantity) {
            this.localQuantity = this.quantity;
            return Promise.resolve();
          }
          return this.sendQuantity(normalized, 'quantity-change');
        },

        sendQuantity(targetQuantity, reason) {
          if (this.isUpdating) {
            return this.pendingPromise;
          }

          if (!this.canUpdate && targetQuantity !== 0) {
            return Promise.resolve();
          }

          this.isUpdating = true;
          this.error = null;

          const action = () => CartApi.change({ line: this.line, quantity: targetQuantity });
          const runner = withFragmentQueue(this.fragment, action);

          this.pendingPromise = runner
            .then(() => {
              this.quantity = targetQuantity;
              this.localQuantity = targetQuantity;
              return safeRefresh(this.fragment, reason);
            })
            .catch((error) => {
              if (error && error.status === 422 && error.body && error.body.message) {
                this.error = error.body.message;
              } else {
                this.error = (window.cartStrings && window.cartStrings.error) || 'Unable to update cart.';
              }
              this.localQuantity = this.quantity;
              throw error;
            })
            .finally(() => {
              this.isUpdating = false;
              this.pendingPromise = null;
            });

          return this.pendingPromise;
        },
      }));
    }
  });
})();
