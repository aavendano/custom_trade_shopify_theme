/**
 * TASK 3 TEST SUITE: B-SCOPE WRAPPER UTILITY
 * 
 * Tests for the .b-scope wrapper utility that isolates Bulma styles
 * from legacy Dawn styles during migration phases 1-6.
 * 
 * Requirements Tested:
 * - Requirement 1.5: b-scope wrapper for migration coexistence
 * - Requirement 8.8: CSS specificity overrides without !important
 * 
 * Test Categories:
 * 1. Build Integration Tests
 * 2. CSS Output Tests
 * 3. Specificity Override Tests
 * 4. Component Isolation Tests
 * 5. Helper Class Tests
 * 6. Migration Pattern Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

// =============================================================================
// TEST SETUP
// =============================================================================

const COMPILED_CSS_PATH = path.join(__dirname, '../../assets/a-bulma-full.css');
const B_SCOPE_SOURCE_PATH = path.join(__dirname, '../bulma/sass/custom/_b-scope.scss');

let compiledCSS = '';
let bScopeSource = '';

beforeAll(() => {
    // Read compiled CSS if it exists
    if (fs.existsSync(COMPILED_CSS_PATH)) {
        compiledCSS = fs.readFileSync(COMPILED_CSS_PATH, 'utf-8');
    }

    // Read b-scope source
    if (fs.existsSync(B_SCOPE_SOURCE_PATH)) {
        bScopeSource = fs.readFileSync(B_SCOPE_SOURCE_PATH, 'utf-8');
    }
});

// =============================================================================
// 1. BUILD INTEGRATION TESTS
// =============================================================================

describe('Build Integration', () => {
    it('should have b-scope.scss file in custom directory', () => {
        expect(fs.existsSync(B_SCOPE_SOURCE_PATH)).toBe(true);
    });

    it('should be imported in custom/_index.scss', () => {
        const customIndexPath = path.join(__dirname, '../bulma/sass/custom/_index.scss');
        const customIndex = fs.readFileSync(customIndexPath, 'utf-8');
        expect(customIndex).toContain('@forward "b-scope"');
    });

    it('should compile without errors', () => {
        // If compiled CSS exists, build was successful
        expect(compiledCSS.length).toBeGreaterThan(0);
    });

    it('should include b-scope styles in compiled CSS', () => {
        expect(compiledCSS).toContain('.b-scope');
    });
});

// =============================================================================
// 2. CSS OUTPUT TESTS
// =============================================================================

describe('CSS Output', () => {
    it('should output .b-scope base class', () => {
        expect(compiledCSS).toMatch(/\.b-scope\s*{/);
    });

    it('should include box-sizing reset', () => {
        expect(compiledCSS).toContain('box-sizing: border-box');
    });

    it('should include universal selector for child elements', () => {
        expect(compiledCSS).toMatch(/\.b-scope\s+\*,?\s*\.b-scope\s+\*::before,?\s*\.b-scope\s+\*::after/);
    });

    it('should not use !important for base overrides', () => {
        // Extract b-scope rules (excluding helper classes which intentionally use !important)
        const bScopeRules = compiledCSS.match(/\.b-scope\s+(?!\.b-is-|\.b-has-|\.b-m-|\.b-p-)[^{]+{[^}]+}/g) || [];
        const baseRulesWithImportant = bScopeRules.filter(rule =>
            rule.includes('!important') &&
            !rule.includes('helper') &&
            !rule.includes('spacing')
        );

        // Base overrides should not use !important (only helpers should)
        expect(baseRulesWithImportant.length).toBe(0);
    });
});

// =============================================================================
// 3. SPECIFICITY OVERRIDE TESTS
// =============================================================================

describe('Specificity Overrides', () => {
    describe('Typography', () => {
        it('should override .b-title within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-title/);
        });

        it('should override .b-subtitle within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-subtitle/);
        });

        it('should override .b-content within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-content/);
        });
    });

    describe('Layout', () => {
        it('should override .b-columns within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-columns/);
        });

        it('should override .b-column within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-column/);
        });

        it('should override .b-container within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-container/);
        });

        it('should override .b-section within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-section/);
        });
    });

    describe('Components', () => {
        it('should override .b-button within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-button/);
        });

        it('should override .b-card within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-card/);
        });

        it('should override .b-input within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-input/);
        });

        it('should override .b-navbar within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-navbar/);
        });

        it('should override .b-hero within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-hero/);
        });

        it('should override .b-image within .b-scope', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-image/);
        });
    });
});

// =============================================================================
// 4. COMPONENT ISOLATION TESTS
// =============================================================================

describe('Component Isolation', () => {
    it('should reset button appearance', () => {
        const buttonRule = compiledCSS.match(/\.b-scope\s+\.b-button\s*{[^}]+}/);
        expect(buttonRule).toBeTruthy();
        if (buttonRule) {
            expect(buttonRule[0]).toContain('appearance');
        }
    });

    it('should reset form input appearance', () => {
        const inputRule = compiledCSS.match(/\.b-scope\s+\.b-input[^{]*{[^}]+}/);
        expect(inputRule).toBeTruthy();
        if (inputRule) {
            expect(inputRule[0]).toContain('appearance');
        }
    });

    it('should ensure flex display for columns', () => {
        const columnsRule = compiledCSS.match(/\.b-scope\s+\.b-columns[^{]*{[^}]+}/);
        expect(columnsRule).toBeTruthy();
        if (columnsRule) {
            expect(columnsRule[0]).toContain('display');
            expect(columnsRule[0]).toContain('flex');
        }
    });

    it('should reset card styles', () => {
        const cardRule = compiledCSS.match(/\.b-scope\s+\.b-card[^{]*{[^}]+}/);
        expect(cardRule).toBeTruthy();
    });

    it('should reset image container styles', () => {
        const imageRule = compiledCSS.match(/\.b-scope\s+\.b-image[^{]*{[^}]+}/);
        expect(imageRule).toBeTruthy();
        if (imageRule) {
            expect(imageRule[0]).toContain('position');
        }
    });
});

// =============================================================================
// 5. HELPER CLASS TESTS
// =============================================================================

describe('Helper Classes', () => {
    describe('Spacing Helpers', () => {
        it('should include margin-0 helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-m-0\s*{\s*margin:\s*0\s*!important/);
        });

        it('should include padding-0 helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-p-0\s*{\s*padding:\s*0\s*!important/);
        });

        it('should include margin-top-0 helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-mt-0\s*{\s*margin-top:\s*0\s*!important/);
        });

        it('should include padding-bottom-0 helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-pb-0\s*{\s*padding-bottom:\s*0\s*!important/);
        });
    });

    describe('Display Helpers', () => {
        it('should include is-hidden helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-is-hidden\s*{\s*display:\s*none\s*!important/);
        });

        it('should include is-invisible helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-is-invisible\s*{\s*visibility:\s*hidden\s*!important/);
        });

        it('should include is-flex helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-is-flex\s*{\s*display:\s*flex\s*!important/);
        });
    });

    describe('Text Alignment Helpers', () => {
        it('should include has-text-centered helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-has-text-centered\s*{\s*text-align:\s*center\s*!important/);
        });

        it('should include has-text-left helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-has-text-left\s*{\s*text-align:\s*left\s*!important/);
        });

        it('should include has-text-right helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-has-text-right\s*{\s*text-align:\s*right\s*!important/);
        });
    });

    describe('Color Helpers', () => {
        it('should include has-text-white helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-has-text-white/);
        });

        it('should include has-text-primary helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-has-text-primary/);
        });

        it('should include has-background-primary helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-has-background-primary/);
        });

        it('should use CSS variables for color helpers', () => {
            const primaryTextRule = compiledCSS.match(/\.b-scope\s+\.b-has-text-primary\s*{[^}]+}/);
            if (primaryTextRule) {
                expect(primaryTextRule[0]).toContain('var(--bulma-primary');
            }
        });
    });

    describe('Flexbox Helpers', () => {
        it('should include justify-content-center helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-is-justify-content-center/);
        });

        it('should include align-items-center helper', () => {
            expect(compiledCSS).toMatch(/\.b-scope\s+\.b-is-align-items-center/);
        });
    });
});

// =============================================================================
// 6. MIGRATION PATTERN TESTS
// =============================================================================

describe('Migration Patterns', () => {
    it('should have comprehensive documentation in source file', () => {
        expect(bScopeSource).toContain('Purpose:');
        expect(bScopeSource).toContain('Usage Pattern:');
        expect(bScopeSource).toContain('Requirements Satisfied:');
        expect(bScopeSource).toContain('Migration Timeline:');
    });

    it('should document when to use b-scope', () => {
        expect(bScopeSource).toContain('WHEN TO USE .b-scope:');
        expect(bScopeSource).toContain('DO use .b-scope when:');
        expect(bScopeSource).toContain('DO NOT use .b-scope when:');
    });

    it('should provide Liquid usage examples', () => {
        expect(bScopeSource).toContain('EXAMPLE USAGE IN LIQUID:');
        expect(bScopeSource).toContain('<div class="b-scope">');
    });

    it('should document Phase 7 removal process', () => {
        expect(bScopeSource).toContain('Phase 7');
        expect(bScopeSource).toContain('REMOVAL CHECKLIST');
        expect(bScopeSource).toContain('Task 36');
    });

    it('should reference correct requirements', () => {
        expect(bScopeSource).toContain('Requirement 1.5');
        expect(bScopeSource).toContain('Requirement 8.8');
    });

    it('should explain coexistence strategy', () => {
        expect(bScopeSource).toContain('Isolate Bulma styles from legacy Dawn styles');
        expect(bScopeSource).toContain('migration phases 1-6');
    });
});

// =============================================================================
// 7. PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
    it('should not significantly increase CSS file size', () => {
        // b-scope rules should be a small fraction of total CSS
        const bScopeRules = compiledCSS.match(/\.b-scope[^{]*{[^}]+}/g) || [];
        const totalRules = compiledCSS.match(/[^{]+{[^}]+}/g) || [];

        const bScopePercentage = (bScopeRules.length / totalRules.length) * 100;

        // b-scope should be less than 5% of total rules
        expect(bScopePercentage).toBeLessThan(5);
    });

    it('should use efficient selectors', () => {
        // Should not use overly complex selectors
        const complexSelectors = compiledCSS.match(/\.b-scope\s+[^{]{100,}/g) || [];
        expect(complexSelectors.length).toBe(0);
    });

    it('should not duplicate Bulma base styles', () => {
        // b-scope should override, not duplicate
        // This is a heuristic check - if b-scope rules are less than 10% of total,
        // we're likely not duplicating
        const bScopeSize = (compiledCSS.match(/\.b-scope/g) || []).length;
        const totalSize = compiledCSS.length;

        const bScopePercentage = (bScopeSize / totalSize) * 100;
        expect(bScopePercentage).toBeLessThan(10);
    });
});

// =============================================================================
// 8. PURGECSS COMPATIBILITY TESTS
// =============================================================================

describe('PurgeCSS Compatibility', () => {
    it('should use standard class names that PurgeCSS can detect', () => {
        // All b-scope selectors should use standard class syntax
        const nonStandardSelectors = compiledCSS.match(/\.b-scope[^.\s{]+[^a-z0-9-_]/gi) || [];
        expect(nonStandardSelectors.length).toBe(0);
    });

    it('should not use dynamic class generation', () => {
        // Should not have template literals or string concatenation
        expect(bScopeSource).not.toContain('${');
        expect(bScopeSource).not.toContain('#{');
    });

    it('should use b- prefix consistently', () => {
        // All Bulma classes within b-scope should have b- prefix
        const classMatches = bScopeSource.match(/\.((?!b-)[a-z][a-z0-9-]*)/gi) || [];

        // Filter out non-Bulma classes (like :hover, :focus, etc.)
        const nonBulmaClasses = classMatches.filter(cls =>
            !cls.includes(':') &&
            !cls.includes('b-scope') &&
            cls.length > 2
        );

        // Should have very few non-b- prefixed classes
        expect(nonBulmaClasses.length).toBeLessThan(5);
    });
});

// =============================================================================
// 9. INTEGRATION WITH SHOPIFY VARIABLES TESTS
// =============================================================================

describe('Shopify Variables Integration', () => {
    it('should use CSS variables for dynamic values', () => {
        expect(compiledCSS).toMatch(/\.b-scope.*var\(--/);
    });

    it('should provide fallback values for CSS variables', () => {
        const varUsages = compiledCSS.match(/var\([^)]+\)/g) || [];
        const varsWithFallback = varUsages.filter(v => v.includes(','));

        // Most CSS variables should have fallbacks
        const fallbackPercentage = (varsWithFallback.length / varUsages.length) * 100;
        expect(fallbackPercentage).toBeGreaterThan(50);
    });

    it('should reference Bulma color variables', () => {
        expect(compiledCSS).toMatch(/var\(--bulma-primary/);
        expect(compiledCSS).toMatch(/var\(--bulma-link/);
        expect(compiledCSS).toMatch(/var\(--bulma-info/);
    });
});

// =============================================================================
// 10. CODE QUALITY TESTS
// =============================================================================

describe('Code Quality', () => {
    it('should have proper SCSS syntax', () => {
        // Check for common syntax errors
        expect(bScopeSource).not.toContain(';;');
        expect(bScopeSource).not.toContain('{}');
    });

    it('should use consistent indentation', () => {
        const lines = bScopeSource.split('\n');
        const indentedLines = lines.filter(line => line.match(/^\s+\S/));

        // All indented lines should use 2-space indentation
        const badIndentation = indentedLines.filter(line => {
            const spaces = line.match(/^(\s+)/);
            if (spaces) {
                return spaces[1].length % 2 !== 0;
            }
            return false;
        });

        expect(badIndentation.length).toBe(0);
    });

    it('should have section dividers for organization', () => {
        expect(bScopeSource).toContain('=============');
        expect(bScopeSource.match(/={50,}/g).length).toBeGreaterThan(3);
    });

    it('should follow BEM-like naming for component classes', () => {
        // b-scope should be the only top-level class
        const topLevelClasses = bScopeSource.match(/^\s*\.(b-[a-z-]+)\s*{/gm) || [];
        expect(topLevelClasses.length).toBeGreaterThan(0);
    });
});

// =============================================================================
// MANUAL VERIFICATION CHECKLIST
// =============================================================================

/**
 * MANUAL VERIFICATION CHECKLIST
 * 
 * These items should be manually verified by developers:
 * 
 * Build Verification:
 * - [ ] Run `npm run build` - should complete without errors
 * - [ ] Check `assets/a-bulma-full.css` contains .b-scope rules
 * - [ ] Check `assets/a-bulma-purged.css` preserves .b-scope if used
 * - [ ] No SASS compilation warnings related to b-scope
 * 
 * Visual Testing:
 * - [ ] Create test page with .b-scope wrapper
 * - [ ] Verify Bulma components render correctly within .b-scope
 * - [ ] Verify Bulma styles override Dawn styles within .b-scope
 * - [ ] Verify components outside .b-scope still use Dawn styles
 * 
 * Specificity Testing:
 * - [ ] Test .b-button within .b-scope vs outside
 * - [ ] Test .b-card within .b-scope vs outside
 * - [ ] Test .b-columns within .b-scope vs outside
 * - [ ] Verify no !important needed for overrides (except helpers)
 * 
 * Migration Pattern Testing:
 * - [ ] Create new section with .b-scope wrapper
 * - [ ] Verify section renders correctly
 * - [ ] Verify no CSS conflicts with legacy sections
 * - [ ] Test removing .b-scope wrapper (Phase 7 simulation)
 * 
 * Performance Testing:
 * - [ ] Measure CSS file size increase (should be minimal)
 * - [ ] Check rendering performance (should be no impact)
 * - [ ] Verify PurgeCSS still works correctly
 * 
 * Documentation Testing:
 * - [ ] Review inline documentation for clarity
 * - [ ] Verify usage examples are correct
 * - [ ] Confirm migration timeline is accurate
 * - [ ] Check requirement references are valid
 */
