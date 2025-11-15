// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const alpineCartSource = fs.readFileSync(path.join(__dirname, '../assets/alpine-cart.js'), 'utf8');

const createSandbox = (overrides = {}) => {
  const events = {};
  const dispatchedEvents = [];
  const requests = [];

  class TestCustomEvent {
    constructor(name, options = {}) {
      this.type = name;
      this.detail = options.detail || {};
    }
  }

  const defaultFetch = (url, options = {}) => {
    requests.push({ url, options });
    return Promise.resolve({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ url, options }),
      text: async () => '',
    });
  };

  const context = {
    CustomEvent: TestCustomEvent,
    console: {
      warn: () => {},
    },
    document: {
      addEventListener: (event, callback) => {
        events[event] = callback;
      },
    },
    window: {
      __CART__: null,
      scrollY: 0,
      scrollTo: ({ top }) => {
        context.window.scrollY = top;
      },
      dispatchEvent: (event) => {
        dispatchedEvents.push(event);
      },
      location: { pathname: '/' },
    },
    $ajax: overrides.$ajax || {
      refresh: () => Promise.resolve(),
    },
    Alpine: {
      _registry: {},
      data(name, factory) {
        this._registry[name] = factory;
      },
      nextTick() {
        return Promise.resolve();
      },
    },
    dispatchedEvents,
    requests,
  };

  context.window.fetch = overrides.fetch || defaultFetch;
  context.fetch = context.window.fetch;
  context.window.$ajax = context.$ajax;
  context.window.Alpine = context.Alpine;

  const sandbox = vm.createContext(context);
  sandbox.events = events;

  vm.runInContext(alpineCartSource, sandbox);

  if (overrides.CartApi) {
    Object.assign(sandbox.window.CartApi, overrides.CartApi);
  }

  if (events['alpine:init']) {
    events['alpine:init']();
  }

  sandbox.createCartFragment = () => {
    const factory = sandbox.Alpine._registry['cartFragment'];
    if (!factory) {
      throw new Error('cartFragment Alpine data factory is not registered.');
    }
    return factory();
  };

  sandbox.createCartItem = (config = {}) => {
    const factory = sandbox.Alpine._registry['cartItem'];
    if (!factory) {
      throw new Error('cartItem Alpine data factory is not registered.');
    }
    const component = factory(config);
    component.$el = { closest: () => null };
    if (typeof component.init === 'function') {
      component.init();
    }
    return component;
  };

  return sandbox;
};

test('CartApi.change issues JSON request with same-origin credentials', async () => {
  const responses = [];
  const sandbox = createSandbox({
    fetch: (url, options = {}) => {
      responses.push({ url, options });
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ status: 'ok' }),
        text: async () => '',
      });
    },
  });

  await sandbox.window.CartApi.change({ line: 2, quantity: 5 });

  expect(responses).toHaveLength(1);
  expect(responses[0].url).toBe('/cart/change.js');
  expect(JSON.parse(responses[0].options.body)).toEqual({ line: 2, quantity: 5 });
  expect(responses[0].options.credentials).toBe('same-origin');
});

test('CartApi.change surfaces Shopify 422 errors with status metadata', async () => {
  const sandbox = createSandbox({
    fetch: () =>
      Promise.resolve({
        ok: false,
        status: 422,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Quantity exceeds available inventory' }),
        text: async () => '',
      }),
  });

  await expect(sandbox.window.CartApi.change({ line: 1, quantity: 9999 })).rejects.toMatchObject({ status: 422 });
});

test('cartFragment queueRequest tracks pending state and handles errors', async () => {
  const sandbox = createSandbox();
  const fragment = sandbox.createCartFragment();

  expect(fragment.pendingRequests).toBe(0);
  await fragment.queueRequest(() => Promise.resolve('ok'));
  expect(fragment.pendingRequests).toBe(0);

  await fragment
    .queueRequest(() => Promise.reject(new Error('fail')))
    .catch(() => {});
  expect(fragment.lastError).toBeInstanceOf(Error);
  expect(fragment.pendingRequests).toBe(0);
});

test('refreshFragment uses Alpine-AJAX, restores scroll, and emits events', async () => {
  const refreshCalls = [];
  const sandbox = createSandbox({
    $ajax: {
      refresh: (selector) => {
        refreshCalls.push(selector);
        return Promise.resolve();
      },
    },
  });
  const fragment = sandbox.createCartFragment();

  sandbox.window.scrollY = 150;
  await fragment.refreshFragment('quantity-change');

  expect(refreshCalls).toEqual(['[data-cart-fragment]']);
  expect(sandbox.window.scrollY).toBe(150);
  const updatedEvent = sandbox.dispatchedEvents.find((event) => event.type === 'cart:updated');
  expect(updatedEvent).toBeTruthy();
  expect(updatedEvent.detail.reason).toBe('quantity-change');
});

test('hydrate updates local cart data and window.__CART__', () => {
  const sandbox = createSandbox();
  const fragment = sandbox.createCartFragment();
  const payload = { item_count: 1 };

  fragment.hydrate(payload);
  expect(fragment.cart).toEqual(payload);
  expect(sandbox.window.__CART__).toEqual(payload);
});

test('cartItem increase queues CartApi change and refreshes fragment', async () => {
  const sandbox = createSandbox();
  const fragment = sandbox.createCartFragment();
  const cartApiCalls = [];
  const refreshReasons = [];

  fragment.queueRequest = (task) => task();
  fragment.refreshFragment = (reason) => {
    refreshReasons.push(reason);
    return Promise.resolve();
  };

  sandbox.window.CartApi.change = ({ line, quantity }) => {
    cartApiCalls.push({ line, quantity });
    return Promise.resolve();
  };

  const cartItem = sandbox.createCartItem({ line: 2, quantity: 1, fragment });
  await cartItem.increase();

  expect(cartApiCalls).toEqual([{ line: 2, quantity: 2 }]);
  expect(refreshReasons).toEqual(['quantity-change']);
  expect(cartItem.isUpdating).toBe(false);
});

test('cartItem surfaces Shopify 422 messages and resets local quantity', async () => {
  const sandbox = createSandbox();
  const fragment = sandbox.createCartFragment();

  fragment.queueRequest = (task) => task();
  fragment.refreshFragment = () => Promise.resolve();

  sandbox.window.CartApi.change = () =>
    Promise.reject({
      status: 422,
      body: { message: 'Minimum quantity is 2' },
    });

  const cartItem = sandbox.createCartItem({ line: 4, quantity: 2, fragment });
  await expect(cartItem.changeQuantity(3)).rejects.toBeTruthy();
  expect(cartItem.error).toBe('Minimum quantity is 2');
  expect(cartItem.localQuantity).toBe(cartItem.quantity);
});

test('cartItem handleManualChange removes line when zero entered', async () => {
  const sandbox = createSandbox();
  const fragment = sandbox.createCartFragment();
  const quantities = [];

  fragment.queueRequest = (task) => task();
  fragment.refreshFragment = () => Promise.resolve();

  sandbox.window.CartApi.change = ({ quantity }) => {
    quantities.push(quantity);
    return Promise.resolve();
  };

  const cartItem = sandbox.createCartItem({ line: 1, quantity: 2, fragment });
  await cartItem.handleManualChange(0);

  expect(quantities).toEqual([0]);
});
