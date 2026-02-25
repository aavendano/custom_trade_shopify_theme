#!/usr/bin/env node

/**
 * Fix columns_desktop validation errors in template JSON files
 *
 * The multicolumn section has:
 * - min: 1, max: 7, step: 2
 * - Valid values: 1, 3, 5, 7
 *
 * This script fixes any columns_desktop: 6 to columns_desktop: 5
 * in multicolumn sections only.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const FILES_TO_FIX = [
    'templates/404.json',
    'templates/list-collections.json',
    'templates/metaobject/location_page.json',
    'templates/metaobject/region.json'
];

function fixTemplate(filePath) {
    console.log(`\n🔧 Fixing ${filePath}...`);

    const fullPath = path.join(__dirname, '../..', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`  ⚠️  File not found: ${fullPath}`);
        return false;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    let commentBlock = '';
    let jsonContent = content;

    // Check if file starts with a comment block
    if (content.trim().startsWith('/*')) {
        const commentEnd = content.indexOf('*/');
        if (commentEnd !== -1) {
            commentBlock = content.substring(0, commentEnd + 2) + '\n';
            jsonContent = content.substring(commentEnd + 2).trim();
        }
    }

    let data;

    try {
        data = JSON.parse(jsonContent);
    } catch (error) {
        console.log(`  ❌ Failed to parse JSON: ${error.message}`);
        return false;
    }

    let fixed = false;

    // Iterate through all sections
    for (const [sectionId, section] of Object.entries(data.sections || {})) {
        // Check if this is a multicolumn section
        if (section.type === 'multicolumn') {
            const currentValue = section.settings?.columns_desktop;

            // Multicolumn only allows odd numbers: 1, 3, 5, 7
            // Fix invalid even numbers
            if (currentValue === 4 || currentValue === 6) {
                const newValue = currentValue === 4 ? 3 : 5;
                console.log(`  ✓ Found multicolumn section "${sectionId}" with columns_desktop: ${currentValue}`);
                section.settings.columns_desktop = newValue;
                console.log(`    → Changed to columns_desktop: ${newValue}`);
                fixed = true;
            }
        }
    }

    if (fixed) {
        // Write back with proper formatting
        const newJsonContent = JSON.stringify(data, null, 2);
        const newContent = commentBlock + newJsonContent + '\n';
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`  ✅ File updated successfully`);
        return true;
    } else {
        console.log(`  ℹ️  No changes needed`);
        return false;
    }
}

console.log('🚀 Starting template fix script...');
console.log('='.repeat(60));

let totalFixed = 0;

FILES_TO_FIX.forEach(file => {
    if (fixTemplate(file)) {
        totalFixed++;
    }
});

console.log('\n' + '='.repeat(60));
console.log(`✨ Complete! Fixed ${totalFixed} file(s)`);

if (totalFixed > 0) {
    console.log('\n📝 Next steps:');
    console.log('  1. Review the changes');
    console.log('  2. Upload the fixed templates to Shopify');
    console.log('  3. Verify no more validation errors');
}
