const purgecssModule = require("@fullhuman/postcss-purgecss");
const purgecss =
    typeof purgecssModule === "function" ? purgecssModule : purgecssModule.default;

let extractedSafelist = [];
try {
    extractedSafelist = require("./purge/base-safelist.json");
} catch (error) {
    console.warn("[purgecss] Could not load base-safelist.json, using empty safelist");
}

// Manual safelist for common Shopify theme classes that should always be preserved
const manualSafelist = [
    // Shopify editor classes
    /^shopify-*/,

    // Common utility classes
    "hidden",
    "visually-hidden",
    "visually-hidden--inline",
    "overflow-hidden",
    "visibility-hidden",
    "skip-to-content-link",

    // State classes
    "active",
    "current",
    "selected",
    "open",
    "closed",
    "disabled",
    "loading",
    "error",
    "success",

    // Animation classes
    "motion-reduce",
    "animate-arrow",

    // Focus classes
    "focused",
    "focus-inset",
    "focus-none",
    "focus-offset",

    // Common layout classes
    "page-width",
    "page-width-desktop",
    "page-width-tablet",
    "page-width--narrow",
    "page-margin",

    // Responsive visibility
    "small-hide",
    "medium-hide",
    "large-up-hide",

    // Text alignment
    "left",
    "center",
    "right",

    // Common component classes
    "isolate",
    "placeholder",
    "full-width-link",
    "full-unstyled-link",

    // Form classes
    "field__input",
    "form__label",
    "select__select",
];

const combinedSafelist = [
    ...new Set([...(extractedSafelist || []), ...manualSafelist]),
];

module.exports = {
    plugins: [
        purgecss({
            content: [
                "layout/*.liquid",
                "templates/**/*.liquid",
                "templates/**/*.json",
                "sections/*.liquid",
                "snippets/*.liquid",
                "blocks/*.liquid",
            ],
            safelist: {
                standard: combinedSafelist,
                // Deep safelist for dynamic classes with variations
                deep: [
                    /^contains-*/,
                    /^product-card*/,
                    /^collection-card*/,
                    /^article-card*/,
                    /^card*/,
                    /^media*/,
                    /^image*/,
                ],
            },
            // Variables are important in this CSS file
            variables: true,
        }),
    ],
};
