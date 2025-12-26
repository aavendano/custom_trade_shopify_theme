#!/usr/bin/env node

/**
 * Foundation Tests Validation Script
 * 
 * This script validates that all foundation changes are properly implemented
 * by checking the actual files and build outputs.
 */

const fs = require('fs');
const path = require('path');

const TESTS = {
    passed: 0,
    failed: 0,
    warnings: 0,
    results: []
};

function test(name, fn) {
    try {
        fn();
        TESTS.passed++;
        TESTS.results.push({ name, status: '✅ PASS' });
    } catch (error) {
        TESTS.failed++;
        TESTS.results.push({ name, status: '❌ FAIL', error: error.message });
    }
}

function warn(name, message) {
    TESTS.warnings++;
    TESTS.results.push({ name, status: '⚠️  WARN', error: message });
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('🧪 Running Foundation Tests Validation...\n');

// Load files
const compiledCSSPath = path.join(__dirname, '../../assets/a-bulma-full.css');
const purgedCSSPath = path.join(__dirname, '../../assets/a-bulma-purged.css');
const themeLiquidPath = path.join(__dirname, '../../layout/theme.liquid');
const safelistPath = path.join(__dirname, '../purge/b-safelist.json');

const compiledCSS = fs.readFileSync(compiledCSSPath, 'utf-8');
const purgedCSS = fs.readFileSync(purgedCSSPath, 'utf-8');
const themeLiquid = fs.readFileSync(themeLiquidPath, 'utf-8');
const safelist = JSON.parse(fs.readFileSync(safelistPath, 'utf-8'));

// Requirement 10.1: Mobile view support
console.log('Testing Requirement 10.1: Mobile View Support');
test('Mobile responsive classes exist', () => {
    assert(compiledCSS.includes('.b-is-12-mobile'), 'Missing .b-is-12-mobile');
    assert(compiledCSS.includes('.b-is-half-mobile'), 'Missing .b-is-half-mobile');
});

test('Mobile breakpoint media queries exist', () => {
    assert(compiledCSS.match(/@media.*max-width.*768px/), 'Missing mobile media queries');
});

test('Mobile classes preserved in purged CSS', () => {
    assert(purgedCSS.includes('.b-is-12-mobile'), 'Mobile classes purged');
});

// Requirement 10.2: LCP optimization
console.log('\nTesting Requirement 10.2: LCP Optimization');
test('Purged CSS size is optimized', () => {
    const sizeKB = Buffer.byteLength(purgedCSS, 'utf-8') / 1024;
    assert(sizeKB < 300, `Purged CSS too large: ${sizeKB.toFixed(2)} KB`);
});

test('Critical CSS inline (x-cloak)', () => {
    assert(themeLiquid.includes('[x-cloak]'), 'Missing x-cloak rule');
    assert(themeLiquid.includes('display: none !important'), 'x-cloak not using !important');
});

test('JavaScript is deferred', () => {
    // Check for defer attribute (can be before or after src)
    assert(themeLiquid.match(/alpine-bundle\.js[^>]*defer|defer[^>]*alpine-bundle\.js/), 'Alpine not deferred');
    assert(themeLiquid.match(/cart-api\.js[^>]*defer|defer[^>]*cart-api\.js/), 'Cart API not deferred');
});

// Requirement 10.3: No Dawn CSS
console.log('\nTesting Requirement 10.3: Dawn CSS Removal');
test('No base.css reference', () => {
    assert(!themeLiquid.includes("'base.css'"), 'base.css still referenced');
    assert(!themeLiquid.includes('"base.css"'), 'base.css still referenced');
});

test('No Dawn CSS variables', () => {
    assert(!themeLiquid.includes('--color-background:'), 'Dawn variables still present');
    assert(!themeLiquid.includes('--font-body-family:'), 'Dawn variables still present');
    assert(!themeLiquid.includes('--page-width:'), 'Dawn variables still present');
});

test('Only Bulma classes used', () => {
    const bClasses = compiledCSS.match(/\.b-[a-z-]+/g);
    assert(bClasses && bClasses.length > 100, 'Not enough Bulma classes');
});

// Requirement 10.4: No console errors
console.log('\nTesting Requirement 10.4: JavaScript Integrity');
test('Alpine.js bundle loaded', () => {
    assert(themeLiquid.includes('alpine-bundle.js'), 'Alpine bundle not loaded');
});

test('Cart scripts loaded', () => {
    assert(themeLiquid.includes('cart-api.js'), 'cart-api.js not loaded');
    assert(themeLiquid.includes('cart-store.js'), 'cart-store.js not loaded');
});

// Requirement 10.5: x-cloak FOUC prevention
console.log('\nTesting Requirement 10.5: FOUC Prevention');
test('x-cloak rule exists', () => {
    assert(themeLiquid.includes('[x-cloak]'), 'Missing x-cloak');
});

test('x-cloak hides elements', () => {
    const xCloakRegex = /\[x-cloak\]\s*{\s*display:\s*none\s*!important/;
    assert(themeLiquid.match(xCloakRegex), 'x-cloak not hiding elements');
});

test('x-cloak is in critical CSS', () => {
    const xCloakIndex = themeLiquid.indexOf('[x-cloak]');
    const bulmaIndex = themeLiquid.indexOf('a-bulma-');
    assert(xCloakIndex < bulmaIndex, 'x-cloak not in critical CSS');
});

// Requirement 10.6: Image attributes
console.log('\nTesting Requirement 10.6: Image Optimization');
test('Image aspect ratio classes exist', () => {
    assert(compiledCSS.includes('.b-is-1by1'), 'Missing aspect ratio classes');
    assert(compiledCSS.includes('.b-is-16by9'), 'Missing aspect ratio classes');
});

test('Image wrapper classes exist', () => {
    assert(compiledCSS.includes('.b-image'), 'Missing .b-image class');
});

// Requirement 10.7: Bulma columns
console.log('\nTesting Requirement 10.7: Bulma Layout System');
test('Bulma column system exists', () => {
    assert(compiledCSS.includes('.b-columns'), 'Missing .b-columns');
    assert(compiledCSS.includes('.b-column'), 'Missing .b-column');
});

test('Responsive column classes exist', () => {
    assert(compiledCSS.includes('.b-is-12-mobile'), 'Missing responsive columns');
    assert(compiledCSS.includes('.b-is-6-tablet'), 'Missing responsive columns');
    assert(compiledCSS.includes('.b-is-4-desktop'), 'Missing responsive columns');
});

test('Bulma helper classes exist', () => {
    assert(compiledCSS.includes('.b-has-text-centered'), 'Missing helper classes');
    assert(compiledCSS.includes('.b-is-fullwidth'), 'Missing helper classes');
});

// Requirement 10.8: Accessibility
console.log('\nTesting Requirement 10.8: Accessibility');
test('Skip-to-content link exists', () => {
    assert(themeLiquid.includes('skip-to-content'), 'Missing skip-to-content');
    assert(themeLiquid.includes('#MainContent'), 'Missing MainContent anchor');
});

test('Accessibility messages exist', () => {
    assert(themeLiquid.includes('a11y-refresh-page-message'), 'Missing a11y messages');
    assert(themeLiquid.includes('a11y-new-window-message'), 'Missing a11y messages');
});

test('Proper HTML structure', () => {
    assert(themeLiquid.includes('<!doctype html>'), 'Missing doctype');
    assert(themeLiquid.includes('<html'), 'Missing html tag');
    assert(themeLiquid.includes('lang='), 'Missing lang attribute');
});

// Requirement 10.10: PurgeCSS safelist
console.log('\nTesting Requirement 10.10: PurgeCSS Safelist');
test('Safelist has correct structure', () => {
    assert(safelist.standard, 'Missing standard safelist');
    assert(safelist.patterns, 'Missing patterns safelist');
    assert(Array.isArray(safelist.standard), 'Standard is not an array');
    assert(Array.isArray(safelist.patterns), 'Patterns is not an array');
});

test('Dynamic numeric patterns safelisted', () => {
    assert(safelist.patterns.includes('^b-is-\\d+$'), 'Missing numeric pattern');
    assert(safelist.patterns.includes('^b-is-\\d+-mobile$'), 'Missing mobile pattern');
});

test('Column classes safelisted', () => {
    assert(safelist.standard.includes('b-columns'), 'b-columns not safelisted');
    assert(safelist.standard.includes('b-column'), 'b-column not safelisted');
});

test('Safelisted classes preserved in purged CSS', () => {
    assert(purgedCSS.includes('.b-columns'), 'Safelisted class purged');
    assert(purgedCSS.includes('.b-button'), 'Safelisted class purged');
});

// Additional tests
console.log('\nTesting Additional Foundation Features');
test('CSS variable migration', () => {
    assert(compiledCSS.includes('--shopify-font-body-family'), 'Missing Shopify variables');
    assert(compiledCSS.includes('--bulma-radius'), 'Missing Bulma variables');
});

test('B-scope wrapper exists', () => {
    assert(compiledCSS.includes('.b-scope'), 'Missing .b-scope class');
});

test('Conditional CSS loading', () => {
    assert(themeLiquid.includes('use_full_css'), 'Missing conditional loading');
    assert(themeLiquid.includes('a-bulma-purged.css'), 'Missing purged CSS reference');
    assert(themeLiquid.includes('a-bulma-full.css'), 'Missing full CSS reference');
});

test('Significant CSS size reduction', () => {
    const fullSize = Buffer.byteLength(compiledCSS, 'utf-8');
    const purgedSize = Buffer.byteLength(purgedCSS, 'utf-8');
    const reduction = ((fullSize - purgedSize) / fullSize) * 100;
    assert(reduction > 30, `Insufficient reduction: ${reduction.toFixed(2)}%`);
});

// Print results
console.log('\n' + '═'.repeat(70));
console.log('TEST RESULTS');
console.log('═'.repeat(70));

TESTS.results.forEach(result => {
    console.log(`${result.status} ${result.name}`);
    if (result.error) {
        console.log(`   ${result.error}`);
    }
});

console.log('\n' + '═'.repeat(70));
console.log('SUMMARY');
console.log('═'.repeat(70));
console.log(`✅ Passed:   ${TESTS.passed}`);
console.log(`❌ Failed:   ${TESTS.failed}`);
console.log(`⚠️  Warnings: ${TESTS.warnings}`);
console.log(`📊 Total:    ${TESTS.passed + TESTS.failed + TESTS.warnings}`);

if (TESTS.failed === 0) {
    console.log('\n🎉 All foundation tests passed!');
    process.exit(0);
} else {
    console.log('\n⚠️  Some tests failed. Review the errors above.');
    process.exit(1);
}
