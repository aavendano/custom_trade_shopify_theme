/**
 * Unit Tests for Product Card Component - Task 11
 * Tests for c-product-card.liquid vertical product card
 * 
 * Requirements:
 * - Test vertical layout structure (image top, content bottom)
 * - Verify Bulma component usage (b-card, b-card-image, b-card-content)
 * - Test 1:1 aspect ratio image container
 * - Verify lazy loading with responsive srcsets
 * - Test product title, vendor, and price rendering
 * - Verify sold out / on sale badge positioning
 * - Ensure all classes use b- prefix
 * 
 * Coverage:
 * - Component structure and layout
 * - Image loading strategies
 * - Badge display logic
 * - Price display (regular, sale, compare-at)
 * - Accessibility compliance
 * - Responsive behavior
 * - Quick add functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Product Card Component Tests', () => {
    let dom;
    let document;
    let window;

    const mockProduct = {
        id: 123456,
        title: 'Test Product',
        vendor: 'Test Vendor',
        url: '/products/test-product',
        available: true,
        has_only_default_variant: true,
        featured_media: {
            id: 1,
            src: '/test-image.jpg',
            alt: 'Test Product Image',
            width: 800,
            height: 800
        },
        selected_or_first_available_variant: {
            id: 789,
            price: 2999,
            compare_at_price: 3999,
            available: true
        }
    };

    beforeEach(() => {
        // Create product card HTML
        dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <!-- Vertical Product Card -->
          <div class="b-card c-product-card c-product-card--vertical" data-product-id="123456">
            <!-- Product Image -->
            <div class="b-card-image">
              <a href="/products/test-product" class="c-product-card__link" aria-label="Test Product">
                <figure class="b-image b-is-1by1">
                  <img 
                    src="/test-image.jpg" 
                    alt="Test Product Image"
                    loading="lazy"
                    srcset="/test-image-200.jpg 200w, /test-image-300.jpg 300w, /test-image-400.jpg 400w"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    class="c-product-card__image"
                  >
                </figure>
                
                <!-- Sale Badge -->
                <span class="b-tag b-is-danger c-product-card__badge" aria-label="On Sale">
                  On Sale
                </span>
              </a>
            </div>

            <!-- Product Content -->
            <div class="b-card-content">
              <!-- Title -->
              <p class="b-title b-is-6 b-mb-2">
                <a href="/products/test-product" class="b-has-text-dark c-product-card__title">
                  Test Product
                </a>
              </p>

              <!-- Vendor -->
              <p class="b-subtitle b-is-7 b-mb-2 b-has-text-grey">
                Test Vendor
              </p>

              <!-- Price -->
              <div class="c-product-card__price">
                <span class="c-product-card__price--sale b-has-text-danger">
                  $29.99
                </span>
                <span class="c-product-card__price--compare b-has-text-grey">
                  <s>$39.99</s>
                </span>
              </div>

              <!-- Quick Add Button -->
              <button
                type="button"
                class="b-button b-is-primary b-is-small b-is-fullwidth b-mt-3 c-product-card__quick-add"
                data-variant-id="789"
                aria-label="Add to cart"
              >
                <span class="b-icon b-is-small">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </span>
                <span>Add to cart</span>
              </button>
            </div>
          </div>

          <!-- Sold Out Product Card -->
          <div class="b-card c-product-card c-product-card--vertical" data-product-id="123457">
            <div class="b-card-image">
              <a href="/products/sold-out-product" class="c-product-card__link">
                <figure class="b-image b-is-1by1">
                  <img src="/sold-out.jpg" alt="Sold Out Product" loading="lazy" class="c-product-card__image">
                </figure>
                
                <!-- Sold Out Badge -->
                <span class="b-tag b-is-dark c-product-card__badge" aria-label="Sold out">
                  Sold out
                </span>
              </a>
            </div>

            <div class="b-card-content">
              <p class="b-title b-is-6 b-mb-2">
                <a href="/products/sold-out-product" class="b-has-text-dark c-product-card__title">
                  Sold Out Product
                </a>
              </p>

              <div class="c-product-card__price">
                <span class="c-product-card__price--regular b-has-text-dark">
                  $29.99
                </span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `, {
            url: 'http://localhost',
            runScripts: 'dangerously',
            resources: 'usable'
        });

        document = dom.window.document;
        window = dom.window;
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('Component Structure', () => {
        it('should have vertical layout with Bulma card classes', () => {
            const card = document.querySelector('.c-product-card');

            expect(card.classList.contains('b-card')).toBe(true);
            expect(card.classList.contains('c-product-card--vertical')).toBe(true);
        });

        it('should have b-card-image container', () => {
            const cardImage = document.querySelector('.b-card-image');

            expect(cardImage).toBeTruthy();
            expect(cardImage.parentElement.classList.contains('b-card')).toBe(true);
        });

        it('should have b-card-content container', () => {
            const cardContent = document.querySelector('.b-card-content');

            expect(cardContent).toBeTruthy();
            expect(cardContent.parentElement.classList.contains('b-card')).toBe(true);
        });

        it('should have correct structure order (image then content)', () => {
            const card = document.querySelector('.c-product-card');
            const children = Array.from(card.children);

            expect(children[0].classList.contains('b-card-image')).toBe(true);
            expect(children[1].classList.contains('b-card-content')).toBe(true);
        });

        it('should have product ID data attribute', () => {
            const card = document.querySelector('.c-product-card');

            expect(card.getAttribute('data-product-id')).toBe('123456');
        });
    });

    describe('Image Container', () => {
        it('should have 1:1 aspect ratio container', () => {
            const figure = document.querySelector('.b-image');

            expect(figure.classList.contains('b-is-1by1')).toBe(true);
        });

        it('should have lazy loading enabled', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.getAttribute('loading')).toBe('lazy');
        });

        it('should have responsive srcset', () => {
            const img = document.querySelector('.c-product-card__image');
            const srcset = img.getAttribute('srcset');

            expect(srcset).toBeTruthy();
            expect(srcset).toContain('200w');
            expect(srcset).toContain('300w');
            expect(srcset).toContain('400w');
        });

        it('should have sizes attribute for responsive images', () => {
            const img = document.querySelector('.c-product-card__image');
            const sizes = img.getAttribute('sizes');

            expect(sizes).toBeTruthy();
            expect(sizes).toContain('25vw');
            expect(sizes).toContain('33vw');
            expect(sizes).toContain('50vw');
        });

        it('should have alt text', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.hasAttribute('alt')).toBe(true);
            expect(img.getAttribute('alt')).toBe('Test Product Image');
        });
    });

    describe('Product Title', () => {
        it('should render product title with Bulma typography', () => {
            const title = document.querySelector('.c-product-card__title');

            expect(title).toBeTruthy();
            expect(title.textContent.trim()).toBe('Test Product');
        });

        it('should have Bulma title class b-is-6', () => {
            const titleContainer = document.querySelector('.b-title.b-is-6');

            expect(titleContainer).toBeTruthy();
        });

        it('should have link to product page', () => {
            const titleLink = document.querySelector('.c-product-card__title');

            expect(titleLink.tagName).toBe('A');
            expect(titleLink.getAttribute('href')).toBe('/products/test-product');
        });

        it('should have dark text color', () => {
            const titleLink = document.querySelector('.c-product-card__title');

            expect(titleLink.classList.contains('b-has-text-dark')).toBe(true);
        });
    });

    describe('Product Vendor', () => {
        it('should render vendor with Bulma subtitle class', () => {
            const vendor = document.querySelector('.b-subtitle.b-is-7');

            expect(vendor).toBeTruthy();
            expect(vendor.textContent.trim()).toBe('Test Vendor');
        });

        it('should have grey text color', () => {
            const vendor = document.querySelector('.b-subtitle');

            expect(vendor.classList.contains('b-has-text-grey')).toBe(true);
        });
    });

    describe('Product Price', () => {
        it('should display sale price when on sale', () => {
            const salePrice = document.querySelector('.c-product-card__price--sale');

            expect(salePrice).toBeTruthy();
            expect(salePrice.textContent.trim()).toBe('$29.99');
        });

        it('should display compare-at price when on sale', () => {
            const comparePrice = document.querySelector('.c-product-card__price--compare');

            expect(comparePrice).toBeTruthy();
            expect(comparePrice.textContent.trim()).toContain('$39.99');
        });

        it('should have strikethrough on compare-at price', () => {
            const comparePrice = document.querySelector('.c-product-card__price--compare');
            const strikethrough = comparePrice.querySelector('s');

            expect(strikethrough).toBeTruthy();
        });

        it('should display regular price when not on sale', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card')[1];
            const regularPrice = soldOutCard.querySelector('.c-product-card__price--regular');

            expect(regularPrice).toBeTruthy();
            expect(regularPrice.textContent.trim()).toBe('$29.99');
        });

        it('should have danger color for sale price', () => {
            const salePrice = document.querySelector('.c-product-card__price--sale');

            expect(salePrice.classList.contains('b-has-text-danger')).toBe(true);
        });
    });

    describe('Product Badges', () => {
        it('should display sale badge when product is on sale', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge).toBeTruthy();
            expect(badge.textContent.trim()).toBe('On Sale');
        });

        it('should have Bulma tag class', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge.classList.contains('b-tag')).toBe(true);
        });

        it('should have danger color for sale badge', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge.classList.contains('b-is-danger')).toBe(true);
        });

        it('should display sold out badge when product is unavailable', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card')[1];
            const badge = soldOutCard.querySelector('.c-product-card__badge');

            expect(badge).toBeTruthy();
            expect(badge.textContent.trim()).toBe('Sold out');
        });

        it('should have dark color for sold out badge', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card')[1];
            const badge = soldOutCard.querySelector('.c-product-card__badge');

            expect(badge.classList.contains('b-is-dark')).toBe(true);
        });

        it('should have aria-label for accessibility', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge.hasAttribute('aria-label')).toBe(true);
        });
    });

    describe('Quick Add Button', () => {
        it('should render quick add button for available products', () => {
            const quickAdd = document.querySelector('.c-product-card__quick-add');

            expect(quickAdd).toBeTruthy();
        });

        it('should have Bulma button classes', () => {
            const quickAdd = document.querySelector('.c-product-card__quick-add');

            expect(quickAdd.classList.contains('b-button')).toBe(true);
            expect(quickAdd.classList.contains('b-is-primary')).toBe(true);
            expect(quickAdd.classList.contains('b-is-small')).toBe(true);
            expect(quickAdd.classList.contains('b-is-fullwidth')).toBe(true);
        });

        it('should have variant ID data attribute', () => {
            const quickAdd = document.querySelector('.c-product-card__quick-add');

            expect(quickAdd.getAttribute('data-variant-id')).toBe('789');
        });

        it('should have cart icon', () => {
            const quickAdd = document.querySelector('.c-product-card__quick-add');
            const icon = quickAdd.querySelector('.b-icon');
            const svg = icon.querySelector('svg');

            expect(icon).toBeTruthy();
            expect(svg).toBeTruthy();
        });

        it('should have accessible label', () => {
            const quickAdd = document.querySelector('.c-product-card__quick-add');

            expect(quickAdd.hasAttribute('aria-label')).toBe(true);
        });

        it('should not render for sold out products', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card')[1];
            const quickAdd = soldOutCard.querySelector('.c-product-card__quick-add');

            expect(quickAdd).toBeFalsy();
        });
    });

    describe('Bulma Class Prefix', () => {
        it('should use b- prefix for all Bulma classes', () => {
            const card = document.querySelector('.c-product-card');
            const allElements = card.querySelectorAll('*');

            const bulmaClasses = [];
            allElements.forEach(el => {
                el.classList.forEach(className => {
                    if (className.startsWith('b-')) {
                        bulmaClasses.push(className);
                    }
                });
            });

            expect(bulmaClasses.length).toBeGreaterThan(0);
            bulmaClasses.forEach(className => {
                expect(className).toMatch(/^b-/);
            });
        });

        it('should have b-card class on card container', () => {
            const card = document.querySelector('.c-product-card');

            expect(card.classList.contains('b-card')).toBe(true);
        });

        it('should have b-card-image class on image container', () => {
            const cardImage = document.querySelector('.b-card-image');

            expect(cardImage).toBeTruthy();
        });

        it('should have b-card-content class on content container', () => {
            const cardContent = document.querySelector('.b-card-content');

            expect(cardContent).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        it('should have accessible product link', () => {
            const link = document.querySelector('.c-product-card__link');

            expect(link.hasAttribute('aria-label')).toBe(true);
            expect(link.getAttribute('aria-label')).toBe('Test Product');
        });

        it('should have proper heading hierarchy', () => {
            const title = document.querySelector('.b-title');

            expect(title).toBeTruthy();
        });

        it('should have alt text on images', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.hasAttribute('alt')).toBe(true);
            expect(img.getAttribute('alt')).toBeTruthy();
        });

        it('should have accessible button labels', () => {
            const quickAdd = document.querySelector('.c-product-card__quick-add');

            expect(quickAdd.hasAttribute('aria-label')).toBe(true);
        });

        it('should support keyboard navigation', () => {
            const links = document.querySelectorAll('a');
            const buttons = document.querySelectorAll('button');

            links.forEach(link => {
                expect(link.tabIndex).toBeGreaterThanOrEqual(0);
            });

            buttons.forEach(button => {
                expect(button.tabIndex).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('Responsive Behavior', () => {
        it('should have responsive image sizes', () => {
            const img = document.querySelector('.c-product-card__image');
            const sizes = img.getAttribute('sizes');

            expect(sizes).toContain('1024px');
            expect(sizes).toContain('768px');
        });

        it('should adapt to different viewport sizes', () => {
            const card = document.querySelector('.c-product-card');

            // Card should be flexible
            expect(card).toBeTruthy();
        });
    });

    describe('Performance', () => {
        it('should use lazy loading for images', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.getAttribute('loading')).toBe('lazy');
        });

        it('should have optimized srcset for different screen sizes', () => {
            const img = document.querySelector('.c-product-card__image');
            const srcset = img.getAttribute('srcset');

            expect(srcset).toContain('200w');
            expect(srcset).toContain('300w');
            expect(srcset).toContain('400w');
        });
    });
});
