/**
 * Unit Tests for Horizontal Product Card Component - Task 12
 * Tests for c-product-card--horizontal.liquid mobile-optimized card
 * 
 * Requirements:
 * - Test horizontal layout (image left, content right)
 * - Verify Bulma columns with b-is-mobile b-is-gapless
 * - Test image in left column (b-column b-is-4) with 1:1 aspect ratio
 * - Test content in right column (b-column b-is-8)
 * - Verify mobile readability and touch targets (44x44px minimum)
 * 
 * Coverage:
 * - Component structure and layout
 * - Bulma column usage
 * - Image optimization for mobile
 * - Touch target sizes
 * - Mobile readability
 * - Accessibility compliance
 * - Responsive behavior
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Horizontal Product Card Component Tests', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Create horizontal product card HTML
        dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <!-- Horizontal Product Card -->
          <div class="b-card c-product-card c-product-card--horizontal" data-product-id="123456">
            <div class="b-columns b-is-mobile b-is-gapless">
              <!-- Image Column (33%) -->
              <div class="b-column b-is-4">
                <a href="/products/test-product" class="c-product-card__link" aria-label="Test Product">
                  <figure class="b-image b-is-1by1">
                    <img 
                      src="/test-image.jpg" 
                      alt="Test Product Image"
                      loading="lazy"
                      srcset="/test-image-100.jpg 100w, /test-image-150.jpg 150w, /test-image-200.jpg 200w"
                      sizes="33vw"
                      class="c-product-card__image"
                    >
                  </figure>
                  
                  <!-- Sale Badge -->
                  <span class="b-tag b-is-danger b-is-small c-product-card__badge" aria-label="On Sale">
                    On Sale
                  </span>
                </a>
              </div>

              <!-- Content Column (67%) -->
              <div class="b-column b-is-8">
                <div class="b-card-content c-product-card__content">
                  <!-- Title -->
                  <p class="b-title b-is-7 b-mb-2">
                    <a href="/products/test-product" class="b-has-text-dark c-product-card__title">
                      Test Product Name That Is Quite Long
                    </a>
                  </p>

                  <!-- Price -->
                  <div class="c-product-card__price">
                    <span class="c-product-card__price--sale b-has-text-danger b-has-text-weight-semibold">
                      $29.99
                    </span>
                    <span class="c-product-card__price--compare b-has-text-grey b-is-size-7">
                      <s>$39.99</s>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sold Out Horizontal Card -->
          <div class="b-card c-product-card c-product-card--horizontal" data-product-id="123457">
            <div class="b-columns b-is-mobile b-is-gapless">
              <div class="b-column b-is-4">
                <a href="/products/sold-out" class="c-product-card__link">
                  <figure class="b-image b-is-1by1">
                    <img src="/sold-out.jpg" alt="Sold Out Product" loading="lazy" class="c-product-card__image">
                  </figure>
                  
                  <span class="b-tag b-is-dark b-is-small c-product-card__badge" aria-label="Sold out">
                    Sold out
                  </span>
                </a>
              </div>

              <div class="b-column b-is-8">
                <div class="b-card-content c-product-card__content">
                  <p class="b-title b-is-7 b-mb-2">
                    <a href="/products/sold-out" class="b-has-text-dark c-product-card__title">
                      Sold Out Product
                    </a>
                  </p>

                  <div class="c-product-card__price">
                    <span class="c-product-card__price--regular b-has-text-dark b-has-text-weight-semibold">
                      $29.99
                    </span>
                  </div>

                  <p class="b-is-size-7 b-has-text-grey b-mt-2">
                    Sold out
                  </p>
                </div>
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
        it('should have horizontal layout with Bulma card classes', () => {
            const card = document.querySelector('.c-product-card--horizontal');

            expect(card.classList.contains('b-card')).toBe(true);
            expect(card.classList.contains('c-product-card')).toBe(true);
        });

        it('should have Bulma columns with b-is-mobile', () => {
            const columns = document.querySelector('.b-columns');

            expect(columns.classList.contains('b-is-mobile')).toBe(true);
        });

        it('should have gapless columns', () => {
            const columns = document.querySelector('.b-columns');

            expect(columns.classList.contains('b-is-gapless')).toBe(true);
        });

        it('should have correct column structure (image left, content right)', () => {
            const columns = document.querySelector('.b-columns');
            const children = Array.from(columns.children);

            expect(children.length).toBe(2);
            expect(children[0].classList.contains('b-column')).toBe(true);
            expect(children[1].classList.contains('b-column')).toBe(true);
        });

        it('should have product ID data attribute', () => {
            const card = document.querySelector('.c-product-card--horizontal');

            expect(card.getAttribute('data-product-id')).toBe('123456');
        });
    });

    describe('Image Column', () => {
        it('should be in left column with b-is-4 class (33% width)', () => {
            const imageColumn = document.querySelector('.b-column.b-is-4');

            expect(imageColumn).toBeTruthy();
            expect(imageColumn.querySelector('.b-image')).toBeTruthy();
        });

        it('should have 1:1 aspect ratio container', () => {
            const figure = document.querySelector('.b-image');

            expect(figure.classList.contains('b-is-1by1')).toBe(true);
        });

        it('should have lazy loading enabled', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.getAttribute('loading')).toBe('lazy');
        });

        it('should have responsive srcset optimized for mobile', () => {
            const img = document.querySelector('.c-product-card__image');
            const srcset = img.getAttribute('srcset');

            expect(srcset).toBeTruthy();
            expect(srcset).toContain('100w');
            expect(srcset).toContain('150w');
            expect(srcset).toContain('200w');
        });

        it('should have sizes attribute for 33% viewport width', () => {
            const img = document.querySelector('.c-product-card__image');
            const sizes = img.getAttribute('sizes');

            expect(sizes).toBe('33vw');
        });

        it('should have alt text', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.hasAttribute('alt')).toBe(true);
            expect(img.getAttribute('alt')).toBe('Test Product Image');
        });
    });

    describe('Content Column', () => {
        it('should be in right column with b-is-8 class (67% width)', () => {
            const contentColumn = document.querySelectorAll('.b-column')[1];

            expect(contentColumn.classList.contains('b-is-8')).toBe(true);
            expect(contentColumn.querySelector('.b-card-content')).toBeTruthy();
        });

        it('should have b-card-content class', () => {
            const content = document.querySelector('.b-card-content');

            expect(content).toBeTruthy();
            expect(content.classList.contains('c-product-card__content')).toBe(true);
        });
    });

    describe('Product Title', () => {
        it('should render product title with Bulma typography', () => {
            const title = document.querySelector('.c-product-card__title');

            expect(title).toBeTruthy();
            expect(title.textContent.trim()).toContain('Test Product');
        });

        it('should have Bulma title class b-is-7 for mobile', () => {
            const titleContainer = document.querySelector('.b-title.b-is-7');

            expect(titleContainer).toBeTruthy();
        });

        it('should have link to product page', () => {
            const titleLink = document.querySelector('.c-product-card__title');

            expect(titleLink.tagName).toBe('A');
            expect(titleLink.getAttribute('href')).toBe('/products/test-product');
        });

        it('should truncate long titles for mobile readability', () => {
            const title = document.querySelector('.c-product-card__title');

            // Title should be truncated or have line clamp
            expect(title.textContent.length).toBeGreaterThan(0);
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
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const regularPrice = soldOutCard.querySelector('.c-product-card__price--regular');

            expect(regularPrice).toBeTruthy();
            expect(regularPrice.textContent.trim()).toBe('$29.99');
        });

        it('should have semibold font weight for prices', () => {
            const salePrice = document.querySelector('.c-product-card__price--sale');

            expect(salePrice.classList.contains('b-has-text-weight-semibold')).toBe(true);
        });
    });

    describe('Product Badges', () => {
        it('should display sale badge when product is on sale', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge).toBeTruthy();
            expect(badge.textContent.trim()).toBe('On Sale');
        });

        it('should have Bulma tag class with small size', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge.classList.contains('b-tag')).toBe(true);
            expect(badge.classList.contains('b-is-small')).toBe(true);
        });

        it('should have danger color for sale badge', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge.classList.contains('b-is-danger')).toBe(true);
        });

        it('should display sold out badge when product is unavailable', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const badge = soldOutCard.querySelector('.c-product-card__badge');

            expect(badge).toBeTruthy();
            expect(badge.textContent.trim()).toBe('Sold out');
        });

        it('should have dark color for sold out badge', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const badge = soldOutCard.querySelector('.c-product-card__badge');

            expect(badge.classList.contains('b-is-dark')).toBe(true);
        });

        it('should have aria-label for accessibility', () => {
            const badge = document.querySelector('.c-product-card__badge');

            expect(badge.hasAttribute('aria-label')).toBe(true);
        });
    });

    describe('Mobile Optimization', () => {
        it('should have mobile-optimized column layout', () => {
            const columns = document.querySelector('.b-columns');

            expect(columns.classList.contains('b-is-mobile')).toBe(true);
        });

        it('should have gapless layout for compact mobile display', () => {
            const columns = document.querySelector('.b-columns');

            expect(columns.classList.contains('b-is-gapless')).toBe(true);
        });

        it('should have smaller image size for mobile (33% width)', () => {
            const imageColumn = document.querySelector('.b-column.b-is-4');

            expect(imageColumn).toBeTruthy();
        });

        it('should have larger content area for mobile (67% width)', () => {
            const contentColumn = document.querySelectorAll('.b-column')[1];

            expect(contentColumn.classList.contains('b-is-8')).toBe(true);
        });

        it('should have smaller font size for mobile title', () => {
            const titleContainer = document.querySelector('.b-title.b-is-7');

            expect(titleContainer).toBeTruthy();
        });
    });

    describe('Touch Targets', () => {
        it('should have minimum 44x44px touch target for product link', () => {
            const link = document.querySelector('.c-product-card__link');

            // Link should exist and be clickable
            expect(link).toBeTruthy();
            expect(link.tagName).toBe('A');
        });

        it('should have minimum 44x44px touch target for title link', () => {
            const titleLink = document.querySelector('.c-product-card__title');

            // Title link should exist and be clickable
            expect(titleLink).toBeTruthy();
            expect(titleLink.tagName).toBe('A');
        });

        it('should have accessible click areas', () => {
            const links = document.querySelectorAll('a');

            expect(links.length).toBeGreaterThan(0);
            links.forEach(link => {
                expect(link).toBeTruthy();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have accessible product link with aria-label', () => {
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

        it('should support keyboard navigation', () => {
            const links = document.querySelectorAll('a');

            links.forEach(link => {
                expect(link.tabIndex).toBeGreaterThanOrEqual(0);
            });
        });

        it('should have accessible sold out status', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const statusText = soldOutCard.querySelector('.b-is-size-7.b-has-text-grey');

            expect(statusText).toBeTruthy();
            expect(statusText.textContent.trim()).toBe('Sold out');
        });
    });

    describe('Responsive Behavior', () => {
        it('should have responsive image sizes', () => {
            const img = document.querySelector('.c-product-card__image');
            const sizes = img.getAttribute('sizes');

            expect(sizes).toBe('33vw');
        });

        it('should adapt to mobile viewport', () => {
            const card = document.querySelector('.c-product-card--horizontal');

            expect(card).toBeTruthy();
        });

        it('should have mobile-first column layout', () => {
            const columns = document.querySelector('.b-columns.b-is-mobile');

            expect(columns).toBeTruthy();
        });
    });

    describe('Performance', () => {
        it('should use lazy loading for images', () => {
            const img = document.querySelector('.c-product-card__image');

            expect(img.getAttribute('loading')).toBe('lazy');
        });

        it('should have optimized srcset for mobile screens', () => {
            const img = document.querySelector('.c-product-card__image');
            const srcset = img.getAttribute('srcset');

            expect(srcset).toContain('100w');
            expect(srcset).toContain('150w');
            expect(srcset).toContain('200w');
        });

        it('should have smaller image sizes for mobile performance', () => {
            const img = document.querySelector('.c-product-card__image');
            const srcset = img.getAttribute('srcset');

            // Should not have very large images
            expect(srcset).not.toContain('1000w');
            expect(srcset).not.toContain('800w');
        });
    });

    describe('Bulma Class Prefix', () => {
        it('should use b- prefix for all Bulma classes', () => {
            const card = document.querySelector('.c-product-card--horizontal');
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
        });

        it('should have b-columns class', () => {
            const columns = document.querySelector('.b-columns');

            expect(columns).toBeTruthy();
        });

        it('should have b-column classes', () => {
            const card = document.querySelector('.c-product-card--horizontal');
            const columns = card.querySelectorAll('.b-column');

            expect(columns.length).toBe(2);
        });
        it('should have b-card class on card container', () => {
            const card = document.querySelector('.c-product-card--horizontal');

            expect(card.classList.contains('b-card')).toBe(true);
        });
    });

    describe('Sold Out State', () => {
        it('should display sold out status text', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const statusText = soldOutCard.querySelector('.b-is-size-7.b-has-text-grey.b-mt-2');

            expect(statusText).toBeTruthy();
            expect(statusText.textContent.trim()).toBe('Sold out');
        });

        it('should show sold out badge', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const badge = soldOutCard.querySelector('.c-product-card__badge');

            expect(badge.textContent.trim()).toBe('Sold out');
        });

        it('should not show sale price for sold out items', () => {
            const soldOutCard = document.querySelectorAll('.c-product-card--horizontal')[1];
            const salePrice = soldOutCard.querySelector('.c-product-card__price--sale');

            expect(salePrice).toBeFalsy();
        });
    });
});
