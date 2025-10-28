const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');

const { analyzeAssets, parseArguments } = require('../scripts/analyze-assets');

test('parseArguments merges defaults and CLI overrides', () => {
  const options = parseArguments([
    '--input=reports,other.json',
    '--output=out/summary',
    '--formats=markdown,csv',
    '--asset-root=theme'
  ]);

  assert.deepEqual(options.input, ['reports', 'other.json']);
  assert.equal(options.outputDir, 'out/summary');
  assert.deepEqual(options.formats, ['markdown', 'csv']);
  assert.equal(options.assetRoot, 'theme');
});

test('analyzeAssets produces summaries with third-party annotations', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'analyze-assets-'));
  const reportDir = path.join(tmp, 'reports');
  const outputDir = path.join(tmp, 'summary');
  const assetRoot = tmp;
  await fs.mkdir(reportDir, { recursive: true });
  await fs.mkdir(path.join(assetRoot, 'assets'), { recursive: true });

  await fs.writeFile(path.join(assetRoot, 'assets', 'application.css'), 'body { color: black; }', 'utf8');

  const report = {
    baseUrl: 'https://shop.test',
    results: [
      {
        template: 'home',
        status: 'complete',
        blockingAssets: [
          {
            path: 'https://shop.test/assets/application.css',
            type: 'css',
            duration: 1250.456,
            transferSize: 10240,
            impact: 'high',
            thirdParty: false
          },
          {
            path: 'https://cdn.thirdparty.com/tag.js',
            type: 'script',
            duration: 320.12,
            transferSize: 2048,
            impact: 'medium',
            thirdParty: true,
            owner: 'Marketing',
            mitigation: 'Contact vendor to async load'
          }
        ]
      }
    ]
  };

  await fs.writeFile(path.join(reportDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');

  const result = await analyzeAssets({
    input: [reportDir],
    outputDir,
    formats: ['markdown', 'csv'],
    assetRoot
  });

  const markdown = await fs.readFile(result.markdownPath, 'utf8');
  const csv = await fs.readFile(result.csvPath, 'utf8');

  assert.equal(result.warnings.length, 0);
  assert.match(markdown, /\| home \| high \| css \| No \| 1250\.46 \| 10240 \|/);
  assert.match(markdown, /Marketing/);
  assert.match(markdown, /Yes \| 320\.12 \| 2048 \| `https:\/\/cdn\.thirdparty\.com\/tag\.js`/);

  const csvLines = csv.trim().split(/\r?\n/);
  assert.ok(csvLines[0].includes('template,impact,type,third_party'));
  assert.ok(csvLines.some((line) => line.includes('home,high,css,No,1250.46,10240,https://shop.test/assets/application.css')));
  assert.ok(csvLines.some((line) => line.includes('home,medium,script,Yes,320.12,2048,https://cdn.thirdparty.com/tag.js,Marketing,Contact vendor to async load')));
});

test('analyzeAssets warns when local assets are missing', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'analyze-assets-missing-'));
  const reportDir = path.join(tmp, 'reports');
  const outputDir = path.join(tmp, 'summary');
  await fs.mkdir(reportDir, { recursive: true });

  const report = {
    baseUrl: 'https://shop.test',
    results: [
      {
        template: 'product',
        status: 'complete',
        blockingAssets: [
          {
            path: 'https://shop.test/assets/missing.css',
            type: 'css',
            duration: 400,
            transferSize: 1000,
            impact: 'medium',
            thirdParty: false
          }
        ]
      }
    ]
  };

  await fs.writeFile(path.join(reportDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');

  const result = await analyzeAssets({
    input: [reportDir],
    outputDir,
    formats: ['markdown'],
    assetRoot: tmp
  });

  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /Missing local file/);

  const markdown = await fs.readFile(result.markdownPath, 'utf8');
  assert.match(markdown, /Missing/);
});
