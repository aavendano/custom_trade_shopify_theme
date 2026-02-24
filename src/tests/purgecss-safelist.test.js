/**
 * Unit tests for PurgeCSS safelist extraction
 * Tests the enhanced extract-b-safelist.js script
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SAFELIST_PATH = path.join(process.cwd(), 'src', 'purge', 'b-safelist.json');
const SCRIPT_PATH = path.join(process.cwd(), 'src', 'purge', 'extract-b-safelist.js');

describe('PurgeCSS Safelist Extraction', () => {
    let safelistData;

    beforeAll(() => {
        // Run the extraction script
        execSync(`node ${SCRIPT_PATH}`, { cwd: process.cwd() });

        // Load the generated safelist
        const rawData = fs.readFileSync(SAFELIST_PATH, 'utf8');
        safelistData = JSON.parse(rawData);
    });

    it('should generate safelist file', () => {
        expect(fs.existsSync(SAFELIST_PATH)).toBe(true);
    });

    it('should have correct structure with standard and patterns', () => {
        expect(safelistData).toHaveProperty('standard');
        expect(safelistData).toHaveProperty('patterns');
        expect(Array.isArray(safelistData.standard)).toBe(true);
        expect(Array.isArray(safelistData.patterns)).toBe(true);
    });

    it('should extract classes from schema settings', () => {
        // These classes are defined in schema settings
        const expectedSchemaClasses = [
            'b-is-1',
            'b-is-2',
            'b-is-3',
            'b-is-4',
            'b-is-5',
            'b-is-6',
            'b-is-7',
        ];

        expectedSchemaClasses.forEach(cls => {
            expect(safelistData.standard).toContain(cls);
        });
    });

    it('should extract classes from Liquid template content', () => {
        // These classes are used directly in templates
        const expectedTemplateClasses = [
            'b-columns',
            'b-column',
            'b-card',
            'b-button',
            'b-title',
        ];

        expectedTemplateClasses.forEach(cls => {
            expect(safelistData.standard).toContain(cls);
        });
    });

    it('should include dynamic class patterns for numeric modifiers', () => {
        const expectedPatterns = [
            '^b-is-\\d+$',
            '^b-is-\\d+-mobile$',
            '^b-is-\\d+-tablet$',
            '^b-is-\\d+-desktop$',
        ];

        expectedPatterns.forEach(pattern => {
            expect(safelistData.patterns).toContain(pattern);
        });
    });

    it('should include patterns for column sizes', () => {
        const expectedPatterns = [
            '^b-is-half(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$',
            '^b-is-one-third(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$',
            '^b-is-one-quarter(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$',
            '^b-is-full(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$',
        ];

        expectedPatterns.forEach(pattern => {
            expect(safelistData.patterns).toContain(pattern);
        });
    });

    it('should include patterns for spacing utilities', () => {
        const expectedPatterns = [
            '^b-m[trblxy]?-\\d+$',
            '^b-p[trblxy]?-\\d+$',
            '^b-m[trblxy]?-\\d+-mobile$',
            '^b-p[trblxy]?-\\d+-mobile$',
        ];

        expectedPatterns.forEach(pattern => {
            expect(safelistData.patterns).toContain(pattern);
        });
    });

    it('should include patterns for aspect ratios', () => {
        const expectedPatterns = [
            '^b-is-\\d+by\\d+$',
            '^b-is-\\d+by\\d+-mobile$',
            '^b-is-\\d+by\\d+-tablet$',
            '^b-is-\\d+by\\d+-desktop$',
        ];

        expectedPatterns.forEach(pattern => {
            expect(safelistData.patterns).toContain(pattern);
        });
    });

    it('should include pattern for column span', () => {
        expect(safelistData.patterns).toContain('^b-is-col-span-\\d+$');
    });

    it('should include pattern for size modifiers', () => {
        expect(safelistData.patterns).toContain('^b-is-size-\\d+(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$');
    });

    it('should have minimum number of classes extracted', () => {
        // We should have at least 100 classes extracted from the codebase
        expect(safelistData.standard.length).toBeGreaterThan(100);
    });

    it('should have all expected dynamic patterns', () => {
        // We defined 35 patterns in the script
        expect(safelistData.patterns.length).toBe(35);
    });

    it('all standard classes should start with b-', () => {
        safelistData.standard.forEach(cls => {
            expect(cls.startsWith('b-')).toBe(true);
        });
    });

    it('all patterns should be valid regex strings', () => {
        safelistData.patterns.forEach(pattern => {
            expect(() => new RegExp(pattern)).not.toThrow();
        });
    });

    it('should extract responsive utility classes', () => {
        const responsiveClasses = [
            'b-has-text-centered-mobile',
            'b-has-text-centered-tablet',
            'b-has-text-centered-desktop',
        ];

        responsiveClasses.forEach(cls => {
            expect(safelistData.standard).toContain(cls);
        });
    });

    it('should extract color utility classes', () => {
        const colorClasses = [
            'b-has-background-primary',
            'b-has-background-info',
            'b-has-background-link',
            'b-has-text-primary',
        ];

        colorClasses.forEach(cls => {
            expect(safelistData.standard).toContain(cls);
        });
    });
});

describe('PurgeCSS Integration', () => {
    it('PostCSS config should load safelist correctly', () => {
        const configPath = path.join(process.cwd(), 'src', 'postcss.config.cjs');
        expect(fs.existsSync(configPath)).toBe(true);

        // Require the config (this will throw if there's a syntax error)
        const config = require(configPath);
        expect(config).toHaveProperty('plugins');
        expect(Array.isArray(config.plugins)).toBe(true);
    });

    it('purged CSS should exist after build', () => {
        const purgedCssPath = path.join(process.cwd(), 'assets', 'a-bulma-purged.css');
        expect(fs.existsSync(purgedCssPath)).toBe(true);
    });

    it('purged CSS should be smaller than full CSS', () => {
        const fullCssPath = path.join(process.cwd(), 'assets', 'a-bulma-full.css');
        const purgedCssPath = path.join(process.cwd(), 'assets', 'a-bulma-purged.css');

        if (fs.existsSync(fullCssPath) && fs.existsSync(purgedCssPath)) {
            const fullSize = fs.statSync(fullCssPath).size;
            const purgedSize = fs.statSync(purgedCssPath).size;

            expect(purgedSize).toBeLessThan(fullSize);
            console.log(`Full CSS: ${(fullSize / 1024).toFixed(2)} KB`);
            console.log(`Purged CSS: ${(purgedSize / 1024).toFixed(2)} KB`);
            console.log(`Reduction: ${(((fullSize - purgedSize) / fullSize) * 100).toFixed(2)}%`);
        }
    });
});

describe('Dynamic Class Pattern Validation', () => {
    it('numeric patterns should match expected classes', () => {
        const pattern = new RegExp('^b-is-\\d+$');

        expect(pattern.test('b-is-1')).toBe(true);
        expect(pattern.test('b-is-12')).toBe(true);
        expect(pattern.test('b-is-999')).toBe(true);
        expect(pattern.test('b-is-abc')).toBe(false);
        expect(pattern.test('b-is-1-mobile')).toBe(false);
    });

    it('responsive numeric patterns should match expected classes', () => {
        const mobilePattern = new RegExp('^b-is-\\d+-mobile$');
        const tabletPattern = new RegExp('^b-is-\\d+-tablet$');
        const desktopPattern = new RegExp('^b-is-\\d+-desktop$');

        expect(mobilePattern.test('b-is-1-mobile')).toBe(true);
        expect(tabletPattern.test('b-is-4-tablet')).toBe(true);
        expect(desktopPattern.test('b-is-6-desktop')).toBe(true);
        expect(mobilePattern.test('b-is-1-tablet')).toBe(false);
    });

    it('column fraction patterns should match expected classes', () => {
        const halfPattern = new RegExp('^b-is-half(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$');

        expect(halfPattern.test('b-is-half')).toBe(true);
        expect(halfPattern.test('b-is-half-mobile')).toBe(true);
        expect(halfPattern.test('b-is-half-tablet')).toBe(true);
        expect(halfPattern.test('b-is-half-desktop')).toBe(true);
        expect(halfPattern.test('b-is-third')).toBe(false);
    });

    it('spacing patterns should match expected classes', () => {
        const marginPattern = new RegExp('^b-m[trblxy]?-\\d+$');
        const paddingPattern = new RegExp('^b-p[trblxy]?-\\d+$');

        expect(marginPattern.test('b-m-1')).toBe(true);
        expect(marginPattern.test('b-mt-2')).toBe(true);
        expect(marginPattern.test('b-mb-3')).toBe(true);
        expect(marginPattern.test('b-mx-4')).toBe(true);
        expect(paddingPattern.test('b-p-1')).toBe(true);
        expect(paddingPattern.test('b-pt-2')).toBe(true);
        expect(paddingPattern.test('b-pb-3')).toBe(true);
        expect(paddingPattern.test('b-px-4')).toBe(true);
    });

    it('aspect ratio patterns should match expected classes', () => {
        const aspectPattern = new RegExp('^b-is-\\d+by\\d+$');

        expect(aspectPattern.test('b-is-1by1')).toBe(true);
        expect(aspectPattern.test('b-is-16by9')).toBe(true);
        expect(aspectPattern.test('b-is-4by3')).toBe(true);
        expect(aspectPattern.test('b-is-2by1')).toBe(true);
        expect(aspectPattern.test('b-is-square')).toBe(false);
    });

    it('column span patterns should match expected classes', () => {
        const spanPattern = new RegExp('^b-is-col-span-\\d+$');

        expect(spanPattern.test('b-is-col-span-2')).toBe(true);
        expect(spanPattern.test('b-is-col-span-3')).toBe(true);
        expect(spanPattern.test('b-is-col-span-12')).toBe(true);
        expect(spanPattern.test('b-is-col-span-full')).toBe(false);
    });
});
