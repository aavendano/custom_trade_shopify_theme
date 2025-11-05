// ===========================================================
// GULPFILE — Bulma Custom Build para Shopify
// ===========================================================
//
// Este flujo compila Bulma en dos fases (crítico y async),
// aplica PurgeCSS agresivo, minifica con CSSNano y genera
// el snippet inline para Shopify.
//
// -----------------------------------------------------------

const { src, dest, watch, parallel, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const purgecss = require("gulp-purgecss");
const rename = require("gulp-rename");
const gulpif = require("gulp-if");
const through2 = require("through2");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const fs = require("fs");

// ===========================================================
// Configuración general
// ===========================================================

const INLINE_BYTE_LIMIT = 120 * 1024; // Máximo para inline CSS (~120 KB)
const DISABLE_PURGE = process.env.BULMA_DISABLE_NAMESPACE_PURGE === "1";

const paths = {
  styles: {
    critical: "styles/bulma-critical.scss",
    async: "styles/bulma-async.scss",
    watch: "styles/**/*.scss",
  },
  output: {
    assets: "assets",
    snippets: "snippets",
  },
  content: [
    "layout/**/*.liquid",
    "sections/**/*.liquid",
    "snippets/**/*.liquid",
    "templates/**/*.liquid",
    "templates/**/*.json",
    "blocks/**/*.liquid",
    "assets/**/*.js",
  ],
};

// ===========================================================
// PurgeCSS agresivo
// ===========================================================

const purgeConfig = {
  content: paths.content,
  defaultExtractor: (content) => content.match(/\b(b-[A-Za-z0-9_-]+)/g) || [],
  safelist: {
    standard: [
      "html",
      "body",
      "is-active",
      "is-hidden",
      "is-loading",
      "has-text-centered",
      "has-text-white",
      "has-background-primary",
      "has-background-dark",
      "b-button",
      "b-navbar",
      "b-tag",
      "b-notification",
      "b-modal",
      "b-modal-background",
      "b-modal-content",
    ],
    greedy: [/^b-/, /^is-/, /^has-/],
  },
};

// ===========================================================
// Configuración de Sass
// ===========================================================

const sassConfig = {
  outputStyle: "compressed",
  includePaths: ["styles/bulma"],
};

// ===========================================================
// Snippet inline: genera <style> + <link preload>
// ===========================================================

function createInlineSnippet() {
  return through2.obj(function (file, enc, cb) {
    if (file.isNull()) return cb(null, file);

    let css = file.contents.toString();
    let trailingMarkup = "";

    if (css.length > INLINE_BYTE_LIMIT) {
      const cutoff = css.lastIndexOf("}", INLINE_BYTE_LIMIT);
      const safeCut = cutoff === -1 ? INLINE_BYTE_LIMIT : cutoff + 1;
      css = css.slice(0, safeCut);

      const assetUrl = `{{ 'aa-bulma-critical.css' | asset_url }}`;
      trailingMarkup = `\n<link rel="preload" href="${assetUrl}" as="style">\n<link rel="stylesheet" href="${assetUrl}">\n<noscript><link rel="stylesheet" href="${assetUrl}"></noscript>`;
    }

    const content = `{% comment %} Auto-generado por Gulp. No editar. {% endcomment %}\n<style id="inline-critical-css">${css}</style>${trailingMarkup}\n`;
    file.contents = Buffer.from(content);
    file.extname = ".liquid";

    cb(null, file);
  });
}

// ===========================================================
// Tareas de build
// ===========================================================

// 🔹 Build Critical
function buildCritical() {
  return src(paths.styles.critical)
    .pipe(sass(sassConfig).on("error", sass.logError))
    .pipe(gulpif(!DISABLE_PURGE, purgecss(purgeConfig)))
    .pipe(postcss([cssnano()])) // minificación automática
    .pipe(rename("aa-bulma-critical.css"))
    .pipe(dest(paths.output.assets))
    .pipe(createInlineSnippet())
    .pipe(rename("inline-critical-css.liquid"))
    .pipe(dest(paths.output.snippets));
}

// 🔹 Build Async
function buildAsync() {
  return src(paths.styles.async)
    .pipe(sass(sassConfig).on("error", sass.logError))
    .pipe(gulpif(!DISABLE_PURGE, purgecss(purgeConfig)))
    .pipe(postcss([cssnano()])) // minificación automática
    .pipe(rename("aa-bulma-async.css"))
    .pipe(dest(paths.output.assets));
}

// 🔹 Watch
function watchFiles() {
  console.log("👀 Observando cambios en estilos Bulma...");
  watch(paths.styles.watch, parallel(buildCritical, buildAsync));
}

// ===========================================================
// Exportar tareas
// ===========================================================

exports.critical = buildCritical;
exports.async = buildAsync;
exports.build = parallel(buildCritical, buildAsync);
exports.watch = series(exports.build, watchFiles);
exports.default = exports.build;
