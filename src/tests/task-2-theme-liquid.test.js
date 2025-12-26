/**
 * Task 2 Implementation Tests
 * Tests for layout/theme.liquid Dawn CSS removal
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const THEME_LIQUID_PATH = path.join(__dirname, '../../layout/theme.liquid');

describe('Task 2: layout/theme.liquid Dawn CSS Removal', () => {
    let themeContent;

    beforeAll(() => {
        themeContent = fs.readFileSync(THEME_LIQUID_PATH, 'utf-8');
    });

    describe('Dawn CSS Variables Removed', () => {
        it('should not contain Dawn color scheme variables', () => {
            expect(themeContent).not.toContain('--color-background:');
            expect(themeContent).not.toContain('--color-foreground:');
            expect(themeContent).not.toContain('--color-button:');
            expect(themeContent).not.toContain('--color-badge-');
        });

        it('should not contain Dawn typography variables', () => {
            expect(themeContent).not.toContain('--font-body-family:');
            expect(themeContent).not.toContain('--font-heading-family:');
            expect(themeContent).not.toContain('--font-body-scale:');
            expect(themeContent).not.toContain('--font-heading-scale:');
        });

        it('should not contain Dawn layout variables', () => {
            expect(themeContent).not.toContain('--page-width:');
            expect(themeContent).not.toContain('--spacing-sections-');
            expect(themeContent).not.toContain('--grid-desktop-');
            expect(themeContent).not.toContain('--grid-mobile-');
        });

        it('should not contain Dawn media variables', () => {
            expect(themeContent).not.toContain('--media-padding:');
            expect(themeContent).not.toContain('--media-border-');
            expect(themeContent).not.toContain('--media-radius:');
            expect(themeContent).not.toContain('--media-shadow-');
        });

        it('should not contain Dawn card variables', () => {
            expect(themeContent).not.toContain('--product-card-');
            expect(themeContent).not.toContain('--collection-card-');
            expect(themeContent).not.toContain('--blog-card-');
        });

        it('should not contain Dawn button variables', () => {
            expect(themeContent).not.toContain('--buttons-radius:');
            expect(themeContent).not.toContain('--buttons-border-');
            expect(themeContent).not.toContain('--buttons-shadow-');
        });

        it('should not contain Dawn input variables', () => {
            expect(themeContent).not.toContain('--inputs-radius:');
            expect(themeContent).not.toContain('--inputs-border-');
            expect(themeContent).not.toContain('--inputs-shadow-');
        });

        it('should not contain Dawn variant pill variables', () => {
            expect(themeContent).not.toContain('--variant-pills-');
        });

        it('should not contain Dawn popup/drawer variables', () => {
            expect(themeContent).not.toContain('--popup-');
            expect(themeContent).not.toContain('--drawer-');
        });

        it('should not contain Dawn text box variables', () => {
            expect(themeContent).not.toContain('--text-boxes-');
        });

        it('should not contain Dawn badge variables', () => {
            expect(themeContent).not.toContain('--badge-corner-radius:');
        });
    });

    describe('Dawn Base Styles Removed', () => {
        it('should not contain box-sizing reset', () => {
            expect(themeContent).not.toContain('box-sizing: inherit');
        });

        it('should not contain html base styles', () => {
            const htmlStyleRegex = /html\s*{[^}]*box-sizing:\s*border-box/;
            expect(themeContent).not.toMatch(htmlStyleRegex);
        });

        it('should not contain body grid layout', () => {
            const bodyGridRegex = /body\s*{[^}]*grid-template-rows/;
            expect(themeContent).not.toMatch(bodyGridRegex);
        });

        it('should not contain responsive font scaling media queries', () => {
            expect(themeContent).not.toContain('calc(var(--font-body-scale) * var(--font-scale-mobile)');
            expect(themeContent).not.toContain('calc(var(--font-body-scale) * var(--font-scale-tablet)');
            expect(themeContent).not.toContain('calc(var(--font-body-scale) * var(--font-scale-desktop)');
        });
    });

    describe('base.css Reference Removed', () => {
        it('should not load base.css', () => {
            expect(themeContent).not.toContain("'base.css'");
            expect(themeContent).not.toContain('"base.css"');
        });

        it('should have comment explaining base.css removal', () => {
            expect(themeContent).toContain('Dawn base.css removed');
        });
    });

    describe('Alpine.js x-cloak Rule Added', () => {
        it('should contain x-cloak rule', () => {
            expect(themeContent).toContain('[x-cloak]');
        });

        it('should hide x-cloak elements with display: none !important', () => {
            const xCloakRegex = /\[x-cloak\]\s*{\s*display:\s*none\s*!important/;
            expect(themeContent).toMatch(xCloakRegex);
        });

        it('should have comment explaining x-cloak purpose', () => {
            expect(themeContent).toContain('Alpine.js x-cloak directive');
            expect(themeContent).toContain('FOUC');
        });
    });

    describe('Font Loading Preserved', () => {
        it('should contain font face declarations', () => {
            expect(themeContent).toContain('font_face');
            expect(themeContent).toContain('type_body_font');
            expect(themeContent).toContain('type_header_font');
        });

        it('should use font-display: swap', () => {
            expect(themeContent).toContain("font_display: 'swap'");
        });

        it('should load font-loading.css', () => {
            expect(themeContent).toContain("'font-loading.css'");
        });

        it('should preconnect to Shopify fonts CDN', () => {
            expect(themeContent).toContain('fonts.shopifycdn.com');
        });

        it('should preload custom fonts', () => {
            expect(themeContent).toContain('rel="preload"');
            expect(themeContent).toContain('as="font"');
            expect(themeContent).toContain('font_url');
        });
    });

    describe('Conditional Bulma CSS Loading Preserved', () => {
        it('should have use_full_css logic', () => {
            expect(themeContent).toContain('assign use_full_css = false');
        });

        it('should load full CSS in development mode', () => {
            expect(themeContent).toContain("theme.role == 'development'");
            expect(themeContent).toContain("theme.role == 'unpublished'");
        });

        it('should load full CSS in theme editor', () => {
            expect(themeContent).toContain('request.design_mode');
        });

        it('should support manual override', () => {
            expect(themeContent).toContain('settings.force_full_css');
        });

        it('should load a-bulma-full.css when use_full_css is true', () => {
            expect(themeContent).toContain("'a-bulma-full.css'");
        });

        it('should load a-bulma-purged.css when use_full_css is false', () => {
            expect(themeContent).toContain("'a-bulma-purged.css'");
        });

        it('should have conditional CSS loading logic', () => {
            expect(themeContent).toContain('{% if use_full_css %}');
            expect(themeContent).toContain('{% else %}');
        });
    });

    describe('Alpine.js Bundle Loading Preserved', () => {
        it('should load alpine-bundle.js', () => {
            expect(themeContent).toContain("'alpine-bundle.js'");
        });

        it('should defer alpine-bundle.js loading', () => {
            const alpineScriptRegex = /<script[^>]*alpine-bundle\.js[^>]*defer/;
            expect(themeContent).toMatch(alpineScriptRegex);
        });
    });

    describe('Cart Scripts Preserved', () => {
        it('should load cart-api.js', () => {
            expect(themeContent).toContain("'cart-api.js'");
        });

        it('should load cart-store.js', () => {
            expect(themeContent).toContain("'cart-store.js'");
        });

        it('should load cart-fragment.js', () => {
            expect(themeContent).toContain("'cart-fragment.js'");
        });

        it('should defer cart scripts loading', () => {
            const cartApiRegex = /<script[^>]*cart-api\.js[^>]*defer/;
            const cartStoreRegex = /<script[^>]*cart-store\.js[^>]*defer/;
            const cartFragmentRegex = /<script[^>]*cart-fragment\.js[^>]*defer/;

            expect(themeContent).toMatch(cartApiRegex);
            expect(themeContent).toMatch(cartStoreRegex);
            expect(themeContent).toMatch(cartFragmentRegex);
        });
    });

    describe('Custom PLT Styles Preserved', () => {
        it('should load a-plt-custom-style.css', () => {
            expect(themeContent).toContain("'a-plt-custom-style.css'");
        });

        it('should load PLT styles after Bulma', () => {
            const bulmaIndex = themeContent.indexOf('a-bulma-');
            const pltIndex = themeContent.indexOf('a-plt-custom-style.css');
            expect(pltIndex).toBeGreaterThan(bulmaIndex);
        });
    });

    describe('Documentation and Comments', () => {
        it('should have comment explaining CSS variable migration', () => {
            expect(themeContent).toContain('All other CSS variables are now handled by the Bulma framework');
        });

        it('should reference Shopify variables bridge files', () => {
            expect(themeContent).toContain('src/bulma/sass/utilities/_shopify-variables.scss');
            expect(themeContent).toContain('src/bulma/sass/custom/_shopify-runtime.scss');
        });

        it('should have comment about critical inline CSS', () => {
            expect(themeContent).toContain('Critical inline CSS');
        });
    });

    describe('File Size Reduction', () => {
        it('should be significantly smaller than original', () => {
            const lineCount = themeContent.split('\n').length;
            const byteCount = Buffer.byteLength(themeContent, 'utf-8');

            // Original: 409 lines, 21,730 bytes
            // Target: ~177 lines, ~6,591 bytes
            expect(lineCount).toBeLessThan(250); // Allow some margin
            expect(byteCount).toBeLessThan(10000); // Allow some margin
        });
    });

    describe('Structure Integrity', () => {
        it('should have valid HTML structure', () => {
            expect(themeContent).toContain('<!doctype html>');
            expect(themeContent).toContain('<html');
            expect(themeContent).toContain('<head>');
            expect(themeContent).toContain('</head>');
            expect(themeContent).toContain('<body');
            expect(themeContent).toContain('</body>');
            expect(themeContent).toContain('</html>');
        });

        it('should have proper Liquid syntax', () => {
            // Check for balanced Liquid tags
            const openTags = (themeContent.match(/{%/g) || []).length;
            const closeTags = (themeContent.match(/%}/g) || []).length;
            expect(openTags).toBe(closeTags);
        });

        it('should preserve content_for_header', () => {
            expect(themeContent).toContain('{{ content_for_header }}');
        });

        it('should preserve header and footer sections', () => {
            expect(themeContent).toContain("{% sections 'header-group' %}");
            expect(themeContent).toContain("{% sections 'footer-group' %}");
        });

        it('should preserve main content area', () => {
            expect(themeContent).toContain('{{ content_for_layout }}');
        });
    });

    describe('Accessibility Features Preserved', () => {
        it('should have skip-to-content link', () => {
            expect(themeContent).toContain('skip-to-content-link');
            expect(themeContent).toContain('#MainContent');
        });

        it('should have accessibility messages', () => {
            expect(themeContent).toContain('a11y-refresh-page-message');
            expect(themeContent).toContain('a11y-new-window-message');
        });
    });

    describe('Shopify Integration Preserved', () => {
        it('should have shopify-store web component', () => {
            expect(themeContent).toContain('<shopify-store');
            expect(themeContent).toContain('store-domain');
            expect(themeContent).toContain('public-access-token');
        });

        it('should have Shopify design mode detection', () => {
            expect(themeContent).toContain('Shopify.designMode');
            expect(themeContent).toContain('shopify-design-mode');
        });
    });
});
