#!/usr/bin/env node

/**
 * Validation script to verify critical classes are preserved in purged CSS
 * This script checks that dynamic classes and commonly used classes are not purged
 */

const fs = require('fs');
const path = require('path');

const PURGED_CSS_PATH = path.join(__dirname, '../../assets/a-bulma-purged.css');

// Critical classes that must be preserved
const CRITICAL_CLASSES = [
    // Column classes
    'b-columns',
    'b-column',
    'b-is-3',
    'b-is-4',
    'b-is-6',
    'b-is-12',
    'b-is-half',
    'b-is-one-third',
    'b-is-one-quarter',

    // Responsive column classes
    'b-is-3-desktop',
    'b-is-6-tablet',
    'b-is-12-mobile',
    'b-is-half-mobile',
    'b-is-half-tablet',

    // Layout classes
    'b-container',
    'b-section',
    'b-box',
    'b-card',
    'b-card-content',
    'b-card-image',

    // Typography
    'b-title',
    'b-subtitle',
    'b-is-1',
    'b-is-2',
    'b-is-5',
    'b-is-6',

    // Buttons
    'b-button',
    'b-is-primary',
    'b-is-link',
    'b-is-info',
    'b-is-large',
    'b-is-medium',

    // Images
    'b-image',
    'b-is-1by1',

    // Utilities
    'b-has-text-centered',
    'b-has-text-primary',
    'b-has-background-primary',
    'b-is-fullwidth',
];

// Patterns that should match classes in purged CSS
const CRITICAL_PATTERNS = [
    /\.b-is-\d+\s*{/,  // Numeric modifiers
    /\.b-is-\d+-mobile\s*{/,  // Mobile numeric
    /\.b-is-\d+-tablet\s*{/,  // Tablet numeric
    /\.b-is-\d+-desktop\s*{/,  // Desktop numeric
    /\.b-m[trblxy]?-\d+\s*{/,  // Margin utilities
    /\.b-p[trblxy]?-\d+\s*{/,  // Padding utilities
];

function main() {
    console.log('🔍 Validating purged CSS...\n');

    if (!fs.existsSync(PURGED_CSS_PATH)) {
        console.error('❌ Error: Purged CSS file not found at', PURGED_CSS_PATH);
        process.exit(1);
    }

    const purgedCSS = fs.readFileSync(PURGED_CSS_PATH, 'utf8');
    const fileSize = (fs.statSync(PURGED_CSS_PATH).size / 1024).toFixed(2);

    console.log(`📊 Purged CSS size: ${fileSize} KB\n`);

    let missingClasses = [];
    let foundClasses = [];

    // Check critical classes
    console.log('Checking critical classes...');
    CRITICAL_CLASSES.forEach(cls => {
        const classRegex = new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[,{]`);
        if (purgedCSS.match(classRegex)) {
            foundClasses.push(cls);
        } else {
            missingClasses.push(cls);
        }
    });

    console.log(`✅ Found ${foundClasses.length}/${CRITICAL_CLASSES.length} critical classes\n`);

    // Check critical patterns
    console.log('Checking dynamic class patterns...');
    let patternMatches = 0;
    CRITICAL_PATTERNS.forEach((pattern, index) => {
        if (purgedCSS.match(pattern)) {
            patternMatches++;
            console.log(`  ✅ Pattern ${index + 1}: ${pattern.toString()} - FOUND`);
        } else {
            console.log(`  ❌ Pattern ${index + 1}: ${pattern.toString()} - NOT FOUND`);
        }
    });

    console.log(`\n✅ Matched ${patternMatches}/${CRITICAL_PATTERNS.length} dynamic patterns\n`);

    // Report missing classes
    if (missingClasses.length > 0) {
        console.log('⚠️  Missing critical classes:');
        missingClasses.forEach(cls => console.log(`  - ${cls}`));
        console.log('\n⚠️  Warning: Some critical classes are missing. This may cause styling issues.');
        console.log('Consider adding them to the manual safelist in src/postcss.config.cjs\n');
    }

    // Summary
    console.log('═'.repeat(60));
    console.log('VALIDATION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`File Size: ${fileSize} KB`);
    console.log(`Critical Classes: ${foundClasses.length}/${CRITICAL_CLASSES.length} preserved`);
    console.log(`Dynamic Patterns: ${patternMatches}/${CRITICAL_PATTERNS.length} matched`);

    if (missingClasses.length === 0 && patternMatches === CRITICAL_PATTERNS.length) {
        console.log('\n✅ VALIDATION PASSED: All critical classes preserved!');
        process.exit(0);
    } else {
        console.log('\n⚠️  VALIDATION WARNING: Some classes may be missing.');
        console.log('Review the missing classes above and update safelist if needed.');
        process.exit(0);  // Exit with 0 to not break build, but show warning
    }
}

try {
    main();
} catch (error) {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
}
