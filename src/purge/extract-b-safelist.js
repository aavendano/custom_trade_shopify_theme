#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const OUTPUT_PATH = path.join("src", "purge", "b-safelist.json");
const LIQUID_GLOBS = "{blocks,sections,snippets,layout,templates}/**/*.liquid";
const SCHEMA_REGEX = /{%\s*schema\s*%}\s*([\s\S]*?)\s*{%\s*endschema\s*%}/gi;
const OPTION_TYPES = new Set(["select", "radio", "button_group", "segmented", "checkbox"]);

// Regex patterns for common dynamic Bulma classes
const DYNAMIC_CLASS_PATTERNS = [
  // Numeric modifiers (b-is-1 through b-is-12, etc.)
  /^b-is-\d+$/,
  /^b-is-\d+-mobile$/,
  /^b-is-\d+-tablet$/,
  /^b-is-\d+-desktop$/,
  /^b-is-\d+-widescreen$/,
  /^b-is-\d+-fullhd$/,

  // Column sizes
  /^b-column$/,
  /^b-is-\d+-tablet$/,
  /^b-is-\d+-desktop$/,
  /^b-is-half(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-one-third(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-two-thirds(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-one-quarter(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-three-quarters(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-one-fifth(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-two-fifths(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-three-fifths(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-four-fifths(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,
  /^b-is-full(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,

  // Gap sizes
  /^b-is-variable$/,
  /^b-\d+$/,

  // Spacing utilities (margin, padding)
  /^b-m[trblxy]?-\d+$/,
  /^b-p[trblxy]?-\d+$/,
  /^b-m[trblxy]?-\d+-mobile$/,
  /^b-p[trblxy]?-\d+-mobile$/,
  /^b-m[trblxy]?-\d+-tablet$/,
  /^b-p[trblxy]?-\d+-tablet$/,
  /^b-m[trblxy]?-\d+-desktop$/,
  /^b-p[trblxy]?-\d+-desktop$/,

  // Size modifiers
  /^b-is-size-\d+(-mobile|-tablet|-desktop|-widescreen|-fullhd)?$/,

  // Grid column span
  /^b-is-col-span-\d+$/,

  // Aspect ratios
  /^b-is-\d+by\d+$/,
  /^b-is-\d+by\d+-mobile$/,
  /^b-is-\d+by\d+-tablet$/,
  /^b-is-\d+by\d+-desktop$/,
];

/**
 * Recursively collect all settings arrays we care about inside a schema object.
 */
function collectSettings(schema) {
  const buckets = [];

  if (Array.isArray(schema.settings)) {
    buckets.push(schema.settings);
  }

  if (Array.isArray(schema.blocks)) {
    schema.blocks.forEach((block) => {
      if (Array.isArray(block.settings)) {
        buckets.push(block.settings);
      }
    });
  }

  if (Array.isArray(schema.presets)) {
    schema.presets.forEach((preset) => {
      if (Array.isArray(preset.blocks)) {
        preset.blocks.forEach((block) => {
          if (Array.isArray(block.settings)) {
            buckets.push(block.settings);
          }
        });
      }
    });
  }

  return buckets.flat();
}

function collectValue(candidate, collector) {
  if (typeof candidate === "string" && candidate.startsWith("b-")) {
    collector.add(candidate);
  }
}

function extractFromSettings(setting, collector) {
  if (OPTION_TYPES.has(setting.type) && Array.isArray(setting.options)) {
    setting.options.forEach((option) => {
      if (typeof option === "string") {
        collectValue(option, collector);
      } else if (option && typeof option.value === "string") {
        collectValue(option.value, collector);
      }
    });
  }

  collectValue(setting.default, collector);
}

/**
 * Extract classes from Liquid template content, including those with variable interpolation
 */
function extractClassesFromLiquidContent(content, collector, dynamicPatterns) {
  // Match class attributes: class="..." or class='...'
  const classAttrRegex = /class=["']([^"']*?)["']/g;
  let match;

  while ((match = classAttrRegex.exec(content)) !== null) {
    const classString = match[1];

    // Split by spaces and process each class
    const classes = classString.split(/\s+/);

    classes.forEach((cls) => {
      // Skip empty strings
      if (!cls) return;

      // If it's a complete b- class without Liquid variables, add it directly
      if (cls.startsWith("b-") && !cls.includes("{{") && !cls.includes("{%")) {
        collector.add(cls);
      }

      // If it contains Liquid variable interpolation, try to extract the pattern
      if (cls.includes("{{") || cls.includes("{%")) {
        // Extract static parts that start with b-
        const staticParts = cls.split(/{{.*?}}|{%.*?%}/);
        staticParts.forEach((part) => {
          if (part.startsWith("b-")) {
            // Add partial class patterns that might be completed by Liquid
            const trimmed = part.trim();
            if (trimmed) {
              // Try to match against dynamic patterns
              dynamicPatterns.forEach((pattern) => {
                if (pattern.test(trimmed)) {
                  collector.add(trimmed);
                }
              });
            }
          }
        });
      }
    });
  }
}

/**
 * Convert regex patterns to PurgeCSS-compatible format
 */
function convertPatternsToSafelist(patterns) {
  return patterns.map((pattern) => {
    // Convert regex to string representation for PurgeCSS
    return pattern.toString().slice(1, -1); // Remove leading / and trailing /
  });
}

function main() {
  const files = glob.sync(LIQUID_GLOBS, { nodir: true });
  const safelist = new Set();
  const dynamicClasses = new Set();

  console.log(`[purge] Scanning ${files.length} Liquid files...`);

  files.forEach((file) => {
    const contents = fs.readFileSync(file, "utf8");

    // Extract from schema blocks
    const matches = contents.matchAll(SCHEMA_REGEX);
    for (const match of matches) {
      const json = match[1];

      try {
        const schema = JSON.parse(json);
        const settings = collectSettings(schema);
        settings.forEach((setting) => extractFromSettings(setting, safelist));
      } catch (error) {
        console.warn(`[purge] Could not parse schema in ${file}: ${error.message}`);
      }
    }

    // Extract from template content
    extractClassesFromLiquidContent(contents, safelist, DYNAMIC_CLASS_PATTERNS);
  });

  // Generate pattern strings for regex-based safelisting
  const patternStrings = convertPatternsToSafelist(DYNAMIC_CLASS_PATTERNS);

  // Combine everything
  const orderedList = Array.from(safelist).sort();

  // Create output object with both standard classes and patterns
  const output = {
    standard: orderedList,
    patterns: patternStrings,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  console.log(`[purge] ✓ Extracted ${orderedList.length} explicit safelist classes`);
  console.log(`[purge] ✓ Added ${patternStrings.length} dynamic class patterns`);
  console.log(`[purge] ✓ Safelist written to ${OUTPUT_PATH}`);

  // Show some examples of what was found
  if (orderedList.length > 0) {
    console.log(`[purge] Sample classes: ${orderedList.slice(0, 5).join(", ")}...`);
  }
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
