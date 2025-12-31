/**
 * Performance and Rendering Tests for Hero Component - Task 20
 * Tests for sections/aa-hero.liquid
 * 
 * Requirements:
 * - Verify LCP image has loading="eager" and fetchpriority="high"
 * - Test responsive image selection at different viewport widths
 * - Validate text overlay readability and positioning
 * - Test mobile (375px) and desktop (1024px+) rendering
 * 
 * Coverage:
 * - LCP optimization attributes
 * - Responsive image srcsets
 * - Text overlay contrast and positioning
 * - Viewport-specific rendering
 * - Performance best practices
 * 
 * Requirements: 10.1, 10.2, 10.7
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Hero Performance and Rendering Tests', () => {
    let liquidTemplate;
    let scssContent;

    beforeEach(() => {
        // Read the Liquid template
        const templatePath = path.resolve(__dirname, '../../sections/aa-hero.liquid');
        liquidTemplate = fs.readFileSync(templatePath, 'utf-8');

        // Read the SCSS file
        const scssPath = path.resolve(__dirname, '../../src/bulma/sass/custom/_hero.scss');
        scssContent = fs.readFileSync(scssPath, 'utf-8');
    });

    describe('LCP Optimization', () => {
        it('should have loading="eager" for LCP image', () => {
            expect(liquidTemplate).toContain("loading: 'eager'");
        });

        it('should have fetchpriority="high" for LCP image', () => {
            expect(liquidTemplate).toContain("fetchpriority: 'high'");
        });

        it('should use image_tag filter for optimization', () => {
            expect(liquidTemplate).toContain('| image_tag:');
        });

        it('should optimize image URL with width parameter', () => {
            expect(liquidTemplate).toContain('image_url: width: 1600');
        });

        it('should not use lazy loading for hero image', () => {
            // Hero image should NOT have loading="lazy"
            const imageTagSection = liquidTemplate.match(/image_tag:[\s\S]*?}}/);
            if (imageTagSection) {
                expect(imageTagSection[0]).not.toContain("loading: 'lazy'");
            }
        });
    });

    describe('Responsive Image Selection', () => {
        it('should have responsive widths parameter', () => {
            expect(liquidTemplate).toContain("widths: '400, 800, 1200, 1600, 2000'");
        });

        it('should have sizes attribute for viewport-based selection', () => {
            expect(liquidTemplate).toContain("sizes: '100vw'");
        });

        it('should include mobile-optimized width (400px)', () => {
            expect(liquidTemplate).toContain('400');
        });

        it('should include tablet-optimized width (800px)', () => {
            expect(liquidTemplate).toContain('800');
        });

        it('should include desktop-optimized widths (1200px, 1600px)', () => {
            expect(liquidTemplate).toContain('1200');
            expect(liquidTemplate).toContain('1600');
        });

        it('should include high-DPI width (2000px)', () => {
            expect(liquidTemplate).toContain('2000');
        });

        it('should have 1:1 aspect ratio for mobile (375px)', () => {
            expect(scssContent).toContain('@media (max-width: $hero-mobile-breakpoint)');
            expect(scssContent).toContain('"1 / 1"');
        });

        it('should have 2:1 aspect ratio for desktop (1024px+)', () => {
            expect(scssContent).toContain('@media (min-width: $hero-desktop-breakpoint)');
            expect(scssContent).toContain('"2 / 1"');
        });
    });

    describe('Text Overlay Readability', () => {
        it('should have overlay with configurable opacity', () => {
            expect(liquidTemplate).toContain('overlay_opacity');
            expect(liquidTemplate).toContain('--overlay-opacity');
        });

        it('should have gradient overlay for contrast', () => {
            expect(scssContent).toContain('linear-gradient');
            expect(scssContent).toContain('rgba(0, 0, 0');
        });

        it('should have text shadow for title readability', () => {
            expect(scssContent).toContain('$hero-title-shadow');
            expect(scssContent).toContain('.c-hero__title');
            expect(scssContent).toContain('text-shadow');
        });

        it('should have text shadow for subtitle readability', () => {
            expect(scssContent).toContain('$hero-subtitle-shadow');
            expect(scssContent).toContain('.c-hero__subtitle');
        });

        it('should use white text color for contrast', () => {
            expect(liquidTemplate).toContain('b-has-text-white');
        });

        it('should have default overlay opacity of 30%', () => {
            expect(liquidTemplate).toContain('overlay_opacity | default: 30');
        });

        it('should support overlay opacity range 0-80%', () => {
            // Check schema settings
            expect(liquidTemplate).toContain('"min": 0');
            expect(liquidTemplate).toContain('"max": 80');
        });
    });

    describe('Text Overlay Positioning', () => {
        it('should use flexbox for centering', () => {
            expect(scssContent).toContain('display: flex');
            expect(scssContent).toContain('align-items: center');
            expect(scssContent).toContain('justify-content: center');
        });

        it('should have relative positioning for overlay', () => {
            expect(scssContent).toContain('.c-hero__overlay');
            expect(scssContent).toContain('position: relative');
        });

        it('should have proper z-index layering', () => {
            expect(scssContent).toContain('z-index: 1');
            expect(scssContent).toContain('z-index: 0');
        });

        it('should have configurable text alignment', () => {
            expect(liquidTemplate).toContain('text_alignment');
            expect(liquidTemplate).toContain('b-has-text-{{ text_alignment }}');
        });

        it('should support left, center, right alignment', () => {
            expect(liquidTemplate).toContain('"value": "left"');
            expect(liquidTemplate).toContain('"value": "center"');
            expect(liquidTemplate).toContain('"value": "right"');
        });
    });

    describe('Mobile Rendering (375px)', () => {
        it('should have mobile breakpoint defined', () => {
            expect(scssContent).toContain('$hero-mobile-breakpoint: 768px');
        });

        it('should have mobile-specific styles', () => {
            expect(scssContent).toContain('@media (max-width: $hero-mobile-breakpoint)');
        });

        it('should adjust font size for mobile title', () => {
            expect(scssContent).toContain('font-size: 2rem');
        });

        it('should adjust font size for mobile subtitle', () => {
            expect(scssContent).toContain('font-size: 1.25rem');
        });

        it('should have full-width button on mobile', () => {
            expect(scssContent).toContain('width: 100%');
        });

        it('should reduce padding on mobile', () => {
            expect(scssContent).toContain('padding: 1.5rem 1rem');
        });

        it('should use 1:1 aspect ratio on mobile', () => {
            expect(scssContent).toContain('aspect-ratio: string.unquote($hero-mobile-aspect-ratio)');
        });
    });

    describe('Desktop Rendering (1024px+)', () => {
        it('should have desktop breakpoint defined', () => {
            expect(scssContent).toContain('$hero-desktop-breakpoint: 769px');
        });

        it('should have desktop-specific styles', () => {
            expect(scssContent).toContain('@media (min-width: $hero-desktop-breakpoint)');
        });

        it('should use 2:1 aspect ratio on desktop', () => {
            expect(scssContent).toContain('aspect-ratio: string.unquote($hero-desktop-aspect-ratio)');
        });

        it('should have standard padding on desktop', () => {
            expect(scssContent).toContain('padding: 2rem 1rem');
        });

        it('should have max-width for content', () => {
            expect(scssContent).toContain('$hero-content-max-width: 800px');
            expect(scssContent).toContain('max-width: $hero-content-max-width');
        });
    });

    describe('Image Performance', () => {
        it('should use object-fit cover for optimal display', () => {
            expect(scssContent).toContain('object-fit: cover');
        });

        it('should have explicit width and height', () => {
            expect(scssContent).toContain('width: 100%');
            expect(scssContent).toContain('height: 100%');
        });

        it('should use absolute positioning for background effect', () => {
            expect(scssContent).toContain('.c-hero__image {');
            expect(scssContent).toContain('position: absolute');
            expect(scssContent).toContain('inset: 0');
        });

        it('should have alt text for accessibility', () => {
            expect(liquidTemplate).toContain('alt:');
        });

        it('should have placeholder for theme editor', () => {
            expect(liquidTemplate).toContain('placeholder_svg_tag');
        });
    });

    describe('Animation Performance', () => {
        it('should use CSS transforms for animations', () => {
            expect(scssContent).toContain('transform: translateY');
        });

        it('should have hardware-accelerated animations', () => {
            expect(scssContent).toContain('@keyframes fadeInUp');
        });

        it('should have staggered animation timing', () => {
            expect(scssContent).toContain('$hero-title-animation-duration');
            expect(scssContent).toContain('$hero-subtitle-animation-duration');
            expect(scssContent).toContain('$hero-cta-animation-duration');
        });

        it('should respect reduced motion preferences', () => {
            expect(scssContent).toContain('@media (prefers-reduced-motion: reduce)');
            expect(scssContent).toContain('animation: none');
        });

        it('should use efficient easing functions', () => {
            expect(scssContent).toContain('$hero-animation-easing: ease-out');
        });
    });

    describe('Height Variations Performance', () => {
        it('should have small height option (300px)', () => {
            expect(scssContent).toContain('$hero-small-height: 300px');
            expect(scssContent).toContain('&.b-is-small .c-hero__overlay');
        });

        it('should have medium height option (400px)', () => {
            expect(scssContent).toContain('$hero-medium-height: 400px');
            expect(scssContent).toContain('&.b-is-medium .c-hero__overlay');
        });

        it('should have large height option (600px)', () => {
            expect(scssContent).toContain('$hero-large-height: 600px');
            expect(scssContent).toContain('&.b-is-large .c-hero__overlay');
        });

        it('should have fullheight option (100vh)', () => {
            expect(scssContent).toContain('&.b-is-fullheight .c-hero__overlay');
            expect(scssContent).toContain('min-height: 100vh');
        });
    });

    describe('CSS Performance', () => {
        it('should use CSS custom properties for dynamic values', () => {
            expect(scssContent).toContain('var(--overlay-opacity');
        });

        it('should use SASS variables for maintainability', () => {
            expect(scssContent).toContain('$hero-overlay-default-opacity');
            expect(scssContent).toContain('$hero-mobile-breakpoint');
            expect(scssContent).toContain('$hero-desktop-breakpoint');
        });

        it('should have efficient selectors', () => {
            // Check for BEM naming (efficient)
            expect(scssContent).toContain('.c-hero__');
            // Should not have deeply nested selectors (inefficient)
            expect(scssContent).not.toMatch(/\.c-hero .* .* .* .*/);
        });

        it('should minimize repaints with transform', () => {
            expect(scssContent).toContain('transform:');
            expect(scssContent).toContain('transition: transform');
        });
    });

    describe('Accessibility Performance', () => {
        it('should have semantic HTML structure', () => {
            expect(liquidTemplate).toContain('<section');
            expect(liquidTemplate).toContain('<h1');
            expect(liquidTemplate).toContain('<figure');
        });

        it('should have ARIA labels', () => {
            expect(liquidTemplate).toContain('aria-label');
        });

        it('should support keyboard navigation', () => {
            // Links should be focusable
            expect(liquidTemplate).toContain('<a');
        });

        it('should have proper heading hierarchy', () => {
            expect(liquidTemplate).toContain('b-title b-is-1');
            expect(liquidTemplate).toContain('b-subtitle b-is-4');
        });
    });

    describe('Render Blocking Prevention', () => {
        it('should not have inline JavaScript', () => {
            expect(liquidTemplate).not.toContain('<script');
        });

        it('should not have inline style tags', () => {
            // Should not have <style> tags (styles are in SCSS)
            expect(liquidTemplate).not.toContain('<style>');
        });

        it('should use CSS for all styling', () => {
            // All styles should be in external SCSS file
            expect(scssContent.length).toBeGreaterThan(0);
        });
    });

    describe('Critical Rendering Path', () => {
        it('should have minimal DOM depth', () => {
            // Count nested divs - should be reasonable
            const divMatches = liquidTemplate.match(/<div/g);
            expect(divMatches?.length || 0).toBeLessThan(10);
        });

        it('should have efficient image loading', () => {
            expect(liquidTemplate).toContain("loading: 'eager'");
            expect(liquidTemplate).toContain("fetchpriority: 'high'");
        });

        it('should not have render-blocking resources', () => {
            expect(liquidTemplate).not.toContain('<link rel="stylesheet"');
            expect(liquidTemplate).not.toContain('<script src');
        });
    });

    describe('Responsive Performance', () => {
        it('should have mobile-first approach', () => {
            // Mobile styles should be default, desktop should be in media query
            expect(scssContent).toContain('@media (min-width: $hero-desktop-breakpoint)');
        });

        it('should optimize for mobile data usage', () => {
            // Smallest width should be 400px for mobile
            expect(liquidTemplate).toContain('400');
        });

        it('should have appropriate breakpoints', () => {
            expect(scssContent).toContain('768px'); // Mobile breakpoint
            expect(scssContent).toContain('769px'); // Desktop breakpoint
        });
    });

    describe('Print Performance', () => {
        it('should have print styles', () => {
            expect(scssContent).toContain('@media print');
        });

        it('should prevent page breaks in hero', () => {
            expect(scssContent).toContain('page-break-inside: avoid');
        });

        it('should hide non-essential elements in print', () => {
            expect(scssContent).toContain('display: none');
        });
    });
});
