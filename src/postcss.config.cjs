const purgecssModule = require("@fullhuman/postcss-purgecss");
const purgecss =
  typeof purgecssModule === "function" ? purgecssModule : purgecssModule.default;
const extractedSafelist = require("./purge/b-safelist.json");

const manualSafelist = [
  // Basic HTML elements that might be purged if not explicitly found in liquid templates
  "html",
  "body",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "img",
  "ul",
  "ol",
  "li",
  "blockquote",
  "table",
  "tr",
  "td",
  "th",
  "button",
  "input",
  "label",
  "select",
  "textarea",
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
