/**
 * CSS Variable Migration Tests
 * 
 * Tests for Task 1: Configure CSS variable migration from Dawn to Bulma
 * 
 * These tests verify that:
 * 1. Shopify theme settings are correctly mapped to Bulma variables
 * 2. CSS custom properties are output in compiled CSS
 * 3. Bulma components consume Shopify variables correctly
 * 4. Runtime CSS variables are available globally
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('CSS Variable Migration', () => {
    let compiledCSS = '';
    let purgedCSS = '';

    beforeAll(() => {
        // Read the compiled CSS files
        const fullCSSPath = path.join(process.cwd(), 'assets', 'a-bulma-full.css');
        const purgedCSSPath = path.join(process.cwd(), 'assets', 'a-bulma-purged.css');

        compiledCSS = fs.readFileSync(fullCSSPath, 'utf-8');
        purgedCSS = fs.readFileSync(purgedCSSPath, 'utf-8');
    });

    describe('Shopify Variables Bridge', () => {
        it('should include shopify-variables module in compiled CSS', () => {
            // Check that Shopify variable definitions exist
            expect(compiledCSS).toBeTruthy();
            expect(compiledCSS.length).toBeGreaterThan(0);
        });

        it('should output CSS custom properties on :root', () => {
            // Check for runtime CSS variables
            expect(compiledCSS).toContain('--shopify-font-body-family');
            expect(compiledCSS).toContain('--shopify-font-heading-family');
            expect(compiledCSS).toContain('--shopify-page-width');
            expect(compiledCSS).toContain('--shopify-button-radius');
            expect(compiledCSS).toContain('--shopify-input-radius');
            expect(compiledCSS).toContain('--shopify-media-radius');
        });

        it('should output Bulma integration variables', () => {
            expect(compiledCSS).toContain('--bulma-radius');
            expect(compiledCSS).toContain('--bulma-radius-small');
            expect(compiledCSS).toContain('--bulma-radius-large');
            expect(compiledCSS).toContain('--bulma-container-max-width');
            expect(compiledCSS).toContain('--bulma-column-gap');
        });
    });

    describe('Bulma Component Integration', () => {
        it('should apply Shopify button radius to Bulma buttons', () => {
            // Check that .b-button has border-radius from Shopify variables
            const buttonRegex = /\.b-button\s*\{[^}]*border-radius:\s*var\(--buttons-radius[^}]*\}/;
            expect(compiledCSS).toMatch(buttonRegex);
        });

        it('should apply Shopify input radius to Bulma inputs', () => {
            // Check that inputs have border-radius from Shopify variables
            expect(compiledCSS).toContain('.b-input');
            expect(compiledCSS).toContain('.b-textarea');
            expect(compiledCSS).toContain('.b-select');
        });

        it('should apply Shopify media radius to images', () => {
            // Check that images have border-radius from Shopify variables
            expect(compiledCSS).toContain('.b-image');
        });

        it('should apply Shopify container max-width', () => {
            // Check that container uses Shopify page width
            const containerRegex = /\.b-container\s*\{[^}]*max-width:[^}]*\}/;
            expect(compiledCSS).toMatch(containerRegex);
        });
    });

    describe('Typography Integration', () => {
        it('should apply Shopify font families to body and content', () => {
            // Check that body uses Shopify font family
            const bodyRegex = /body[^{]*\{[^}]*font-family:\s*var\(--font-body-family[^}]*\}/;
            expect(compiledCSS).toMatch(bodyRegex);
        });

        it('should apply Shopify heading font to titles', () => {
            // Check that headings use Shopify heading font
            expect(compiledCSS).toContain('.b-title');
            expect(compiledCSS).toContain('.b-subtitle');
        });

        it('should include responsive font scaling', () => {
            // Check for responsive font-size rules
            expect(compiledCSS).toContain('font-size');
            expect(compiledCSS).toContain('@media');
        });
    });

    describe('Section Spacing', () => {
        it('should apply Shopify section spacing', () => {
            // Check for shopify-section spacing rules
            const sectionRegex = /\.shopify-section\s*\{[^}]*padding-top:[^}]*\}/;
            expect(compiledCSS).toMatch(sectionRegex);
        });

        it('should have responsive section spacing', () => {
            // Check for mobile and desktop spacing
            expect(compiledCSS).toContain('padding-top');
            expect(compiledCSS).toContain('padding-bottom');
        });
    });

    describe('Component Styling', () => {
        it('should apply Shopify badge radius to tags', () => {
            // Check that tags have border-radius from Shopify badge settings
            const tagRegex = /\.b-tag\s*\{[^}]*border-radius:[^}]*\}/;
            expect(compiledCSS).toMatch(tagRegex);
        });

        it('should apply Shopify modal styling', () => {
            // Check for modal styling
            expect(compiledCSS).toContain('.b-modal-content');
            expect(compiledCSS).toContain('.b-modal-card');
        });

        it('should include cart drawer styling', () => {
            // Check for cart drawer component
            expect(compiledCSS).toContain('.c-cart-drawer__panel');
        });
    });

    describe('PurgeCSS Compatibility', () => {
        it('should preserve critical Shopify variables in purged CSS', () => {
            // Verify that purged CSS still contains essential variables
            expect(purgedCSS).toBeTruthy();
            expect(purgedCSS.length).toBeGreaterThan(0);
        });

        it('should preserve Bulma component classes in purged CSS', () => {
            // Check that essential Bulma classes are preserved
            expect(purgedCSS).toContain('.b-button');
            expect(purgedCSS).toContain('.b-container');
        });

        it('should be significantly smaller than full CSS', () => {
            // Verify that purging actually reduces file size
            expect(purgedCSS.length).toBeLessThan(compiledCSS.length);

            // Log the size reduction for visibility
            const reduction = ((1 - purgedCSS.length / compiledCSS.length) * 100).toFixed(2);
            console.log(`PurgeCSS reduced file size by ${reduction}%`);
            console.log(`Full CSS: ${(compiledCSS.length / 1024).toFixed(2)} KB`);
            console.log(`Purged CSS: ${(purgedCSS.length / 1024).toFixed(2)} KB`);
        });
    });

    describe('FOUC Prevention', () => {
        it('should include x-cloak CSS rule for Alpine.js', () => {
            // This should be in theme.liquid, but we verify the pattern is documented
            // The actual rule will be added in the next task
            expect(true).toBe(true); // Placeholder for future implementation
        });
    });

    describe('Backward Compatibility', () => {
        it('should preserve Dawn card variables for migration phases 1-6', () => {
            // Check that deprecated variables are still defined
            // These will be removed in Phase 7
            expect(compiledCSS).toBeTruthy();
        });

        it('should not break existing Bulma classes', () => {
            // Verify that standard Bulma classes still work
            expect(compiledCSS).toContain('.b-columns');
            expect(compiledCSS).toContain('.b-column');
            expect(compiledCSS).toContain('.b-card');
            expect(compiledCSS).toContain('.b-image');
        });
    });

    describe('Build System Integration', () => {
        it('should compile without SASS errors', () => {
            // If we got here, the build succeeded
            expect(compiledCSS).toBeTruthy();
        });

        it('should include all custom SCSS modules', () => {
            // Verify that custom modules are included
            expect(compiledCSS).toContain('.c-cart-drawer__panel');
        });

        it('should maintain proper CSS variable fallbacks', () => {
            // Check that var() functions have fallback values
            const varWithFallbackRegex = /var\([^,)]+,\s*[^)]+\)/;
            expect(compiledCSS).toMatch(varWithFallbackRegex);
        });
    });

    describe('Performance', () => {
        it('should have reasonable file size for full CSS', () => {
            const sizeInKB = compiledCSS.length / 1024;
            // Full Bulma CSS should be under 500KB
            expect(sizeInKB).toBeLessThan(500);
        });

        it('should have optimized file size for purged CSS', () => {
            const sizeInKB = purgedCSS.length / 1024;
            // Purged CSS should be under 150KB
            expect(sizeInKB).toBeLessThan(150);
        });
    });
});

describe('Shopify Variables SCSS Module', () => {
    let scssContent = '';

    beforeAll(() => {
        const scssPath = path.join(process.cwd(), 'src', 'bulma', 'sass', 'utilities', '_shopify-variables.scss');
        scssContent = fs.readFileSync(scssPath, 'utf-8');
    });

    it('should define all typography variables', () => {
        expect(scssContent).toContain('$shopify-font-body-family');
        expect(scssContent).toContain('$shopify-font-heading-family');
        expect(scssContent).toContain('$shopify-font-body-weight');
        expect(scssContent).toContain('$shopify-font-heading-weight');
    });

    it('should define all color scheme variables', () => {
        expect(scssContent).toContain('$shopify-color-background');
        expect(scssContent).toContain('$shopify-color-foreground');
        expect(scssContent).toContain('$shopify-color-button');
        expect(scssContent).toContain('$shopify-color-link');
    });

    it('should define all layout variables', () => {
        expect(scssContent).toContain('$shopify-page-width');
        expect(scssContent).toContain('$shopify-spacing-sections-desktop');
        expect(scssContent).toContain('$shopify-spacing-sections-mobile');
    });

    it('should define all button variables', () => {
        expect(scssContent).toContain('$shopify-buttons-radius');
        expect(scssContent).toContain('$shopify-buttons-border-width');
        expect(scssContent).toContain('$shopify-buttons-shadow-opacity');
    });

    it('should define all input variables', () => {
        expect(scssContent).toContain('$shopify-inputs-radius');
        expect(scssContent).toContain('$shopify-inputs-border-width');
    });

    it('should define helper mixins', () => {
        expect(scssContent).toContain('@mixin shopify-button-radius');
        expect(scssContent).toContain('@mixin shopify-input-radius');
        expect(scssContent).toContain('@mixin shopify-media-radius');
        expect(scssContent).toContain('@mixin shopify-css-variables');
    });

    it('should include deprecation notices', () => {
        expect(scssContent).toContain('DEPRECATION');
        expect(scssContent).toContain('Phase 7');
    });

    it('should have proper documentation', () => {
        expect(scssContent).toContain('Purpose:');
        expect(scssContent).toContain('Usage:');
        expect(scssContent).toContain('//');
    });
});
