/**
 * Unit Tests for Alpine.js Quick-Add Functionality - Task 13
 * Tests for product-card.js Alpine component
 * 
 * Requirements:
 * - Test Alpine.js integration with x-data
 * - Verify quick-add button with @click handler
 * - Test error message display with x-show and x-cloak
 * - Verify Bulma notification styling
 * - Test integration with cart store
 * 
 * Coverage:
 * - Quick-add functionality
 * - Error handling
 * - Loading states
 * - Success/error notifications
 * - Cart store integration
 * - Event dispatching
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import productCardComponent from '../bulma/scripts/custom/product-card.js';

describe('Alpine.js Quick-Add Functionality Tests', () => {
    let Alpine;
    let component;
    let mockCartStore;

    beforeEach(() => {
        // Mock Alpine.js
        Alpine = {
            data: vi.fn((name, factory) => {
                if (name === 'productCard') {
                    component = factory;
                }
            }),
            store: vi.fn()
        };

        // Mock cart store
        mockCartStore = {
            item_count: 0,
            items: [],
            total_price: 0,
            addItem: vi.fn().mockResolvedValue({ success: true })
        };

        // Register component
        productCardComponent(Alpine);

        // Mock window events
        global.window = {
            dispatchEvent: vi.fn(),
            CustomEvent: class CustomEvent {
                constructor(name, options) {
                    this.name = name;
                    this.detail = options?.detail;
                }
            }
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Component Registration', () => {
        it('should register productCard component with Alpine', () => {
            expect(Alpine.data).toHaveBeenCalledWith('productCard', expect.any(Function));
        });

        it('should accept configuration parameters', () => {
            const instance = component({
                productId: 123,
                variantId: 456,
                quantity: 2
            });

            expect(instance.productId).toBe(123);
            expect(instance.variantId).toBe(456);
            expect(instance.quantity).toBe(2);
        });

        it('should have default quantity of 1', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(instance.quantity).toBe(1);
        });
    });

    describe('Quick Add Functionality', () => {
        it('should have quickAdd method', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(typeof instance.quickAdd).toBe('function');
        });

        it('should validate variant ID before adding', async () => {
            const instance = component({
                productId: 123,
                variantId: null
            });

            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.errorMessage).toBe('Please select a variant');
            expect(instance.clearErrorAfterDelay).toHaveBeenCalled();
        });

        it('should set loading state during add', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = { cart: mockCartStore };

            const addPromise = instance.quickAdd();
            expect(instance.loading).toBe(true);

            await addPromise;
            expect(instance.loading).toBe(false);
        });

        it('should call cart store addItem method', async () => {
            const instance = component({
                productId: 123,
                variantId: 456,
                quantity: 2
            });

            instance.$store = { cart: mockCartStore };

            await instance.quickAdd();

            expect(mockCartStore.addItem).toHaveBeenCalledWith(456, 2);
        });

        it('should show success message on successful add', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = { cart: mockCartStore };

            await instance.quickAdd();

            expect(instance.successMessage).toBe('Added to cart!');
        });

        it('should dispatch product-added-to-cart event', async () => {
            const instance = component({
                productId: 123,
                variantId: 456,
                quantity: 2
            });

            instance.$store = { cart: mockCartStore };

            await instance.quickAdd();

            expect(window.dispatchEvent).toHaveBeenCalled();
            const calls = window.dispatchEvent.mock.calls;

            // Find the product-added-to-cart event
            const productAddedCall = calls.find(call => {
                const event = call[0];
                return event && event.detail && event.detail.productId === 123;
            });

            expect(productAddedCall).toBeTruthy();
            expect(productAddedCall[0].detail).toEqual({
                productId: 123,
                variantId: 456,
                quantity: 2
            });
        });

        it('should dispatch cart-drawer-open event', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = { cart: mockCartStore };

            await instance.quickAdd();

            // Should dispatch at least 2 events (product-added and cart-drawer-open)
            expect(window.dispatchEvent).toHaveBeenCalledTimes(2);
        });
    });

    describe('Error Handling', () => {
        it('should handle cart store not available error', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = {}; // No cart store
            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.errorMessage).toBe('Cart store not available');
            expect(instance.loading).toBe(false);
        });

        it('should handle sold out error', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            mockCartStore.addItem.mockRejectedValue(new Error('Product is sold out'));
            instance.$store = { cart: mockCartStore };
            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.errorMessage).toBe('This product is currently sold out');
        });

        it('should handle network error', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            mockCartStore.addItem.mockRejectedValue(new Error('Failed to fetch'));
            instance.$store = { cart: mockCartStore };
            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.errorMessage).toBe('Network error. Please check your connection');
        });

        it('should handle cart limit error', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            mockCartStore.addItem.mockRejectedValue(new Error('Cart limit reached'));
            instance.$store = { cart: mockCartStore };
            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.errorMessage).toBe('Cart limit reached');
        });

        it('should have generic error message for unknown errors', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            mockCartStore.addItem.mockRejectedValue(new Error('Unknown error'));
            instance.$store = { cart: mockCartStore };
            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.errorMessage).toBe('Failed to add to cart. Please try again');
        });

        it('should clear error message after delay', () => {
            vi.useFakeTimers();

            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.errorMessage = 'Test error';
            instance.clearErrorAfterDelay();

            expect(instance.errorMessage).toBe('Test error');

            vi.advanceTimersByTime(5000);

            expect(instance.errorMessage).toBe('');

            vi.useRealTimers();
        });
    });

    describe('Loading States', () => {
        it('should initialize with loading false', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(instance.loading).toBe(false);
        });

        it('should set loading to true when quick add starts', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = { cart: mockCartStore };

            const promise = instance.quickAdd();
            expect(instance.loading).toBe(true);

            await promise;
        });

        it('should set loading to false when quick add completes', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = { cart: mockCartStore };

            await instance.quickAdd();

            expect(instance.loading).toBe(false);
        });

        it('should set loading to false even on error', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            mockCartStore.addItem.mockRejectedValue(new Error('Test error'));
            instance.$store = { cart: mockCartStore };
            instance.clearErrorAfterDelay = vi.fn();

            await instance.quickAdd();

            expect(instance.loading).toBe(false);
        });
    });

    describe('Quantity Management', () => {
        it('should have setQuantity method', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(typeof instance.setQuantity).toBe('function');
        });

        it('should set valid quantity', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.setQuantity(5);

            expect(instance.quantity).toBe(5);
        });

        it('should enforce minimum quantity of 1', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.setQuantity(0);
            expect(instance.quantity).toBe(1);

            instance.setQuantity(-5);
            expect(instance.quantity).toBe(1);
        });

        it('should enforce maximum quantity of 99', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.setQuantity(100);
            expect(instance.quantity).toBe(99);

            instance.setQuantity(200);
            expect(instance.quantity).toBe(99);
        });

        it('should handle invalid quantity input', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.setQuantity('invalid');
            expect(instance.quantity).toBe(1);

            instance.setQuantity(null);
            expect(instance.quantity).toBe(1);
        });

        it('should increment quantity', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.quantity = 5;
            instance.incrementQuantity();

            expect(instance.quantity).toBe(6);
        });

        it('should not increment beyond 99', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.quantity = 99;
            instance.incrementQuantity();

            expect(instance.quantity).toBe(99);
        });

        it('should decrement quantity', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.quantity = 5;
            instance.decrementQuantity();

            expect(instance.quantity).toBe(4);
        });

        it('should not decrement below 1', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.quantity = 1;
            instance.decrementQuantity();

            expect(instance.quantity).toBe(1);
        });
    });

    describe('Component Initialization', () => {
        it('should have init method', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(typeof instance.init).toBe('function');
        });

        it('should warn if productId is missing', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const instance = component({
                variantId: 456
            });

            // Mock $watch
            instance.$watch = vi.fn();

            instance.init();

            expect(consoleSpy).toHaveBeenCalledWith('Product Card: productId is recommended for analytics');

            consoleSpy.mockRestore();
        });

        it('should not warn if productId is provided', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const instance = component({
                productId: 123,
                variantId: 456
            });

            // Mock $watch
            instance.$watch = vi.fn();

            instance.init();

            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('Success/Error Messages', () => {
        it('should initialize with empty messages', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(instance.errorMessage).toBe('');
            expect(instance.successMessage).toBe('');
        });

        it('should clear messages before quick add', async () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            instance.$store = { cart: mockCartStore };
            instance.errorMessage = 'Old error';
            instance.successMessage = 'Old success';

            await instance.quickAdd();

            expect(instance.successMessage).toBe('Added to cart!');
        });
    });

    describe('Backward Compatibility', () => {
        it('should have legacy addToCart method', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(typeof instance.addToCart).toBe('function');
        });

        it('should have openQuickAdd method', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(typeof instance.openQuickAdd).toBe('function');
        });

        it('should have closeModal method', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(typeof instance.closeModal).toBe('function');
        });

        it('should have modalOpen state', () => {
            const instance = component({
                productId: 123,
                variantId: 456
            });

            expect(instance.modalOpen).toBe(false);
        });
    });
});
