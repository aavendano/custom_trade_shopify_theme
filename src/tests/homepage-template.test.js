/**
 * Unit Tests for Homepage Template - Task 19
 * Tests for templates/index.json
 *
 * Requirements:
 * - Verify aa-hero section is referenced
 * - Test section configuration
 * - Validate section order
 * - Ensure proper JSON structure
 *
 * Coverage:
 * - Hero section presence
 * - Hero settings
 * - Section order
 * - Template structure
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Homepage Template Tests', () => {
    let templateContent;
    let templateData;

    beforeEach(() => {
        // Read the template file
        const templatePath = path.resolve(__dirname, '../../templates/index.json');
        templateContent = fs.readFileSync(templatePath, 'utf-8');

        // Remove comments for JSON parsing
        const jsonContent = templateContent
            .split('\n')
            .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('/*') && !line.trim().startsWith('*'))
            .join('\n')
            .replace(/\/\*[\s\S]*?\*\//g, '');

        templateData = JSON.parse(jsonContent);
    });

    describe('Template Structure', () => {
        it('should have sections object', () => {
            expect(templateData).toHaveProperty('sections');
            expect(typeof templateData.sections).toBe('object');
        });

        it('should have order array', () => {
            expect(templateData).toHaveProperty('order');
            expect(Array.isArray(templateData.order)).toBe(true);
        });

        it('should have matching sections and order', () => {
            const sectionKeys = Object.keys(templateData.sections);
            const orderKeys = templateData.order;

            // All order items should exist in sections
            orderKeys.forEach(key => {
                expect(sectionKeys).toContain(key);
            });
        });
    });

    describe('Hero Section Presence', () => {
        it('should have aa_hero section', () => {
            expect(templateData.sections).toHaveProperty('aa_hero');
        });

        it('should reference aa-hero section type', () => {
            expect(templateData.sections.aa_hero.type).toBe('aa-hero');
        });

        it('should be first in order', () => {
            expect(templateData.order[0]).toBe('aa_hero');
        });
    });

    describe('Hero Section Settings', () => {
        it('should have settings object', () => {
            expect(templateData.sections.aa_hero).toHaveProperty('settings');
            expect(typeof templateData.sections.aa_hero.settings).toBe('object');
        });

        it('should have hero_title setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('hero_title');
            expect(typeof templateData.sections.aa_hero.settings.hero_title).toBe('string');
        });

        it('should have hero_subtitle setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('hero_subtitle');
            expect(typeof templateData.sections.aa_hero.settings.hero_subtitle).toBe('string');
        });

        it('should have hero_cta_text setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('hero_cta_text');
            expect(typeof templateData.sections.aa_hero.settings.hero_cta_text).toBe('string');
        });

        it('should have hero_cta_link setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('hero_cta_link');
            expect(typeof templateData.sections.aa_hero.settings.hero_cta_link).toBe('string');
        });

        it('should have hero_height setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('hero_height');
            expect(['small', 'medium', 'large', 'fullheight']).toContain(
                templateData.sections.aa_hero.settings.hero_height
            );
        });

        it('should have text_alignment setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('text_alignment');
            expect(['left', 'center', 'right']).toContain(
                templateData.sections.aa_hero.settings.text_alignment
            );
        });

        it('should have overlay_opacity setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('overlay_opacity');
            expect(typeof templateData.sections.aa_hero.settings.overlay_opacity).toBe('number');
        });

        it('should have enable_parallax setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('enable_parallax');
            expect(typeof templateData.sections.aa_hero.settings.enable_parallax).toBe('boolean');
        });

        it('should have hero_image setting', () => {
            expect(templateData.sections.aa_hero.settings).toHaveProperty('hero_image');
        });
    });

    describe('Hero Section Configuration', () => {
        it('should have default title', () => {
            const title = templateData.sections.aa_hero.settings.hero_title;
            expect(title.length).toBeGreaterThan(0);
        });

        it('should have default subtitle', () => {
            const subtitle = templateData.sections.aa_hero.settings.hero_subtitle;
            expect(subtitle.length).toBeGreaterThan(0);
        });

        it('should have default CTA text', () => {
            const ctaText = templateData.sections.aa_hero.settings.hero_cta_text;
            expect(ctaText.length).toBeGreaterThan(0);
        });

        it('should have valid CTA link', () => {
            const ctaLink = templateData.sections.aa_hero.settings.hero_cta_link;
            expect(ctaLink).toMatch(/^\//); // Should start with /
        });

        it('should have medium height by default', () => {
            expect(templateData.sections.aa_hero.settings.hero_height).toBe('medium');
        });

        it('should have center alignment by default', () => {
            expect(templateData.sections.aa_hero.settings.text_alignment).toBe('center');
        });

        it('should have 30% overlay opacity by default', () => {
            expect(templateData.sections.aa_hero.settings.overlay_opacity).toBe(30);
        });

        it('should have parallax disabled by default', () => {
            expect(templateData.sections.aa_hero.settings.enable_parallax).toBe(false);
        });
    });

    describe('Section Order', () => {
        it('should have hero as first section', () => {
            expect(templateData.order[0]).toBe('aa_hero');
        });

        it('should have multiple sections', () => {
            expect(templateData.order.length).toBeGreaterThan(1);
        });

        it('should maintain existing sections', () => {
            // Check that other sections still exist
            expect(templateData.order).toContain('a_matrix_KPxFQ3');
            expect(templateData.order).toContain('collection_list');
            expect(templateData.order).toContain('featured_collection1');
        });
    });

    describe('No Old Hero References', () => {
        it('should not reference image-banner section', () => {
            const sectionTypes = Object.values(templateData.sections).map(s => s.type);
            expect(sectionTypes).not.toContain('image-banner');
        });

        it('should not have image_banner in order', () => {
            expect(templateData.order).not.toContain('image_banner');
        });
    });

    describe('Template Integrity', () => {
        it('should have valid JSON structure', () => {
            expect(() => {
                const jsonContent = templateContent
                    .split('\n')
                    .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('/*') && !line.trim().startsWith('*'))
                    .join('\n')
                    .replace(/\/\*[\s\S]*?\*\//g, '');
                JSON.parse(jsonContent);
            }).not.toThrow();
        });

        it('should have all ordered sections defined', () => {
            templateData.order.forEach(sectionKey => {
                expect(templateData.sections).toHaveProperty(sectionKey);
            });
        });
    });
});
