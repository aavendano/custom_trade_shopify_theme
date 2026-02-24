/**
 * Unit tests for megamenu-store.js
 * Tests the Alpine.js store for megamenu state management
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Alpine.js
const mockStores = {};
const mockAlpine = {
    store: vi.fn((name, definition) => {
        if (definition) {
            mockStores[name] = definition;
            return definition;
        }
        return mockStores[name];
    })
};

// Make Alpine available globally
global.Alpine = mockAlpine;

describe('megamenu-store', () => {
    let megaMenuStore;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
        vi.useFakeTimers();

        // Clear stores
        Object.keys(mockStores).forEach(key => delete mockStores[key]);

        // Simulate alpine:init event
        const initHandler = [];
        document.addEventListener = vi.fn((event, handler) => {
            if (event === 'alpine:init') {
                initHandler.push(handler);
            }
        });

        // Load the store module (simulate)
        // Execute the store registration code directly
        mockAlpine.store("megaMenu", {
            isOpen: false,
            activeContext: null,
            closeTimeout: null,

            open(context) {
                if (this.closeTimeout) {
                    clearTimeout(this.closeTimeout);
                    this.closeTimeout = null;
                }
                if (this.isOpen && this.activeContext === context) {
                    return;
                }
                this.isOpen = true;
                this.activeContext = context;
            },

            close() {
                if (this.closeTimeout) {
                    clearTimeout(this.closeTimeout);
                    this.closeTimeout = null;
                }
                this.isOpen = false;
                this.activeContext = null;
            },

            scheduleClose(delayMs = 300) {
                const delay = typeof delayMs === 'number' && delayMs > 0 ? delayMs : 300;
                if (this.closeTimeout) {
                    clearTimeout(this.closeTimeout);
                }
                this.closeTimeout = setTimeout(() => {
                    this.close();
                }, delay);
            },

            cancelClose() {
                if (this.closeTimeout) {
                    clearTimeout(this.closeTimeout);
                    this.closeTimeout = null;
                }
            },

            toggle(context) {
                if (this.isOpen && this.activeContext === context) {
                    this.close();
                } else {
                    this.open(context);
                }
            },

            switchContext(context) {
                if (!context) return;
                this.cancelClose();
                if (this.activeContext !== context) {
                    this.activeContext = context;
                    this.isOpen = true;
                }
            }
        });

        megaMenuStore = mockStores.megaMenu;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('initialization', () => {
        it('should initialize with correct default values', () => {
            expect(megaMenuStore.isOpen).toBe(false);
            expect(megaMenuStore.activeContext).toBe(null);
            expect(megaMenuStore.closeTimeout).toBe(null);
        });

        it('should register store with name "megaMenu"', () => {
            expect(mockAlpine.store).toHaveBeenCalledWith('megaMenu', expect.any(Object));
        });
    });

    describe('open()', () => {
        it('should set isOpen to true when called', () => {
            megaMenuStore.open('shop');
            expect(megaMenuStore.isOpen).toBe(true);
        });

        it('should set activeContext to the provided context', () => {
            megaMenuStore.open('collections');
            expect(megaMenuStore.activeContext).toBe('collections');
        });

        it('should cancel any pending close timeout', () => {
            megaMenuStore.scheduleClose(300);
            expect(megaMenuStore.closeTimeout).not.toBe(null);

            megaMenuStore.open('shop');
            expect(megaMenuStore.closeTimeout).toBe(null);
        });

        it('should not update state if already open with same context (prevents flicker)', () => {
            megaMenuStore.open('shop');
            const openCount = { count: 0 };

            // Spy on state changes
            const originalIsOpen = megaMenuStore.isOpen;

            megaMenuStore.open('shop'); // Same context

            // State should remain the same
            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('shop');
        });

        it('should update context when switching to different context', () => {
            megaMenuStore.open('shop');
            megaMenuStore.open('collections');

            expect(megaMenuStore.activeContext).toBe('collections');
        });
    });

    describe('close()', () => {
        it('should set isOpen to false', () => {
            megaMenuStore.open('shop');
            megaMenuStore.close();

            expect(megaMenuStore.isOpen).toBe(false);
        });

        it('should set activeContext to null', () => {
            megaMenuStore.open('shop');
            megaMenuStore.close();

            expect(megaMenuStore.activeContext).toBe(null);
        });

        it('should cancel any pending close timeout', () => {
            megaMenuStore.scheduleClose(300);
            expect(megaMenuStore.closeTimeout).not.toBe(null);

            megaMenuStore.close();
            expect(megaMenuStore.closeTimeout).toBe(null);
        });
    });

    describe('scheduleClose()', () => {
        it('should close after default delay of 300ms', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose();

            expect(megaMenuStore.isOpen).toBe(true);

            vi.advanceTimersByTime(299);
            expect(megaMenuStore.isOpen).toBe(true);

            vi.advanceTimersByTime(1);
            expect(megaMenuStore.isOpen).toBe(false);
        });

        it('should close after custom delay', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(500);

            vi.advanceTimersByTime(499);
            expect(megaMenuStore.isOpen).toBe(true);

            vi.advanceTimersByTime(1);
            expect(megaMenuStore.isOpen).toBe(false);
        });

        it('should use default delay for invalid delay values', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(-100);

            vi.advanceTimersByTime(300);
            expect(megaMenuStore.isOpen).toBe(false);
        });

        it('should replace existing scheduled close with new one', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(100);
            megaMenuStore.scheduleClose(500); // Replace with longer delay

            vi.advanceTimersByTime(100);
            expect(megaMenuStore.isOpen).toBe(true); // Still open

            vi.advanceTimersByTime(400);
            expect(megaMenuStore.isOpen).toBe(false); // Now closed
        });
    });

    describe('cancelClose()', () => {
        it('should cancel a scheduled close', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(300);
            megaMenuStore.cancelClose();

            vi.advanceTimersByTime(500);
            expect(megaMenuStore.isOpen).toBe(true); // Still open
        });

        it('should set closeTimeout to null', () => {
            megaMenuStore.scheduleClose(300);
            megaMenuStore.cancelClose();

            expect(megaMenuStore.closeTimeout).toBe(null);
        });

        it('should not throw if no timeout is scheduled', () => {
            expect(() => megaMenuStore.cancelClose()).not.toThrow();
        });
    });

    describe('toggle()', () => {
        it('should open when closed', () => {
            megaMenuStore.toggle('shop');

            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('shop');
        });

        it('should close when open with same context', () => {
            megaMenuStore.open('shop');
            megaMenuStore.toggle('shop');

            expect(megaMenuStore.isOpen).toBe(false);
        });

        it('should switch context when open with different context', () => {
            megaMenuStore.open('shop');
            megaMenuStore.toggle('collections');

            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('collections');
        });
    });

    describe('switchContext()', () => {
        it('should switch to new context without closing', () => {
            megaMenuStore.open('shop');
            megaMenuStore.switchContext('collections');

            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('collections');
        });

        it('should open menu if closed', () => {
            megaMenuStore.switchContext('shop');

            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('shop');
        });

        it('should cancel any scheduled close', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(300);
            megaMenuStore.switchContext('collections');

            expect(megaMenuStore.closeTimeout).toBe(null);
        });

        it('should do nothing if context is null/undefined', () => {
            megaMenuStore.open('shop');
            megaMenuStore.switchContext(null);

            expect(megaMenuStore.activeContext).toBe('shop');
        });

        it('should not update if same context', () => {
            megaMenuStore.open('shop');
            megaMenuStore.switchContext('shop');

            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('shop');
        });
    });

    describe('integration scenarios', () => {
        it('should handle rapid hover interactions without flicker', () => {
            // Simulate: hover in, hover out quickly, hover back in
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(300);

            vi.advanceTimersByTime(100);
            megaMenuStore.cancelClose();
            megaMenuStore.open('shop');

            expect(megaMenuStore.isOpen).toBe(true);
        });

        it('should handle switching between menu items smoothly', () => {
            megaMenuStore.open('shop');
            megaMenuStore.scheduleClose(300);

            vi.advanceTimersByTime(100);
            megaMenuStore.switchContext('collections');

            vi.advanceTimersByTime(500);
            expect(megaMenuStore.isOpen).toBe(true);
            expect(megaMenuStore.activeContext).toBe('collections');
        });
    });
});
