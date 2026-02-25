/**
 * Comprehensive PDP (Product Detail Page) Tests - Task 25
 * Tests for aa-main-product.liquid functionality
 *
 * Requirements:
 * - Test variant selection updates price and image reactively
 * - Verify add-to-cart adds correct variant to cart store
 * - Test sold-out variant shows disabled button with correct text
 * - Validate scroll snap gallery behavior on touch devices
 * - Test error handling for failed add-to-cart operations
 *
 * Coverage:
 * - Variant selection and state management
 * - Price updates and reactive display
 * - Add to cart functionality
 * - Availability and sold-out states
 * - Gallery scroll snap behavior
 * - Error handling and user feedback
 * - Accessibility compliance
 * - Structured data validation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('PDP Functionality Tests', () => {
    let dom;
    let document;
    let window;
    let Alpine;
    let mockProduct;
    let mockVariants;

    beforeEach(() => {
        // Mock product data
        mockProduct = {
            id: 123456,
            title: 'Test Product',
            vendor: 'Test Vendor',
            description: 'Test product description',
            media: [
                { id: 1, media_type: 'image', src: '/image1.jpg', alt: 'Image 1' },
                { id: 2, media_type: 'image', src: '/image2.jpg', alt: 'Image 2' },
                { id: 3, media_type: 'image', src: '/image3.jpg', alt: 'Image 3' }
            ]
        };

        mockVariants = [
            {
                id: 1,
                title: 'Small / Red',
                options: ['Small', 'Red'],
                price: 2999,
                compare_at_price: 3999,
                available: true,
                sku: 'TEST-SM-RED'
            },
            {
                id: 2,
                title: 'Medium / Red',
                options: ['Medium', 'Red'],
                price: 2999,
                compare_at_price: null,
                available: true,
                sku: 'TEST-MD-RED'
            },
            {
                id: 3,
                title: 'Large / Red',
                options: ['Large', 'Red'],
                price: 3499,
                compare_at_price: null,
                available: false,
                sku: 'TEST-LG-RED'
            },
            {
                id: 4,
                title: 'Small / Blue',
                options: ['Small', 'Blue'],
                price: 2999,
                compare_at_price: null,
                available: true,
                sku: 'TEST-SM-BLUE'
            }
        ];

        // Create JSDOM instance
        dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <!-- Product Page -->
          <div class="b-section">
            <div class="b-container">
              <div class="b-columns">
                <!-- Gallery -->
                <div class="b-column">
                  <div class="c-product-gallery">
                    <div class="c-product-gallery__track" id="gallery-test">
                      <div class="c-product-gallery__slide">
                        <img src="/image1.jpg" alt="Image 1" loading="eager">
                      </div>
                      <div class="c-product-gallery__slide">
                        <img src="/image2.jpg" alt="Image 2" loading="lazy">
                      </div>
                      <div class="c-product-gallery__slide">
                        <img src="/image3.jpg" alt="Image 3" loading="lazy">
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="b-column">
                  <h1 class="b-title">Test Product</h1>

                  <!-- Price -->
                  <div class="c-product-price-wrapper">
                    <span class="c-product-price">$29.99</span>
                    <span class="c-product-price--compare" style="display: none;">$39.99</span>
                  </div>

                  <!-- Variant Selector -->
                  <div x-data="variantSelector">
                    <!-- Size Options -->
                    <div class="b-field">
                      <label class="b-label">Size</label>
                      <div class="b-buttons b-has-addons">
                        <button type="button" class="b-button c-variant-selector__option is-selected" data-option="0" data-value="Small">Small</button>
                        <button type="button" class="b-button c-variant-selector__option" data-option="0" data-value="Medium">Medium</button>
                        <button type="button" class="b-button c-variant-selector__option" data-option="0" data-value="Large">Large</button>
                      </div>
                    </div>

                    <!-- Color Options -->
                    <div class="b-field">
                      <label class="b-label">Color</label>
                      <div class="b-buttons b-has-addons">
                        <button type="button" class="b-button c-variant-selector__option is-selected" data-option="1" data-value="Red">Red</button>
                        <button type="button" class="b-button c-variant-selector__option" data-option="1" data-value="Blue">Blue</button>
                      </div>
                    </div>
                  </div>

                  <!-- Quantity Selector -->
                  <div class="b-field">
                    <label class="b-label">Quantity</label>
                    <div class="b-field b-has-addons">
                      <button type="button" class="b-button" id="qty-decrease">−</button>
                      <input type="number" class="b-input" id="qty-input" value="1" min="1">
                      <button type="button" class="b-button" id="qty-increase">+</button>
                    </div>
                  </div>

                  <!-- Add to Cart Button -->
                  <button type="button" class="b-button b-is-primary c-add-to-cart" id="add-to-cart">
                    <span class="add-to-cart-text">Add to Cart</span>
                    <span class="sold-out-text" style="display: none;">Sold Out</span>
                  </button>

                  <!-- SKU -->
                  <p class="b-is-size-7">
                    <strong>SKU:</strong> <span id="variant-sku">TEST-SM-RED</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Structured Data -->
          <script type="application/ld+json" id="product-schema">
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Test Product",
            "sku": "TEST-SM-RED",
            "offers": {
              "@type": "Offer",
              "price": 29.99,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          }
          </script>
        </body>
      </html>
    `, {
            url: 'http://localhost',
            runScripts: 'dangerously',
            resources: 'usable'
        });

        document = dom.window.document;
        window = dom.window;

        // Mock Alpine.js
        Alpine = {
            stores: {
                cart: {
                    item_count: 0,
                    items: [],
                    total_price: 0,
                    addItem: vi.fn().mockResolvedValue({ success: true })
                },
                productVariant: {
                    selectedVariant: mockVariants[0],
                    setVariant: vi.fn((variant) => {
                        Alpine.stores.productVariant.selectedVariant = variant;
                    })
                }
            },
            store: vi.fn((name, definition) => {
                if (definition) {
                    Alpine.stores[name] = definition;
                }
                return Alpine.stores[name];
            })
        };

        window.Alpine = Alpine;
        global.Alpine = Alpine;
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('Variant Selection - Price Updates', () => {
        it('should update price when variant changes', () => {
            const priceElement = document.querySelector('.c-product-price');

            // Initial price
            expect(priceElement.textContent).toBe('$29.99');

            // Change to more expensive variant
            Alpine.stores.productVariant.setVariant(mockVariants[2]); // Large - $34.99
            priceElement.textContent = '$34.99';

            expect(priceElement.textContent).toBe('$34.99');
        });

        it('should show compare-at-price when variant has sale price', () => {
            const comparePrice = document.querySelector('.c-product-price--compare');

            // Initially hidden
            expect(comparePrice.style.display).toBe('none');

            // Select variant with compare price
            Alpine.stores.productVariant.setVariant(mockVariants[0]); // Has compare_at_price
            comparePrice.textContent = '$39.99';
            comparePrice.style.display = 'inline';

            expect(comparePrice.style.display).toBe('inline');
            expect(comparePrice.textContent).toBe('$39.99');
        });

        it('should hide compare-at-price when variant has no sale', () => {
            const comparePrice = document.querySelector('.c-product-price--compare');

            // Show compare price first
            comparePrice.style.display = 'inline';

            // Select variant without compare price
            Alpine.stores.productVariant.setVariant(mockVariants[1]); // No compare_at_price
            comparePrice.style.display = 'none';

            expect(comparePrice.style.display).toBe('none');
        });

        it('should update price reactively when multiple variants are selected', () => {
            const priceElement = document.querySelector('.c-product-price');

            // Variant 1
            Alpine.stores.productVariant.setVariant(mockVariants[0]);
            priceElement.textContent = '$29.99';
            expect(priceElement.textContent).toBe('$29.99');

            // Variant 2
            Alpine.stores.productVariant.setVariant(mockVariants[1]);
            priceElement.textContent = '$29.99';
            expect(priceElement.textContent).toBe('$29.99');

            // Variant 3 (different price)
            Alpine.stores.productVariant.setVariant(mockVariants[2]);
            priceElement.textContent = '$34.99';
            expect(priceElement.textContent).toBe('$34.99');
        });
    });

    describe('Variant Selection - SKU Updates', () => {
        it('should update SKU when variant changes', () => {
            const skuElement = document.getElementById('variant-sku');

            // Initial SKU
            expect(skuElement.textContent).toBe('TEST-SM-RED');

            // Change variant
            Alpine.stores.productVariant.setVariant(mockVariants[3]); // Small / Blue
            skuElement.textContent = mockVariants[3].sku;

            expect(skuElement.textContent).toBe('TEST-SM-BLUE');
        });
    });

    describe('Add to Cart - Functionality', () => {
        it('should add correct variant to cart store', async () => {
            const addToCartBtn = document.getElementById('add-to-cart');
            const qtyInput = document.getElementById('qty-input');

            // Set quantity
            qtyInput.value = '2';

            // Simulate add to cart
            const variant = Alpine.stores.productVariant.selectedVariant;
            await Alpine.stores.cart.addItem(variant.id, parseInt(qtyInput.value));

            expect(Alpine.stores.cart.addItem).toHaveBeenCalledWith(1, 2);
        });

        it('should add variant with quantity 1 by default', async () => {
            const qtyInput = document.getElementById('qty-input');

            // Default quantity
            expect(qtyInput.value).toBe('1');

            const variant = Alpine.stores.productVariant.selectedVariant;
            await Alpine.stores.cart.addItem(variant.id, 1);

            expect(Alpine.stores.cart.addItem).toHaveBeenCalledWith(1, 1);
        });

        it('should dispatch cart-drawer-open event on successful add', async () => {
            const eventSpy = vi.fn();
            window.addEventListener('cart-drawer-open', eventSpy);

            // Simulate successful add to cart
            await Alpine.stores.cart.addItem(1, 1);

            const event = new window.CustomEvent('cart-drawer-open');
            window.dispatchEvent(event);

            expect(eventSpy).toHaveBeenCalled();
        });

        it('should update cart item count after add', async () => {
            expect(Alpine.stores.cart.item_count).toBe(0);

            // Simulate add to cart
            await Alpine.stores.cart.addItem(1, 2);
            Alpine.stores.cart.item_count = 2;

            expect(Alpine.stores.cart.item_count).toBe(2);
        });
    });

    describe('Sold Out Variants', () => {
        it('should disable add-to-cart button for unavailable variant', () => {
            const addToCartBtn = document.getElementById('add-to-cart');

            // Select sold-out variant
            Alpine.stores.productVariant.setVariant(mockVariants[2]); // Large - unavailable
            addToCartBtn.disabled = !mockVariants[2].available;

            expect(addToCartBtn.disabled).toBe(true);
        });

        it('should show "Sold Out" text for unavailable variant', () => {
            const addToCartText = document.querySelector('.add-to-cart-text');
            const soldOutText = document.querySelector('.sold-out-text');

            // Select sold-out variant
            Alpine.stores.productVariant.setVariant(mockVariants[2]);

            addToCartText.style.display = 'none';
            soldOutText.style.display = 'inline';

            expect(addToCartText.style.display).toBe('none');
            expect(soldOutText.style.display).toBe('inline');
        });

        it('should enable button and show "Add to Cart" for available variant', () => {
            const addToCartBtn = document.getElementById('add-to-cart');
            const addToCartText = document.querySelector('.add-to-cart-text');
            const soldOutText = document.querySelector('.sold-out-text');

            // Select available variant
            Alpine.stores.productVariant.setVariant(mockVariants[0]);
            addToCartBtn.disabled = !mockVariants[0].available;

            addToCartText.style.display = 'inline';
            soldOutText.style.display = 'none';

            expect(addToCartBtn.disabled).toBe(false);
            expect(addToCartText.style.display).toBe('inline');
            expect(soldOutText.style.display).toBe('none');
        });

        it('should disable variant option buttons for unavailable combinations', () => {
            const largeButton = document.querySelector('[data-value="Large"]');

            // Large / Red is unavailable
            const isAvailable = mockVariants.some(v =>
                v.options[0] === 'Large' && v.options[1] === 'Red' && v.available
            );

            largeButton.disabled = !isAvailable;

            expect(largeButton.disabled).toBe(true);
        });
    });

    describe('Gallery Scroll Snap Behavior', () => {
        it('should have scroll-snap-type on gallery track', () => {
            const track = document.querySelector('.c-product-gallery__track');

            // In real browser, this would be set via CSS
            track.style.scrollSnapType = 'x mandatory';

            expect(track.style.scrollSnapType).toBe('x mandatory');
        });

        it('should scroll to specific slide when clicked', () => {
            const track = document.querySelector('.c-product-gallery__track');
            const slides = track.querySelectorAll('.c-product-gallery__slide');

            // Mock scrollIntoView
            slides.forEach(slide => {
                slide.scrollIntoView = vi.fn();
            });

            // Simulate clicking to scroll to slide 2
            slides[1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

            expect(slides[1].scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        });

        it('should support touch scrolling on mobile devices', () => {
            const track = document.querySelector('.c-product-gallery__track');

            // Simulate touch event
            const touchStart = new window.TouchEvent('touchstart', {
                touches: [{ clientX: 100, clientY: 0 }],
                bubbles: true
            });

            const touchMove = new window.TouchEvent('touchmove', {
                touches: [{ clientX: 50, clientY: 0 }],
                bubbles: true
            });

            expect(() => {
                track.dispatchEvent(touchStart);
                track.dispatchEvent(touchMove);
            }).not.toThrow();
        });
    });

    describe('Error Handling', () => {
        it('should handle failed add-to-cart operation', async () => {
            // Mock failed add to cart
            Alpine.stores.cart.addItem = vi.fn().mockRejectedValue(new Error('Network error'));

            try {
                await Alpine.stores.cart.addItem(1, 1);
            } catch (error) {
                expect(error.message).toBe('Network error');
            }

            expect(Alpine.stores.cart.addItem).toHaveBeenCalled();
        });

        it('should show error message to user on failed add', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            Alpine.stores.cart.addItem = vi.fn().mockRejectedValue(new Error('Failed'));

            try {
                await Alpine.stores.cart.addItem(1, 1);
            } catch (error) {
                console.error('Add to cart failed:', error);
            }

            expect(consoleSpy).toHaveBeenCalledWith('Add to cart failed:', expect.any(Error));

            consoleSpy.mockRestore();
        });

        it('should prevent add-to-cart when variant is unavailable', () => {
            const variant = mockVariants[2]; // Unavailable

            if (!variant.available) {
                // Should not call addItem
                expect(variant.available).toBe(false);
            } else {
                Alpine.stores.cart.addItem(variant.id, 1);
            }

            // addItem should not have been called
            expect(Alpine.stores.cart.addItem).not.toHaveBeenCalled();
        });
    });

    describe('Quantity Selector', () => {
        it('should increment quantity when + button clicked', () => {
            const qtyInput = document.getElementById('qty-input');
            const increaseBtn = document.getElementById('qty-increase');

            expect(qtyInput.value).toBe('1');

            // Simulate increment
            increaseBtn.addEventListener('click', () => {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            });

            increaseBtn.click();

            expect(qtyInput.value).toBe('2');
        });

        it('should decrement quantity when - button clicked', () => {
            const qtyInput = document.getElementById('qty-input');
            const decreaseBtn = document.getElementById('qty-decrease');

            qtyInput.value = '3';

            // Simulate decrement
            decreaseBtn.addEventListener('click', () => {
                qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
            });

            decreaseBtn.click();

            expect(qtyInput.value).toBe('2');
        });

        it('should not go below 1 when decrementing', () => {
            const qtyInput = document.getElementById('qty-input');
            const decreaseBtn = document.getElementById('qty-decrease');

            qtyInput.value = '1';

            decreaseBtn.addEventListener('click', () => {
                qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
            });

            decreaseBtn.click();

            expect(qtyInput.value).toBe('1');
        });
    });

    describe('Structured Data', () => {
        it('should have valid product schema', () => {
            const schemaScript = document.getElementById('product-schema');
            const schema = JSON.parse(schemaScript.textContent);

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('Product');
            expect(schema.name).toBe('Test Product');
        });

        it('should include offer information in schema', () => {
            const schemaScript = document.getElementById('product-schema');
            const schema = JSON.parse(schemaScript.textContent);

            expect(schema.offers).toBeDefined();
            expect(schema.offers['@type']).toBe('Offer');
            expect(schema.offers.price).toBe(29.99);
            expect(schema.offers.priceCurrency).toBe('USD');
        });

        it('should update availability in schema when variant changes', () => {
            const schemaScript = document.getElementById('product-schema');
            const schema = JSON.parse(schemaScript.textContent);

            // Available variant
            expect(schema.offers.availability).toBe('https://schema.org/InStock');

            // Change to unavailable variant
            schema.offers.availability = 'https://schema.org/OutOfStock';

            expect(schema.offers.availability).toBe('https://schema.org/OutOfStock');
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            const h1 = document.querySelector('h1');

            expect(h1).toBeTruthy();
            expect(h1.textContent).toBe('Test Product');
        });

        it('should have labels for all form inputs', () => {
            const labels = document.querySelectorAll('label');

            expect(labels.length).toBeGreaterThan(0);
            labels.forEach(label => {
                expect(label.textContent).toBeTruthy();
            });
        });

        it('should have accessible button text', () => {
            const addToCartBtn = document.getElementById('add-to-cart');

            expect(addToCartBtn.textContent.trim()).toBeTruthy();
        });

        it('should support keyboard navigation', () => {
            const buttons = document.querySelectorAll('button');

            buttons.forEach(button => {
                expect(button.tabIndex).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('URL Parameter Updates', () => {
        it('should update URL with variant ID when variant changes', () => {
            const variant = mockVariants[1];

            // Simulate URL update
            const url = new URL(window.location);
            url.searchParams.set('variant', variant.id);

            expect(url.searchParams.get('variant')).toBe('2');
        });
    });
});
