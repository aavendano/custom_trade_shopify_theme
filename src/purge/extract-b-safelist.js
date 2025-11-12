#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

const OUTPUT_PATH = path.join("src", "purge", "b-safelist.json");
const LIQUID_GLOBS = ["blocks/**/*.liquid", "sections/**/*.liquid", "snippets/**/*.liquid"];
const SCHEMA_REGEX = /{%\s*schema\s*%}\s*([\s\S]*?)\s*{%\s*endschema\s*%}/gi;
const OPTION_TYPES = new Set(["select", "radio", "button_group", "segmented", "checkbox"]);

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

async function main() {
  const files = await glob(LIQUID_GLOBS, { nodir: true });
  const safelist = new Set();

  files.forEach((file) => {
    const contents = fs.readFileSync(file, "utf8");
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
  });

  const orderedList = Array.from(safelist).sort();
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(orderedList, null, 2));

  console.log(`[purge] Extracted ${orderedList.length} safelist classes with prefix 'b-' into ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
