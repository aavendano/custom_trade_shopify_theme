// assets/megamenu-store.js
// Global Alpine.js store for megamenu state management
// Decoupled from header section to prevent Shopify DOM rehydration issues

document.addEventListener("alpine:init", () => {
    Alpine.store("megaMenu", {
        // State properties
        isOpen: false,
        activeContext: null,
        closeTimeout: null,

        /**
         * Open the megamenu with a specific context
         * @param {string} context - The menu handle/identifier to display
         */
        open(context) {
            // Cancel any pending close operation
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }

            // If already open with same context, do nothing (prevents flicker)
            if (this.isOpen && this.activeContext === context) {
                return;
            }

            this.isOpen = true;
            this.activeContext = context;
        },

        /**
         * Close the megamenu immediately
         */
        close() {
            // Cancel any pending close operation
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }

            this.isOpen = false;
            this.activeContext = null;
        },

        /**
         * Schedule a delayed close (for hover-out debounce)
         * @param {number} delayMs - Delay in milliseconds before closing (default: 300)
         */
        scheduleClose(delayMs = 300) {
            // Validate delay parameter
            const delay = typeof delayMs === 'number' && delayMs > 0 ? delayMs : 300;

            // Clear any existing timeout to prevent multiple scheduled closes
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
            }

            // Store reference for potential cancellation
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, delay);
        },

        /**
         * Cancel a scheduled close (when mouse re-enters)
         */
        cancelClose() {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
        },

        /**
         * Toggle the megamenu (for mobile tap behavior)
         * @param {string} context - The menu handle/identifier to toggle
         */
        toggle(context) {
            if (this.isOpen && this.activeContext === context) {
                this.close();
            } else {
                this.open(context);
            }
        },

        /**
         * Switch to a different context without closing
         * Used for smooth transitions between menu items on hover
         * @param {string} context - The new menu handle/identifier
         */
        switchContext(context) {
            if (!context) return;

            // Cancel any pending close
            this.cancelClose();

            // Only update if different context
            if (this.activeContext !== context) {
                this.activeContext = context;
                // Ensure menu is open
                this.isOpen = true;
            }
        }
    });

    // Close megamenu on Turbo navigation (if Turbo is present)
    document.addEventListener('turbo:before-visit', () => {
        const store = Alpine.store('megaMenu');
        if (store) {
            store.close();
        }
    });

    // Also close on standard navigation for non-Turbo pages
    window.addEventListener('beforeunload', () => {
        const store = Alpine.store('megaMenu');
        if (store) {
            store.close();
        }
    });
});
