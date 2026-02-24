/**
 * Unit Tests for Hero Banner Section - Task 16
 * Tests for sections/aa-hero.liquid
 *
 * Requirements:
 * - Verify Bulma hero component usage (b-hero, b-hero-body)
 * - Test responsive images (1:1 mobile, 2:1 desktop)
 * - Validate LCP optimization (eager loading, fetchpriority: high)
 * - Test responsive srcsets and sizes attributes
 * - Verify text overlay with Bulma typography
 * - Test accessibility compliance
 *
 * Coverage:
 * - Hero structure and Bulma classes
 * - Image optimization for LCP
 * - Responsive behavior
 * - Text overlay and content
 * - CTA button
 * - Accessibility features
 * - Performance optimization
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Hero Banner Section Tests', () => {
    let liquidTemplate;

    beforeEach(() => {
        // Read the Liquid template
        const templatePath = path.resolve(__dirname, '../../sections/aa-hero.liquid');
        liquidTemplate = fs.readFileSync(templatePath, 'utf-8');
    });

    describe('Template Structure', () => {
        it('should have Bulma hero component', () => {
            expect(liquidTemplate).toContain('b-hero');
        });

        it('should have hero body', () => {
            expect(liquidTemplate).toContain('b-hero-body');
        });

        it('should have custom hero class', () => {
            expect(liquidTemplate).toContain('c-hero');
        });

        it('should have section wrapper', () => {
            expect(liquidTemplate).toContain('<section');
            expect(liquidTemplate).toContain('data-section-id');
        });
    });

    describe('Bulma Hero Classes', () => {
        it('should support hero height variations', () => {
            expect(liquidTemplate).toContain('b-is-{{ hero_height }}');
        });

        it('should have hero height options in schema', () => {
            expect(liquidTemplate).toContain('"value": "small"');
            expect(liquidTemplate).toContain('"value": "medium"');
            expect(liquidTemplate).toContain('"value": "large"');
            expect(liquidTemplate).toContain('"value": "fullheight"');
        });

        it('should default to medium height', () => {
            expect(liquidTemplate).toContain('"default": "medium"');
        });
    });

    describe('LCP Optimization', () => {
        it('should use eager loading for hero image', () => {
            expect(liquidTemplate).toContain("loading: 'eager'");
        });

        it('should use fetchpriority high', () => {
            expect(liquidTemplate).toContain("fetchpriority: 'high'");
        });

        it('should have responsive widths parameter', () => {
            expect(liquidTemplate).toContain("widths: '400, 800, 1200, 1600, 2000'");
        });

        it('should have sizes attribute for viewport-based selection', () => {
            expect(liquidTemplate).toContain("sizes: '100vw'");
        });

        it('should optimize image URL with width parameter', () => {
            expect(liquidTemplate).toContain('image_url: width: 1600');
        });
    });

    describe('Responsive Images', () => {
        it('should have responsive image container', () => {
            expect(liquidTemplate).toContain('b-image');
        });

        it('should have 1:1 aspect ratio for mobile', () => {
            expect(liquidTemplate).toContain('aspect-ratio: 1 / 1');
            expect(liquidTemplate).toContain('@media (max-width: 768px)');
        });

        it('should have 2:1 aspect ratio for desktop', () => {
            expect(liquidTemplate).toContain('aspect-ratio: 2 / 1');
            expect(liquidTemplate).toContain('@media (min-width: 769px)');
        });

        it('should use object-fit cover', () => {
            expect(liquidTemplate).toContain('object-fit: cover');
        });

        it('should have full width and height', () => {
            expect(liquidTemplate).toContain('width: 100%');
            expect(liquidTemplate).toContain('height: 100%');
        });
    });

    describe('Image Handling', () => {
        it('should have image picker setting', () => {
            expect(liquidTemplate).toContain('"type": "image_picker"');
            expect(liquidTemplate).toContain('"id": "hero_image"');
        });

        it('should have alt text from image or title', () => {
            expect(liquidTemplate).toContain('alt: hero_image.alt');
            expect(liquidTemplate).toContain('| default: hero_title');
        });

        it('should have placeholder for theme editor', () => {
            expect(liquidTemplate).toContain('c-hero__placeholder');
            expect(liquidTemplate).toContain('placeholder_svg_tag');
        });

        it('should show placeholder when no image', () => {
            expect(liquidTemplate).toContain('{%- else -%}');
            expect(liquidTemplate).toContain('lifestyle-1');
        });
    });

    describe('Text Overlay', () => {
        it('should have overlay container', () => {
            expect(liquidTemplate).toContain('c-hero__overlay');
        });

        it('should have Bulma container for content', () => {
            expect(liquidTemplate).toContain('b-container');
        });

        it('should have overlay opacity setting', () => {
            expect(liquidTemplate).toContain('"id": "overlay_opacity"');
            expect(liquidTemplate).toContain('--overlay-opacity');
        });

        it('should have configurable overlay opacity', () => {
            expect(liquidTemplate).toContain('overlay_decimal');
            expect(liquidTemplate).toContain('divided_by: 100.0');
        });

        it('should have gradient overlay', () => {
            expect(liquidTemplate).toContain('linear-gradient');
            expect(liquidTemplate).toContain('rgba(0, 0, 0');
        });
    });

    describe('Hero Content', () => {
        it('should have hero title with Bulma typography', () => {
            expect(liquidTemplate).toContain('b-title b-is-1');
        });

        it('should have white text color', () => {
            expect(liquidTemplate).toContain('b-has-text-white');
        });

        it('should have hero subtitle', () => {
            expect(liquidTemplate).toContain('b-subtitle b-is-4');
        });

        it('should have text alignment setting', () => {
            expect(liquidTemplate).toContain('text_alignment');
            expect(liquidTemplate).toContain('b-has-text-{{ text_alignment }}');
        });

        it('should support left, center, right alignment', () => {
            expect(liquidTemplate).toContain('"value": "left"');
            expect(liquidTemplate).toContain('"value": "center"');
            expect(liquidTemplate).toContain('"value": "right"');
        });
    });

    describe('CTA Button', () => {
        it('should have CTA button with Bulma classes', () => {
            expect(liquidTemplate).toContain('b-button b-is-primary b-is-large');
        });

        it('should have button text setting', () => {
            expect(liquidTemplate).toContain('"id": "hero_cta_text"');
        });

        it('should have button link setting', () => {
            expect(liquidTemplate).toContain('"id": "hero_cta_link"');
        });

        it('should have aria-label for accessibility', () => {
            expect(liquidTemplate).toContain('aria-label');
        });

        it('should only show button when text and link provided', () => {
            expect(liquidTemplate).toContain('hero_cta_text != blank and hero_cta_link != blank');
        });
    });

    describe('Section Settings', () => {
        it('should have hero image setting', () => {
            expect(liquidTemplate).toContain('"id": "hero_image"');
            expect(liquidTemplate).toContain('"label": "Hero Image"');
        });

        it('should have title setting', () => {
            expect(liquidTemplate).toContain('"id": "hero_title"');
            expect(liquidTemplate).toContain('"default": "Welcome to Our Store"');
        });

        it('should have subtitle setting', () => {
            expect(liquidTemplate).toContain('"id": "hero_subtitle"');
        });

        it('should have overlay opacity range', () => {
            expect(liquidTemplate).toContain('"type": "range"');
            expect(liquidTemplate).toContain('"min": 0');
            expect(liquidTemplate).toContain('"max": 80');
        });

        it('should have parallax setting', () => {
            expect(liquidTemplate).toContain('"id": "enable_parallax"');
            expect(liquidTemplate).toContain('"type": "checkbox"');
        });
    });

    describe('Styling', () => {
        it('should have absolute positioned image', () => {
            expect(liquidTemplate).toContain('position: absolute');
            expect(liquidTemplate).toContain('inset: 0');
        });

        it('should have relative positioned overlay', () => {
            expect(liquidTemplate).toContain('position: relative');
            expect(liquidTemplate).toContain('z-index: 1');
        });

        it('should have minimum height for overlay', () => {
            expect(liquidTemplate).toContain('min-height: 400px');
        });

        it('should have text shadow for readability', () => {
            expect(liquidTemplate).toContain('text-shadow');
        });

        it('should have button hover effects', () => {
            expect(liquidTemplate).toContain('.c-hero__button:hover');
            expect(liquidTemplate).toContain('transform: translateY(-2px)');
        });
    });

    describe('Animations', () => {
        it('should have fadeInUp animation', () => {
            expect(liquidTemplate).toContain('@keyframes fadeInUp');
        });

        it('should animate title', () => {
            expect(liquidTemplate).toContain('animation: fadeInUp');
        });

        it('should have staggered animation timing', () => {
            expect(liquidTemplate).toContain('0.6s');
            expect(liquidTemplate).toContain('0.8s');
            expect(liquidTemplate).toContain('1s');
        });
    });

    describe('Accessibility', () => {
        it('should have semantic HTML', () => {
            expect(liquidTemplate).toContain('<section');
            expect(liquidTemplate).toContain('<h1');
            expect(liquidTemplate).toContain('<figure');
        });

        it('should have alt text on images', () => {
            expect(liquidTemplate).toContain('alt:');
        });

        it('should have aria-label on CTA button', () => {
            expect(liquidTemplate).toContain('aria-label=');
        });

        it('should respect reduced motion preferences', () => {
            expect(liquidTemplate).toContain('@media (prefers-reduced-motion: reduce)');
            expect(liquidTemplate).toContain('animation: none');
        });

        it('should disable transitions for reduced motion', () => {
            expect(liquidTemplate).toContain('transition: none');
        });
    });

    describe('Responsive Behavior', () => {
        it('should have mobile-specific styles', () => {
            expect(liquidTemplate).toContain('@media (max-width: 768px)');
        });

        it('should have desktop-specific styles', () => {
            expect(liquidTemplate).toContain('@media (min-width: 769px)');
        });

        it('should adjust font sizes for mobile', () => {
            expect(liquidTemplate).toContain('font-size: 2rem');
            expect(liquidTemplate).toContain('font-size: 1.25rem');
        });

        it('should have full-width button on mobile', () => {
            expect(liquidTemplate).toContain('width: 100%');
        });

        it('should adjust padding for mobile', () => {
            expect(liquidTemplate).toContain('padding: 1.5rem 1rem');
        });
    });

    describe('Performance', () => {
        it('should use eager loading for LCP', () => {
            expect(liquidTemplate).toContain("loading: 'eager'");
        });

        it('should use high fetch priority', () => {
            expect(liquidTemplate).toContain("fetchpriority: 'high'");
        });

        it('should have optimized srcset', () => {
            expect(liquidTemplate).toContain('widths:');
        });

        it('should have sizes attribute', () => {
            expect(liquidTemplate).toContain('sizes:');
        });

        it('should use CSS transforms for animations', () => {
            expect(liquidTemplate).toContain('transform:');
        });
    });

    describe('Parallax Effect', () => {
        it('should have parallax data attribute', () => {
            expect(liquidTemplate).toContain('data-parallax');
        });

        it('should have parallax transform', () => {
            expect(liquidTemplate).toContain("[data-parallax='true']");
            expect(liquidTemplate).toContain('transform: scale(1.1)');
        });

        it('should disable parallax for reduced motion', () => {
            expect(liquidTemplate).toContain('transform: none');
        });
    });

    describe('Print Styles', () => {
        it('should have print media query', () => {
            expect(liquidTemplate).toContain('@media print');
        });

        it('should prevent page breaks inside hero', () => {
            expect(liquidTemplate).toContain('page-break-inside: avoid');
        });

        it('should hide button in print', () => {
            expect(liquidTemplate).toContain('display: none');
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
            expect(liquidTemplate).toContain('"name": "Hero Banner"');
        });

        it('should have section tag', () => {
            expect(liquidTemplate).toContain('"tag": "section"');
        });

        it('should have presets', () => {
            expect(liquidTemplate).toContain('"presets"');
            expect(liquidTemplate).toContain('"category": "Image"');
        });

        it('should have settings headers', () => {
            expect(liquidTemplate).toContain('"type": "header"');
            expect(liquidTemplate).toContain('"content": "Hero Image"');
            expect(liquidTemplate).toContain('"content": "Hero Content"');
            expect(liquidTemplate).toContain('"content": "Layout Settings"');
        });
    });

    describe('Bulma Class Prefix', () => {
        it('should use b- prefix for all Bulma classes', () => {
            const bulmaClasses = liquidTemplate.match(/class="[^"]*\bb-[a-z-]+/g);
            expect(bulmaClasses).toBeTruthy();
            expect(bulmaClasses.length).toBeGreaterThan(0);
        });

        it('should not use unprefixed Bulma classes in HTML', () => {
            const htmlContent = liquidTemplate.split('{% schema %}')[0].split('<style>')[0];

            // Check for actual HTML class attributes with unprefixed Bulma classes
            expect(htmlContent).not.toMatch(/class="[^"]*\s+hero\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+container\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+title\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+subtitle\s+/);
            expect(htmlContent).not.toMatch(/class="[^"]*\s+button\s+/);
        });
    });

    describe('Custom Classes', () => {
        it('should have custom hero classes', () => {
            expect(liquidTemplate).toContain('c-hero');
            expect(liquidTemplate).toContain('c-hero__body');
            expect(liquidTemplate).toContain('c-hero__image');
            expect(liquidTemplate).toContain('c-hero__overlay');
            expect(liquidTemplate).toContain('c-hero__content');
        });

        it('should follow BEM naming convention', () => {
            expect(liquidTemplate).toContain('c-hero__');
            expect(liquidTemplate).not.toMatch(/c-hero-[^_]/);
        });
    });

    describe('Height Variations', () => {
        it('should support small height', () => {
            expect(liquidTemplate).toContain('.b-hero.b-is-small');
            expect(liquidTemplate).toContain('min-height: 300px');
        });

        it('should support medium height', () => {
            expect(liquidTemplate).toContain('.b-hero.b-is-medium');
            expect(liquidTemplate).toContain('min-height: 400px');
        });

        it('should support large height', () => {
            expect(liquidTemplate).toContain('.b-hero.b-is-large');
            expect(liquidTemplate).toContain('min-height: 600px');
        });

        it('should support fullheight', () => {
            expect(liquidTemplate).toContain('.b-hero.b-is-fullheight');
            expect(liquidTemplate).toContain('min-height: 100vh');
        });
    });
});
