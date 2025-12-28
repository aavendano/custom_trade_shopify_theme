/**
 * Unit Tests for Featured Collection Section - Task 14
 * Tests for sections/featured-collection.liquid
 * 
 * Requirements:
 * - Verify c-product-card.liquid is rendered
 * - Test Bulma columns for product grid layout
 * - Verify mobile, tablet, and desktop responsiveness
 * - Test various product states (sold out, on sale, available)
 * - Verify quick-add functionality integration
 * 
 * Coverage:
 * - Product card rendering
 * - Bulma column classes
 * - Responsive layout
 * - Empty state handling
 * - View all button
 * - Section settings
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Featured Collection Section Tests', () => {
    let liquidTemplate;

    beforeEach(() => {
        // Read the Liquid template
        const templatePath = path.resolve(__dirname, '../../sections/featured-collection.liquid');
        liquidTemplate = fs.readFileSync(templatePath, 'utf-8');
    });

    describe('Template Structure', () => {
        it('should have featured collection section wrapper', () => {
            expect(liquidTemplate).toContain('c-featured-collection');
            expect(liquidTemplate).toContain('b-section');
        });

        it('should use Bulma container', () => {
            expect(liquidTemplate).toContain('b-container');
        });

        it('should have section header', () => {
            expect(liquidTemplate).toContain('c-featured-collection__header');
            expect(liquidTemplate).toContain('b-title');
        });

        it('should have product grid with Bulma columns', () => {
            expect(liquidTemplate).toContain('b-columns');
            expect(liquidTemplate).toContain('b-is-multiline');
            expect(liquidTemplate).toContain('b-is-mobile');
        });
    });

    describe('Product Card Integration', () => {
        it('should render c-product-card snippet', () => {
            expect(liquidTemplate).toContain("render 'c-product-card'");
        });

        it('should not reference old card-product snippet', () => {
            expect(liquidTemplate).not.toContain("card-product");
        });

        it('should pass product to card', () => {
            expect(liquidTemplate).toContain('product: product');
        });

        it('should pass lazy_load parameter', () => {
            expect(liquidTemplate).toContain('lazy_load:');
        });

        it('should pass show_vendor parameter', () => {
            expect(liquidTemplate).toContain('show_vendor:');
        });

        it('should pass image_ratio parameter', () => {
            expect(liquidTemplate).toContain('image_ratio:');
        });

        it('should pass enable_quick_add parameter', () => {
            expect(liquidTemplate).toContain('enable_quick_add:');
        });
    });

    describe('Bulma Column Classes', () => {
        it('should have mobile column classes', () => {
            expect(liquidTemplate).toContain('b-is-12-mobile');
            expect(liquidTemplate).toContain('b-is-6-mobile');
        });

        it('should have tablet column classes', () => {
            expect(liquidTemplate).toContain('b-is-6-tablet');
            expect(liquidTemplate).toContain('b-is-4-tablet');
            expect(liquidTemplate).toContain('b-is-3-tablet');
            expect(liquidTemplate).toContain('b-is-12-tablet');
        });

        it('should have desktop column classes', () => {
            expect(liquidTemplate).toContain('b-is-3-desktop');
            expect(liquidTemplate).toContain('b-is-4-desktop');
            expect(liquidTemplate).toContain('b-is-6-desktop');
            expect(liquidTemplate).toContain('b-is-12-desktop');
            expect(liquidTemplate).toContain('b-is-2-desktop');
        });

        it('should calculate column classes based on settings', () => {
            expect(liquidTemplate).toContain('assign column_classes');
            expect(liquidTemplate).toContain('mobile_column_class');
            expect(liquidTemplate).toContain('tablet_column_class');
            expect(liquidTemplate).toContain('desktop_column_class');
        });
    });

    describe('Responsive Layout', () => {
        it('should support 1-6 columns on desktop', () => {
            expect(liquidTemplate).toContain('columns_desktop');
            expect(liquidTemplate).toContain('case columns_desktop');
        });

        it('should support 1-4 columns on tablet', () => {
            expect(liquidTemplate).toContain('columns_tablet');
        });

        it('should support 1-2 columns on mobile', () => {
            expect(liquidTemplate).toContain('columns_mobile');
        });

        it('should have responsive spacing styles', () => {
            expect(liquidTemplate).toContain('@media (max-width: 768px)');
            expect(liquidTemplate).toContain('@media (min-width: 769px)');
        });
    });

    describe('Image Ratio Mapping', () => {
        it('should map square to 1by1', () => {
            expect(liquidTemplate).toContain("when 'square'");
            expect(liquidTemplate).toContain("assign bulma_ratio = '1by1'");
        });

        it('should map portrait to 3by4', () => {
            expect(liquidTemplate).toContain("when 'portrait'");
            expect(liquidTemplate).toContain("assign bulma_ratio = '3by4'");
        });

        it('should have default ratio', () => {
            expect(liquidTemplate).toContain('image_ratio');
            expect(liquidTemplate).toContain('bulma_ratio');
        });
    });

    describe('Section Settings', () => {
        it('should have collection setting', () => {
            expect(liquidTemplate).toContain('"type": "collection"');
            expect(liquidTemplate).toContain('"id": "collection"');
        });

        it('should have products_to_show setting', () => {
            expect(liquidTemplate).toContain('"id": "products_to_show"');
            expect(liquidTemplate).toContain('"min": 2');
            expect(liquidTemplate).toContain('"max": 25');
        });

        it('should have columns_desktop setting', () => {
            expect(liquidTemplate).toContain('"id": "columns_desktop"');
            expect(liquidTemplate).toContain('"min": 1');
            expect(liquidTemplate).toContain('"max": 6');
        });

        it('should have columns_tablet setting', () => {
            expect(liquidTemplate).toContain('"id": "columns_tablet"');
        });

        it('should have columns_mobile setting', () => {
            expect(liquidTemplate).toContain('"id": "columns_mobile"');
        });

        it('should have quick_add setting', () => {
            expect(liquidTemplate).toContain('"id": "quick_add"');
        });

        it('should have show_vendor setting', () => {
            expect(liquidTemplate).toContain('"id": "show_vendor"');
        });

        it('should have image_ratio setting', () => {
            expect(liquidTemplate).toContain('"id": "image_ratio"');
        });
    });

    describe('View All Button', () => {
        it('should have view all button', () => {
            expect(liquidTemplate).toContain('show_view_all');
            expect(liquidTemplate).toContain('sections.featured_collection.view_all');
        });

        it('should support different button styles', () => {
            expect(liquidTemplate).toContain('view_all_style');
            expect(liquidTemplate).toContain('b-is-primary');
            expect(liquidTemplate).toContain('b-is-outlined');
            expect(liquidTemplate).toContain('b-is-text');
        });

        it('should only show when there are more products', () => {
            expect(liquidTemplate).toContain('more_in_collection');
            expect(liquidTemplate).toContain('products_count');
        });
    });

    describe('Empty State', () => {
        it('should have empty state notification', () => {
            expect(liquidTemplate).toContain('b-notification');
            expect(liquidTemplate).toContain('sections.featured_collection.no_products');
        });

        it('should show empty state when no products', () => {
            expect(liquidTemplate).toContain('collection.products.size > 0');
        });
    });

    describe('Pagination', () => {
        it('should use paginate tag', () => {
            expect(liquidTemplate).toContain('{%- paginate');
            expect(liquidTemplate).toContain('collection.products');
            expect(liquidTemplate).toContain('products_to_show');
        });

        it('should render pagination snippet', () => {
            expect(liquidTemplate).toContain("{% render 'pagination'");
        });

        it('should only show pagination when multiple pages', () => {
            expect(liquidTemplate).toContain('paginate.pages > 1');
        });
    });

    describe('Lazy Loading', () => {
        it('should lazy load products after first 4', () => {
            expect(liquidTemplate).toContain('forloop.index > 4');
            expect(liquidTemplate).toContain('lazy_load:');
        });
    });

    describe('Quick Add Integration', () => {
        it('should enable quick add based on setting', () => {
            expect(liquidTemplate).toContain('enable_quick_add');
            expect(liquidTemplate).toContain("section.settings.quick_add == 'none'");
        });

        it('should pass quick add to product card', () => {
            expect(liquidTemplate).toContain('enable_quick_add: enable_quick_add');
        });
    });

    describe('Styling', () => {
        it('should have equal height cards', () => {
            expect(liquidTemplate).toContain('align-items: stretch');
        });

        it('should have responsive spacing', () => {
            expect(liquidTemplate).toContain('margin-left');
            expect(liquidTemplate).toContain('margin-right');
            expect(liquidTemplate).toContain('padding');
        });

        it('should support padding settings', () => {
            expect(liquidTemplate).toContain('padding_top');
            expect(liquidTemplate).toContain('padding_bottom');
            expect(liquidTemplate).toContain('padding-top:');
            expect(liquidTemplate).toContain('padding-bottom:');
        });
    });

    describe('Accessibility', () => {
        it('should have aria-label on view all button', () => {
            expect(liquidTemplate).toContain('aria-label');
            expect(liquidTemplate).toContain('sections.featured_collection.view_all_label');
        });

        it('should have proper heading structure', () => {
            expect(liquidTemplate).toContain('<h2');
            expect(liquidTemplate).toContain('b-title');
        });
    });

    describe('Schema', () => {
        it('should have valid JSON schema', () => {
            const schemaMatch = liquidTemplate.match(/{% schema %}([\s\S]*?){% endschema %}/);
            expect(schemaMatch).toBeTruthy();

            const schemaJson = schemaMatch[1].trim();
            expect(() => JSON.parse(schemaJson)).not.toThrow();
        });

        it('should have section name', () => {
            expect(liquidTemplate).toContain('"name": "t:sections.featured-collection.name"');
        });

        it('should have section tag', () => {
            expect(liquidTemplate).toContain('"tag": "section"');
        });

        it('should have presets', () => {
            expect(liquidTemplate).toContain('"presets"');
            expect(liquidTemplate).toContain('"category": "Collections"');
        });

        it('should be disabled on header and footer', () => {
            expect(liquidTemplate).toContain('"disabled_on"');
            expect(liquidTemplate).toContain('"groups": ["header", "footer"]');
        });
    });

    describe('Bulma Class Prefix', () => {
        it('should use b- prefix for all Bulma classes', () => {
            const bulmaClasses = liquidTemplate.match(/class="[^"]*\bb-[a-z-]+/g);
            expect(bulmaClasses).toBeTruthy();
            expect(bulmaClasses.length).toBeGreaterThan(0);
        });

        it('should not use unprefixed Bulma classes in HTML', () => {
            // Extract only HTML content (before schema)
            const htmlContent = liquidTemplate.split('{% schema %}')[0];

            // Check for actual HTML class attributes with unprefixed Bulma classes
            expect(htmlContent).not.toMatch(/class="[^"]*\s+columns\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+column\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+container\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+title\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+button\s+/);
        });
    });

    describe('Full Width Support', () => {
        it('should support full width container', () => {
            expect(liquidTemplate).toContain('full_width');
            expect(liquidTemplate).toContain('b-is-fluid');
        });
    });
});
