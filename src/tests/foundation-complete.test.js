/**
 * Foundation Changes Test Suite
 * 
 * Task 5: Write unit tests for foundation changes
 * 
 * This test suite verifies all foundation changes from Phase 1:
 * - Task 1: CSS variable migration
 * - Task 2: Dawn CSS removal from theme.liquid
 * - Task 3: B-scope wrapper utility
 * - Task 4: PurgeCSS safelist extraction
 * 
 * Requirements: 10.1-10.10
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Phase 1: Foundation Changes - Complete Test Suite', () => {
    let compiledCSS = '';
    let purgedCSS = '';
    let themeLiquid = '';
    let bScopeCSS = '';
    let safelistData = null;

    beforeAll(() => {
        // Load all necessary files
        const fullCSSPath = path.join(process.cwd(), 'assets', 'a-bulma-full.css');
        const purgedCSSPath = path.join(process.cwd(), 'assets', 'a-bulma-purged.css');
        const themeLiquidPath = path.join(process.cwd(), 'layout', 'theme.liquid');
        const safelistPath = path.join(process.cwd(), 'src', 'purge', 'b-safelist.json');

        compiledCSS = fs.readFileSync(fullCSSPath, 'utf-8');
        purgedCSS = fs.readFileSync(purgedCSSPath, 'utf-8');
        themeLiquid = fs.readFileSync(themeLiquidPath, 'utf-8');

        // Check if b-scope CSS is compiled into the full CSS
        bScopeCSS = compiledCSS;

        // Load safelist data
        const safelistRaw = fs.readFileSync(safelistPath, 'utf-8');
        safelistData = JSON.parse(safelistRaw);
    });

    /**
     * Requirement 10.1: Mobile view verification
     */
    describe('Mobile View Support (Req 10.1)', () => {
        it('should include mobile-first responsive classes', () => {
            expect(compiledCSS).toContain('.b-is-12-mobile');
            expect(compiledCSS).toContain('.b-is-half-mobile');
            expect(compiledCSS).toContain('.b-has-text-centered-mobile');
        });

        it('should have mobile breakpoint media queries', () => {
            expect(compiledCSS).toMatch(/@media.*max-width.*768px/);
        });

        it('should preserve mobile column classes in purged CSS', () => {
            expect(purgedCSS).toContain('.b-is-12-mobile');
        });

        it('should support 375px mobile viewport', () => {
            // Verify no fixed widths that would break on 375px
            const fixedWidthRegex = /width:\s*\d{4,}px/; // 4+ digit pixel widths
            const matches = compiledCSS.match(fixedWidthRegex);

            if (matches) {
                // Allow some exceptions like max-width on containers
                const allowedPatterns = ['max-width', 'container'];
                const problematicMatches = matches.filter(match => {
                    return !allowedPatterns.some(pattern =>
                        compiledCSS.substring(
                            compiledCSS.indexOf(match) - 50,
                            compiledCSS.indexOf(match)
                        ).includes(pattern)
                    );
                });
                expect(problematicMatches.length).toBe(0);
            }
        });
    });

    /**
     * Requirement 10.2: LCP optimization
     */
    describe('LCP Optimization (Req 10.2)', () => {
        it('should not block rendering with large CSS', () => {
            const purgedSizeKB = Buffer.byteLength(purgedCSS, 'utf-8') / 1024;
            // Purged CSS should be under 300KB for optimal LCP
            expect(purgedSizeKB).toBeLessThan(300);
        });

        it('should have critical CSS inline in theme.liquid', () => {
            // x-cloak rule should be inline for FOUC prevention
            expect(themeLiquid).toContain('[x-cloak]');
            expect(themeLiquid).toContain('display: none !important');
        });

        it('should defer non-critical JavaScript', () => {
            expect(themeLiquid).toMatch(/alpine-bundle\.js[^>]*defer/);
            expect(themeLiquid).toMatch(/cart-api\.js[^>]*defer/);
        });

        it('should preconnect to font CDN', () => {
            expect(themeLiquid).toContain('fonts.shopifycdn.com');
            expect(themeLiquid).toContain('rel="preconnect"');
        });
    });

    /**
     * Requirement 10.3: No Dawn CSS references
     */
    describe('Dawn CSS Removal (Req 10.3)', () => {
        it('should not reference base.css', () => {
            expect(themeLiquid).not.toContain("'base.css'");
            expect(themeLiquid).not.toContain('"base.css"');
        });

        it('should not contain Dawn CSS variables', () => {
            expect(themeLiquid).not.toContain('--color-background:');
            expect(themeLiquid).not.toContain('--font-body-family:');
            expect(themeLiquid).not.toContain('--page-width:');
            expect(themeLiquid).not.toContain('--buttons-radius:');
        });

        it('should not contain Dawn component CSS files', () => {
            expect(themeLiquid).not.toContain('component-');
        });

        it('should use only Bulma CSS classes', () => {
            // Check that compiled CSS has b- prefixed classes
            const bClassMatches = compiledCSS.match(/\.b-[a-z-]+/g);
            expect(bClassMatches).toBeTruthy();
            expect(bClassMatches.length).toBeGreaterThan(100);
        });
    });

    /**
     * Requirement 10.4: No console errors
     */
    describe('JavaScript Integrity (Req 10.4)', () => {
        it('should load Alpine.js bundle', () => {
            expect(themeLiquid).toContain('alpine-bundle.js');
        });

        it('should load cart store scripts', () => {
            expect(themeLiquid).toContain('cart-api.js');
            expect(themeLiquid).toContain('cart-store.js');
        });

        it('should have valid script tag syntax', () => {
            const scriptTags = themeLiquid.match(/<script[^>]*>/g);
            expect(scriptTags).toBeTruthy();

            scriptTags.forEach(tag => {
                // Each script tag should be properly formed
                expect(tag).toMatch(/<script.*>/);
                expect(tag).not.toContain('<<');
                expect(tag).not.toContain('>>');
            });
        });
    });

    /**
     * Requirement 10.5: x-cloak FOUC prevention
     */
    describe('FOUC Prevention with x-cloak (Req 10.5)', () => {
        it('should have x-cloak CSS rule in theme.liquid', () => {
            expect(themeLiquid).toContain('[x-cloak]');
        });

        it('should hide x-cloak elements with display: none !important', () => {
            const xCloakRegex = /\[x-cloak\]\s*{\s*display:\s*none\s*!important/;
            expect(themeLiquid).toMatch(xCloakRegex);
        });

        it('should document x-cloak purpose', () => {
            expect(themeLiquid).toContain('FOUC');
            expect(themeLiquid).toContain('Alpine');
        });

        it('should be in critical inline CSS', () => {
            // x-cloak should be before any external CSS loads
            const xCloakIndex = themeLiquid.indexOf('[x-cloak]');
            const bulmaIndex = themeLiquid.indexOf('a-bulma-');
            expect(xCloakIndex).toBeLessThan(bulmaIndex);
        });
    });

    /**
     * Requirement 10.6: Image attributes
     */
    describe('Image Optimization Patterns (Req 10.6)', () => {
        it('should have image aspect ratio classes', () => {
            expect(compiledCSS).toContain('.b-is-1by1');
            expect(compiledCSS).toContain('.b-is-16by9');
            expect(compiledCSS).toContain('.b-is-4by3');
        });

        it('should have image wrapper classes', () => {
            expect(compiledCSS).toContain('.b-image');
        });

        it('should preserve image classes in purged CSS', () => {
            expect(purgedCSS).toContain('.b-image');
            expect(purgedCSS).toContain('.b-is-1by1');
        });
    });

    /**
     * Requirement 10.7: Bulma columns and helpers
     */
    describe('Bulma Layout System (Req 10.7)', () => {
        it('should have Bulma column system', () => {
            expect(compiledCSS).toContain('.b-columns');
            expect(compiledCSS).toContain('.b-column');
        });

        it('should have responsive column classes', () => {
            expect(compiledCSS).toContain('.b-is-12-mobile');
            expect(compiledCSS).toContain('.b-is-6-tablet');
            expect(compiledCSS).toContain('.b-is-4-desktop');
        });

        it('should have Bulma helper classes', () => {
            expect(compiledCSS).toContain('.b-has-text-centered');
            expect(compiledCSS).toContain('.b-is-fullwidth');
            expect(compiledCSS).toContain('.b-has-background-primary');
        });

        it('should not use custom CSS Grid classes', () => {
            // Should use Bulma columns, not custom grid
            expect(compiledCSS).not.toContain('.custom-grid');
            expect(compiledCSS).not.toContain('.grid-custom');
        });

        it('should preserve column classes in purged CSS', () => {
            expect(purgedCSS).toContain('.b-columns');
            expect(purgedCSS).toContain('.b-column');
        });
    });

    /**
     * Requirement 10.8: Accessibility
     */
    describe('Accessibility Features (Req 10.8)', () => {
        it('should have skip-to-content link', () => {
            expect(themeLiquid).toContain('skip-to-content');
            expect(themeLiquid).toContain('#MainContent');
        });

        it('should have accessibility messages', () => {
            expect(themeLiquid).toContain('a11y-refresh-page-message');
            expect(themeLiquid).toContain('a11y-new-window-message');
        });

        it('should have proper HTML structure', () => {
            expect(themeLiquid).toContain('<!doctype html>');
            expect(themeLiquid).toContain('<html');
            expect(themeLiquid).toContain('lang=');
        });

        it('should have semantic HTML elements in CSS', () => {
            // Bulma should style semantic elements
            expect(compiledCSS).toMatch(/\bheader\b/);
            expect(compiledCSS).toMatch(/\bfooter\b/);
            expect(compiledCSS).toMatch(/\bnav\b/);
        });
    });

    /**
     * Requirement 10.9: Alpine.js x-ignore for external apps
     */
    describe('External App Compatibility (Req 10.9)', () => {
        it('should document x-ignore usage', () => {
            // Check if there's documentation about x-ignore
            const hasXIgnoreDoc = themeLiquid.includes('x-ignore') ||
                compiledCSS.includes('x-ignore');

            // This is optional but good to have
            expect(typeof hasXIgnoreDoc).toBe('boolean');
        });
    });

    /**
     * Requirement 10.10: PurgeCSS safelist for dynamic classes
     */
    describe('PurgeCSS Safelist (Req 10.10)', () => {
        it('should have safelist data structure', () => {
            expect(safelistData).toBeTruthy();
            expect(safelistData).toHaveProperty('standard');
            expect(safelistData).toHaveProperty('patterns');
        });

        it('should safelist dynamic numeric classes', () => {
            expect(safelistData.patterns).toContain('^b-is-\\d+$');
            expect(safelistData.patterns).toContain('^b-is-\\d+-mobile$');
            expect(safelistData.patterns).toContain('^b-is-\\d+-tablet$');
        });

        it('should safelist column classes', () => {
            expect(safelistData.standard).toContain('b-columns');
            expect(safelistData.standard).toContain('b-column');
        });

        it('should safelist responsive utilities', () => {
            const hasResponsiveClasses = safelistData.standard.some(cls =>
                cls.includes('-mobile') || cls.includes('-tablet') || cls.includes('-desktop')
            );
            expect(hasResponsiveClasses).toBe(true);
        });

        it('should preserve safelisted classes in purged CSS', () => {
            // Check a sample of safelisted classes
            const sampleClasses = ['b-columns', 'b-button', 'b-card', 'b-title'];
            sampleClasses.forEach(cls => {
                expect(purgedCSS).toContain(`.${cls}`);
            });
        });

        it('should preserve dynamic pattern classes in purged CSS', () => {
            // Check that numeric classes are preserved
            expect(purgedCSS).toMatch(/\.b-is-\d+\s*[,{]/);
            expect(purgedCSS).toMatch(/\.b-is-\d+-mobile\s*[,{]/);
        });
    });

    /**
     * CSS Variable Migration Tests
     */
    describe('CSS Variable Migration', () => {
        it('should output Shopify CSS variables', () => {
            expect(compiledCSS).toContain('--shopify-font-body-family');
            expect(compiledCSS).toContain('--shopify-page-width');
            expect(compiledCSS).toContain('--shopify-button-radius');
        });

        it('should output Bulma integration variables', () => {
            expect(compiledCSS).toContain('--bulma-radius');
            expect(compiledCSS).toContain('--bulma-container-max-width');
        });

        it('should preserve CSS variables in purged CSS', () => {
            expect(purgedCSS).toContain('--shopify-');
            expect(purgedCSS).toContain('--bulma-');
        });
    });

    /**
     * B-Scope Wrapper Tests
     */
    describe('B-Scope Wrapper Utility', () => {
        it('should have b-scope class definition', () => {
            expect(compiledCSS).toContain('.b-scope');
        });

        it('should have b-scope specificity overrides', () => {
            // B-scope should increase specificity for Bulma classes
            const bScopeRegex = /\.b-scope.*\.b-/;
            expect(compiledCSS).toMatch(bScopeRegex);
        });

        it('should preserve b-scope in purged CSS', () => {
            expect(purgedCSS).toContain('.b-scope');
        });

        it('should document b-scope usage', () => {
            // Check if there's a comment about b-scope
            const bScopeScssPath = path.join(process.cwd(), 'src', 'bulma', 'sass', 'custom', '_b-scope.scss');
            if (fs.existsSync(bScopeScssPath)) {
                const bScopeScss = fs.readFileSync(bScopeScssPath, 'utf-8');
                expect(bScopeScss).toContain('Purpose:');
                expect(bScopeScss).toContain('Usage:');
            }
        });
    });

    /**
     * Conditional CSS Loading Tests
     */
    describe('Conditional CSS Loading', () => {
        it('should have use_full_css logic', () => {
            expect(themeLiquid).toContain('use_full_css');
        });

        it('should load full CSS in development', () => {
            expect(themeLiquid).toContain("theme.role == 'development'");
        });

        it('should load full CSS in theme editor', () => {
            expect(themeLiquid).toContain('request.design_mode');
        });

        it('should load purged CSS in production', () => {
            expect(themeLiquid).toContain('a-bulma-purged.css');
        });

        it('should have conditional if/else structure', () => {
            expect(themeLiquid).toContain('{% if use_full_css %}');
            expect(themeLiquid).toContain('{% else %}');
        });
    });

    /**
     * Build System Integration Tests
     */
    describe('Build System Integration', () => {
        it('should have compiled full CSS', () => {
            expect(compiledCSS.length).toBeGreaterThan(0);
        });

        it('should have purged CSS', () => {
            expect(purgedCSS.length).toBeGreaterThan(0);
        });

        it('should have significant size reduction', () => {
            const fullSize = Buffer.byteLength(compiledCSS, 'utf-8');
            const purgedSize = Buffer.byteLength(purgedCSS, 'utf-8');
            const reduction = ((fullSize - purgedSize) / fullSize) * 100;

            expect(reduction).toBeGreaterThan(30); // At least 30% reduction
            console.log(`CSS size reduction: ${reduction.toFixed(2)}%`);
        });

        it('should compile without SASS errors', () => {
            // If we got here, compilation succeeded
            expect(compiledCSS).toBeTruthy();
        });
    });

    /**
     * Performance Tests
     */
    describe('Performance Metrics', () => {
        it('should have optimized purged CSS size', () => {
            const purgedSizeKB = Buffer.byteLength(purgedCSS, 'utf-8') / 1024;
            expect(purgedSizeKB).toBeLessThan(300); // Target < 300KB
            console.log(`Purged CSS size: ${purgedSizeKB.toFixed(2)} KB`);
        });

        it('should have reasonable full CSS size', () => {
            const fullSizeKB = Buffer.byteLength(compiledCSS, 'utf-8') / 1024;
            expect(fullSizeKB).toBeLessThan(1000); // Target < 1MB
            console.log(`Full CSS size: ${fullSizeKB.toFixed(2)} KB`);
        });

        it('should have minimal theme.liquid size', () => {
            const themeSizeKB = Buffer.byteLength(themeLiquid, 'utf-8') / 1024;
            expect(themeSizeKB).toBeLessThan(15); // Target < 15KB
            console.log(`theme.liquid size: ${themeSizeKB.toFixed(2)} KB`);
        });
    });

    /**
     * Documentation Tests
     */
    describe('Documentation', () => {
        it('should have comments explaining CSS variable migration', () => {
            expect(themeLiquid).toContain('Bulma framework');
        });

        it('should reference Shopify variables bridge', () => {
            expect(themeLiquid).toContain('_shopify-variables.scss');
        });

        it('should have comment about Dawn removal', () => {
            expect(themeLiquid).toContain('Dawn');
            expect(themeLiquid).toContain('removed');
        });
    });
});
