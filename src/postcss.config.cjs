const purgecssModule = require("@fullhuman/postcss-purgecss");
const purgecss =
  typeof purgecssModule === "function" ? purgecssModule : purgecssModule.default;
const safelistData = require("./purge/b-safelist.json");

// Handle both old format (array) and new format (object with standard/patterns)
const extractedSafelist = Array.isArray(safelistData)
  ? safelistData
  : (safelistData.standard || []);

const extractedPatterns = Array.isArray(safelistData)
  ? []
  : (safelistData.patterns || []);

const manualSafelist = [
  // Add string classes that should always be preserved here.
];

const manualPatterns = [
  // Add regex patterns that should always be preserved here.
  // Example: /^b-custom-.*$/
];

const combinedSafelist = [
  ...new Set([...(extractedSafelist || []), ...manualSafelist]),
];

const combinedPatterns = [
  ...new Set([...(extractedPatterns || []), ...manualPatterns]),
].map(pattern => new RegExp(pattern));

module.exports = {
  plugins: [
    purgecss({
      content: [
        "layout/*.liquid",
        "templates/**/*.liquid", // Revisa todos los templates (incluyendo subcarpetas)
        "sections/*.liquid",
        "snippets/*.liquid",
        "blocks/*.liquid",
      ],
      safelist: {
        standard: combinedSafelist,
        deep: combinedPatterns,
      },
    }),
  ],
};
