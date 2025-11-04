#!/usr/bin/env node
/**
 * Build Bulma CSS bundles (critical + async) and inline snippet.
 */

const fs = require('node:fs/promises');
const { watch } = require('node:fs');
const path = require('node:path');
const sass = require('sass');
const { PurgeCSS } = require('purgecss');

const projectRoot = path.resolve(__dirname, '..');
const stylesDir = path.join(projectRoot, 'styles');
const assetsDir = path.join(projectRoot, 'assets');
const snippetsDir = path.join(projectRoot, 'snippets');
const DEFAULT_INLINE_BYTE_LIMIT = 220 * 1024; // Keep inline snippet well below Shopify 256 KB ceiling.
const DEFAULT_NAMESPACE_CONTENT = [
  path.join(projectRoot, 'layout/**/*.liquid'),
  path.join(projectRoot, 'sections/**/*.liquid'),
  path.join(projectRoot, 'snippets/**/*.liquid'),
  path.join(projectRoot, 'templates/**/*.liquid'),
  path.join(projectRoot, 'templates/**/*.json'),
  path.join(projectRoot, 'blocks/**/*.liquid'),
  path.join(projectRoot, 'assets/**/*.js'),
  path.join(projectRoot, 'assets/**/*.ts')
];
const DEFAULT_NAMESPACE_SAFELIST_PATH = path.join(projectRoot, 'config', 'namespace-safelist.json');
const NON_NAMESPACE_GREEDY_REGEX = /^(?!.*\bb-).*/;
const B_NAMESPACE_REGEX = /\b(b-[A-Za-z0-9_-]+)/g;

const ENTRIES = [
  {
    source: path.join(stylesDir, 'bulma-critical.scss'),
    output: path.join(assetsDir, 'aa-bulma-critical.css'),
    inlineSnippet: path.join(snippetsDir, 'inline-critical-css.liquid'),
    inline: true
  },
  {
    source: path.join(stylesDir, 'bulma-async.scss'),
    output: path.join(assetsDir, 'aa-bulma-async.css'),
    inline: false
  }
];

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function namespacePurgeDisabled() {
  if (process.env.BULMA_DISABLE_NAMESPACE_PURGE && process.env.BULMA_DISABLE_NAMESPACE_PURGE !== '0') {
    return true;
  }
  return process.argv.some((arg) => arg === '--no-namespace-purge' || arg === '--no-purge');
}

function namespaceExtractor(content) {
  const matches = content.match(B_NAMESPACE_REGEX);
  if (!matches) {
    return [];
  }
  return Array.from(new Set(matches));
}

async function loadNamespaceSafelist(filePath, { silent = false } = {}) {
  if (!filePath) return [];

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      if (!silent) {
        console.warn(`Namespace safelist at ${filePath} must export an array. Ignoring file.`);
      }
      return [];
    }

    return data.map((entry) => {
      if (typeof entry === 'string' && entry.startsWith('regex:')) {
        return new RegExp(entry.slice(6));
      }
      if (entry && typeof entry === 'object' && entry.pattern) {
        return new RegExp(entry.pattern, entry.flags || '');
      }
      return entry;
    });
  } catch (error) {
    if (error.code !== 'ENOENT' && !silent) {
      console.warn(`Unable to read namespace safelist at ${filePath}: ${error.message}`);
    }
    return [];
  }
}

function buildSafelist(userEntries = []) {
  const standard = new Set(['html', 'body']);
  const greedy = new Set([NON_NAMESPACE_GREEDY_REGEX]);
  const deep = new Set();

  const entries = Array.isArray(userEntries) ? userEntries : [userEntries];

  for (const entry of entries) {
    if (!entry) continue;

    if (entry instanceof RegExp || typeof entry === 'string') {
      standard.add(entry);
      continue;
    }

    if (Array.isArray(entry)) {
      entry.forEach((item) => {
        if (item instanceof RegExp || typeof item === 'string') {
          standard.add(item);
        }
      });
      continue;
    }

    if (entry && typeof entry === 'object') {
      if (entry.standard) {
        [].concat(entry.standard).forEach((item) => {
          if (item instanceof RegExp || typeof item === 'string') {
            standard.add(item);
          }
        });
      }
      if (entry.greedy) {
        [].concat(entry.greedy).forEach((item) => {
          if (item instanceof RegExp || typeof item === 'string') {
            greedy.add(item);
          }
        });
      }
      if (entry.deep) {
        [].concat(entry.deep).forEach((item) => {
          if (item instanceof RegExp || typeof item === 'string') {
            deep.add(item);
          }
        });
      }
    }
  }

  const safelist = {
    standard: Array.from(standard),
    greedy: Array.from(greedy)
  };

  if (deep.size) {
    safelist.deep = Array.from(deep);
  }

  return safelist;
}

async function applyNamespacePurge(css, options = {}) {
  if (!css || options.disable) return css;

  const purgeContent = options.content || DEFAULT_NAMESPACE_CONTENT;
  const safelist = buildSafelist(options.safelist);

  try {
    const purgeCSS = new PurgeCSS();
    const result = await purgeCSS.purge({
      content: purgeContent,
      css: [{ raw: css }],
      safelist,
      defaultExtractor: options.extractor || namespaceExtractor
    });
    if (result && result[0] && typeof result[0].css === 'string') {
      return result[0].css;
    }
  } catch (error) {
    if (!options.silent) {
      console.warn('Namespace purge failed, returning original CSS:', error.message);
    }
  }

  return css;
}

async function compileEntry(entry, options = {}) {
  const {
    disableNamespacePurge = false,
    namespaceContent = DEFAULT_NAMESPACE_CONTENT,
    namespaceSafelist = [],
    silentNamespacePurge = false
  } = options;

  const result = await sass.compileAsync(entry.source, {
    style: 'compressed',
    loadPaths: [path.join(projectRoot, 'node_modules')]
  });

  let css = result.css;
  if (!disableNamespacePurge) {
    css = await applyNamespacePurge(css, {
      content: namespaceContent,
      safelist: namespaceSafelist,
      silent: silentNamespacePurge
    });
  }

  await fs.mkdir(path.dirname(entry.output), { recursive: true });
  await fs.writeFile(entry.output, `${css}\n`, 'utf8');

  if (entry.inline && entry.inlineSnippet) {
    const inlineLimitRaw = process.env.BULMA_INLINE_LIMIT || options.inlineByteLimit;
    let inlineLimit = Number.parseInt(inlineLimitRaw, 10);
    if (!Number.isFinite(inlineLimit) || inlineLimit <= 0) {
      inlineLimit = DEFAULT_INLINE_BYTE_LIMIT;
    }

    let inlineCss = css;
    let trailingMarkup = '';

    if (inlineCss.length > inlineLimit) {
      const safeCutoff = inlineCss.lastIndexOf('}', inlineLimit);
      const cutoffIndex = safeCutoff === -1 ? inlineLimit : safeCutoff + 1;
      inlineCss = inlineCss.slice(0, cutoffIndex);

      const assetLiquid = `{{ '${path.basename(entry.output)}' | asset_url }}`;
      trailingMarkup = `\n<link rel="preload" href="${assetLiquid}" as="style">\n<link rel="stylesheet" href="${assetLiquid}">\n<noscript><link rel="stylesheet" href="${assetLiquid}"></noscript>`;
    }

    const inlineContent = `{% comment %} Auto-generated by scripts/build-css.js. Do not edit manually. {% endcomment %}\n<style id="inline-critical-css">${inlineCss}</style>${trailingMarkup}\n`;
    await fs.mkdir(path.dirname(entry.inlineSnippet), { recursive: true });
    await fs.writeFile(entry.inlineSnippet, inlineContent, 'utf8');
  }

  return { entry, css };
}

async function buildAll(options = {}) {
  const disableNamespacePurge = options.disableNamespacePurge ?? namespacePurgeDisabled();
  const namespaceContent = options.namespaceContent || DEFAULT_NAMESPACE_CONTENT;
  const namespaceSafelistPath = options.namespaceSafelistPath || process.env.BULMA_NAMESPACE_SAFELIST || DEFAULT_NAMESPACE_SAFELIST_PATH;
  const namespaceSafelist = options.namespaceSafelist ?? (await loadNamespaceSafelist(namespaceSafelistPath, { silent: options.silentNamespacePurge }));

  const outputs = [];
  for (const entry of ENTRIES) {
    outputs.push(
      await compileEntry(entry, {
        disableNamespacePurge,
        namespaceContent,
        namespaceSafelist,
        silentNamespacePurge: options.silentNamespacePurge
      })
    );
  }
  return outputs;
}

function watchAll() {
  console.log('Watching Bulma styles for changes...');
  const debounceMap = new Map();

  const queueBuild = () => {
    if (debounceMap.has('build')) return;
    debounceMap.set(
      'build',
      setTimeout(async () => {
        debounceMap.delete('build');
        try {
          await buildAll();
          console.log('Rebuilt Bulma CSS bundles');
        } catch (error) {
          console.error('Failed to rebuild Bulma bundles:', error);
        }
      }, 50)
    );
  };

  const watcher = watch(stylesDir, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.scss')) return;
    console.log(`Detected ${eventType} in ${filename}`);
    queueBuild();
  });

  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });
}

async function main() {
  if (hasFlag('--watch')) {
    await buildAll();
    watchAll();
    return;
  }

  await buildAll();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to build Bulma CSS bundles:', error);
    process.exit(1);
  });
} process.exitCode = 1;
  });
}

module.exports = {
  buildAll,
  ENTRIES,
  applyNamespacePurge,
  loadNamespaceSafelist,
  DEFAULT_NAMESPACE_CONTENT
};
