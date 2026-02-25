/**
 * Unit Tests for Featured Blog Section
 * Tests for sections/aa-featured-blog.liquid
 *
 * Coverage:
 * - Template structure
 * - Bulma components
 * - Responsive grid
 * - Article card rendering
 * - Schema configuration
 * - Accessibility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Featured Blog Section Tests', () => {
    let liquidTemplate;
    let articleCardSnippet;
    let placeholderSnippet;
    let scssContent;

    beforeEach(() => {
        const templatePath = path.resolve(__dirname, '../../sections/aa-featured-blog.liquid');
        liquidTemplate = fs.readFileSync(templatePath, 'utf-8');

        const articleCardPath = path.resolve(__dirname, '../../snippets/aa-article-card.liquid');
        articleCardSnippet = fs.readFileSync(articleCardPath, 'utf-8');

        const placeholderPath = path.resolve(__dirname, '../../snippets/aa-article-card-placeholder.liquid');
        placeholderSnippet = fs.readFileSync(placeholderPath, 'utf-8');

        const scssPath = path.resolve(__dirname, '../../src/bulma/sass/custom/_featured-blog.scss');
        scssContent = fs.readFileSync(scssPath, 'utf-8');
    });

    describe('Template Structure', () => {
        it('should have b-section wrapper with Bulma padding', () => {
            expect(liquidTemplate).toContain('class="b-section b-py-6"');
        });

        it('should have b-container', () => {
            expect(liquidTemplate).toContain('class="b-container"');
        });

        it('should have data-section-id', () => {
            expect(liquidTemplate).toContain('data-section-id="{{ section.id }}"');
        });

        it('should not have Dawn CSS dependencies', () => {
            expect(liquidTemplate).not.toContain('component-slider.css');
            expect(liquidTemplate).not.toContain('component-card.css');
            expect(liquidTemplate).not.toContain('section-featured-blog.css');
        });
    });

    describe('Bulma Grid', () => {
        it('should use b-columns for grid', () => {
            expect(liquidTemplate).toContain('class="b-columns b-is-multiline');
        });

        it('should use b-column for items', () => {
            expect(liquidTemplate).toContain('class="b-column');
        });

        it('should have responsive column sizes', () => {
            expect(liquidTemplate).toContain('-desktop');
            expect(liquidTemplate).toContain('-tablet');
            expect(liquidTemplate).toContain('-mobile');
        });

        it('should calculate column width based on columns setting', () => {
            expect(liquidTemplate).toContain('12 | divided_by: columns');
        });
    });

    describe('Header Section', () => {
        it('should have header wrapper with Bulma flex utilities', () => {
            expect(liquidTemplate).toContain('b-is-flex b-is-justify-content-space-between');
        });

        it('should use Bulma title', () => {
            expect(liquidTemplate).toContain('class="b-title b-is-{{ section.settings.heading_size }} b-mb-4-mobile"');
        });

        it('should have view all button for mobile hide', () => {
            expect(liquidTemplate).toContain('b-is-hidden-mobile');
        });
    });

    describe('Article Rendering', () => {
        it('should render aa-article-card snippet', () => {
            expect(liquidTemplate).toContain("{% render 'aa-article-card'");
        });

        it('should pass article parameters', () => {
            expect(liquidTemplate).toContain('article: article');
            expect(liquidTemplate).toContain('blog: blog');
        });

        it('should pass show settings', () => {
            expect(liquidTemplate).toContain('show_image: show_image');
            expect(liquidTemplate).toContain('show_date: show_date');
            expect(liquidTemplate).toContain('show_author: show_author');
        });

        it('should limit posts', () => {
            expect(liquidTemplate).toContain('limit: post_limit');
        });
    });

    describe('Placeholder Content', () => {
        it('should render placeholder when no blog', () => {
            expect(liquidTemplate).toContain("{% render 'aa-article-card-placeholder'");
        });

        it('should loop through post_limit for placeholders', () => {
            expect(liquidTemplate).toContain('for i in (1..post_limit)');
        });

        it('should pass index to placeholder', () => {
            expect(liquidTemplate).toContain('index: forloop.index');
        });
    });

    describe('Footer Section', () => {
        it('should have footer wrapper with Bulma utilities', () => {
            expect(liquidTemplate).toContain('b-has-text-centered b-mt-6');
        });

        it('should center footer content', () => {
            expect(liquidTemplate).toContain('b-has-text-centered');
        });

        it('should use Bulma button', () => {
            expect(liquidTemplate).toContain('class="b-button b-is-primary b-is-medium"');
        });

        it('should show footer only when needed', () => {
            expect(liquidTemplate).toContain('blog.articles_count > post_limit');
        });
    });

    describe('Schema Configuration', () => {
        it('should have valid JSON schema', () => {
            const schemaMatch = liquidTemplate.match(/{% schema %}([\s\S]*?){% endschema %}/);
            expect(schemaMatch).toBeTruthy();
            const schema = JSON.parse(schemaMatch[1]);
            expect(schema).toBeTruthy();
        });

        it('should have section name', () => {
            expect(liquidTemplate).toContain('"name": "AA Featured Blog"');
        });

        it('should have blog setting', () => {
            expect(liquidTemplate).toContain('"type": "blog"');
        });

        it('should have post_limit range', () => {
            expect(liquidTemplate).toContain('"id": "post_limit"');
            expect(liquidTemplate).toContain('"min": 2');
            expect(liquidTemplate).toContain('"max": 12');
        });

        it('should have heading settings', () => {
            expect(liquidTemplate).toContain('"id": "heading"');
            expect(liquidTemplate).toContain('"id": "heading_size"');
        });

        it('should have layout settings', () => {
            expect(liquidTemplate).toContain('"id": "columns_desktop"');
            expect(liquidTemplate).toContain('"id": "show_view_all"');
        });

        it('should have display toggles', () => {
            expect(liquidTemplate).toContain('"id": "show_image"');
            expect(liquidTemplate).toContain('"id": "show_date"');
            expect(liquidTemplate).toContain('"id": "show_author"');
        });

        it('should have presets', () => {
            expect(liquidTemplate).toContain('"presets"');
            expect(liquidTemplate).toContain('"category": "Blog"');
        });
    });

    describe('Article Card Component', () => {
        it('should use b-card with Bulma flex utilities', () => {
            expect(articleCardSnippet).toContain('class="b-card aa-article-card b-is-flex b-is-flex-direction-column b-has-radius"');
        });

        it('should have b-card-image', () => {
            expect(articleCardSnippet).toContain('class="b-card-image"');
        });

        it('should have 16:9 aspect ratio', () => {
            expect(articleCardSnippet).toContain('b-is-16by9');
        });

        it('should use lazy loading for images', () => {
            expect(articleCardSnippet).toContain("loading: 'lazy'");
        });

        it('should have responsive image widths', () => {
            expect(articleCardSnippet).toContain("widths: '400, 600, 800'");
        });

        it('should have sizes attribute', () => {
            expect(articleCardSnippet).toContain('sizes:');
        });

        it('should have metadata section with Bulma flex', () => {
            expect(articleCardSnippet).toContain('b-is-flex b-is-flex-wrap-wrap b-is-align-items-center');
        });

        it('should show date with icon', () => {
            expect(articleCardSnippet).toContain('<time');
            expect(articleCardSnippet).toContain('<svg');
        });

        it('should show author when enabled', () => {
            expect(articleCardSnippet).toContain('show_author');
        });

        it('should have title with link', () => {
            expect(articleCardSnippet).toContain('class="b-title b-is-4');
            expect(articleCardSnippet).toContain('class="aa-article-card__link"');
        });

        it('should have excerpt with Bulma utilities', () => {
            expect(articleCardSnippet).toContain('class="b-content b-mb-4 b-has-text-grey b-is-flex-grow-1"');
        });

        it('should truncate excerpt', () => {
            expect(articleCardSnippet).toContain('truncatewords: 20');
        });

        it('should have read more button', () => {
            expect(articleCardSnippet).toContain('class="b-button b-is-text');
        });
    });

    describe('Placeholder Component', () => {
        it('should use placeholder SVG', () => {
            expect(placeholderSnippet).toContain('placeholder_svg_tag');
        });

        it('should vary placeholder images', () => {
            expect(placeholderSnippet).toContain('modulo: 3');
        });

        it('should have placeholder class', () => {
            expect(placeholderSnippet).toContain('aa-article-card--placeholder');
        });

        it('should show current date', () => {
            expect(placeholderSnippet).toContain("'now' | date");
        });

        it('should use translation strings', () => {
            expect(placeholderSnippet).toContain('sections.featured_blog.onboarding_title');
            expect(placeholderSnippet).toContain('sections.featured_blog.onboarding_content');
        });
    });

    describe('SCSS Styles', () => {
        it('should have minimal custom styles', () => {
            expect(scssContent).toContain('.aa-article-card');
        });

        it('should have article card hover effects', () => {
            expect(scssContent).toContain('&:hover');
            expect(scssContent).toContain('transform: translateY(-4px)');
        });

        it('should have link styles', () => {
            expect(scssContent).toContain('.aa-article-card__link');
        });

        it('should have arrow animation', () => {
            expect(scssContent).toContain('.aa-article-card__arrow');
            expect(scssContent).toContain('transform: translateX(4px)');
        });

        it('should have placeholder opacity', () => {
            expect(scssContent).toContain('.aa-article-card--placeholder');
            expect(scssContent).toContain('opacity: 0.7');
        });

        it('should have reduced motion support', () => {
            expect(scssContent).toContain('@media (prefers-reduced-motion: reduce)');
        });

        it('should have print styles', () => {
            expect(scssContent).toContain('@media print');
        });

        it('should use Bulma utilities instead of custom classes', () => {
            // Should NOT have these custom classes (now using Bulma)
            expect(scssContent).not.toContain('.aa-featured-blog__header');
            expect(scssContent).not.toContain('.aa-featured-blog__grid');
            expect(scssContent).not.toContain('.aa-featured-blog__footer');
        });
    });

    describe('Accessibility', () => {
        it('should have semantic HTML', () => {
            expect(articleCardSnippet).toContain('<article');
            expect(articleCardSnippet).toContain('<time');
            expect(articleCardSnippet).toContain('<h3');
        });

        it('should have aria-label on image links', () => {
            expect(articleCardSnippet).toContain('aria-label');
        });

        it('should have datetime attribute', () => {
            expect(articleCardSnippet).toContain('datetime=');
        });

        it('should have alt text on images', () => {
            expect(articleCardSnippet).toContain('alt:');
        });
    });

    describe('No Dawn Dependencies', () => {
        it('should not use slider-component', () => {
            expect(liquidTemplate).not.toContain('<slider-component');
        });

        it('should not use Dawn grid classes', () => {
            expect(liquidTemplate).not.toContain('grid__item');
            expect(liquidTemplate).not.toContain('grid--peek');
        });

        it('should not use Dawn color scheme', () => {
            expect(liquidTemplate).not.toContain('color-{{ section.settings.color_scheme }}');
        });

        it('should not have inline style block', () => {
            expect(liquidTemplate).not.toContain('{%- style -%}');
        });
    });
});
