const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const { buildAll, applyNamespacePurge } = require('../scripts/build-css');

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const snippetsDir = path.join(projectRoot, 'snippets');

async function readAsset(name) {
  return fs.readFile(path.join(assetsDir, name), 'utf8');
}

test('buildAll produces critical and async CSS bundles', async () => {
  await buildAll();

  const criticalCss = await readAsset('aa-bulma-critical.css');
  const asyncCss = await readAsset('aa-bulma-async.css');
  const inlineSnippet = await fs.readFile(path.join(snippetsDir, 'inline-critical-css.liquid'), 'utf8');

  assert.ok(criticalCss.includes('--b-body-background-color'), 'critical css should include css variables');
  assert.ok(/\.b-navbar/.test(criticalCss), 'critical css should contain prefixed navbar styles');
  assert.ok(/\.b-button/.test(criticalCss), 'critical css should provide button base styles');
  assert.ok(/\.b-panel/.test(asyncCss), 'async css should add deferred component styling');
  assert.ok(!/\.b-panel/.test(criticalCss), 'panel styles remain in async bundle');
  assert.ok(inlineSnippet.includes('<style id="inline-critical-css">'), 'inline snippet should contain style tag');
  assert.ok(
    inlineSnippet.includes("<link rel=\"stylesheet\" href=\"{{ 'aa-bulma-critical.css' | asset_url }}\">"),
    'inline snippet should link back to critical asset for full coverage'
  );
});

test('applyNamespacePurge removes unused b- selectors and preserves others', async () => {
  const css = '.b-used{color:red}.b-unused{color:blue}.button{color:green}.b-button.is-primary{color:purple}';
  const content = [
    {
      raw: '<div class="b-used button"></div><button class="b-button is-primary"></button>',
      extension: 'html'
    }
  ];

  const result = await applyNamespacePurge(css, {
    content,
    safelist: [],
    silent: true
  });

  assert.ok(result.includes('.b-used'), 'keeps used b- selector');
  assert.ok(!result.includes('.b-unused'), 'removes unused b- selector');
  assert.ok(result.includes('.button'), 'preserves non b- selector');
  assert.ok(result.includes('.b-button.is-primary'), 'keeps composite selectors with used b- class');
});
