const purgecssModule = require("@fullhuman/postcss-purgecss");
const purgecss =
  typeof purgecssModule === "function" ? purgecssModule : purgecssModule.default;
const extractedSafelist = require("./purge/b-safelist.json");

const manualSafelist = [
  // Add string classes that should always be preserved here.
];

const combinedSafelist = [
  ...new Set([...(extractedSafelist || []), ...manualSafelist]),
];

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
        //deep: [ /^b-is-.*$/,  /^b-has-.*$/,],
      },
    }),
  ],
};
