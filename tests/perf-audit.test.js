const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');

const {
  parseArguments,
  runAudit,
  runTemplateWithRetries
} = require('../scripts/perf-audit');

test('parseArguments applies defaults and normalises base URL', () => {
  const result = parseArguments([]);
  assert.deepEqual(result.templates, ['home', 'collection', 'product']);
  assert.equal(result.baseUrl, 'http://127.0.0.1:9292');
  assert.equal(result.outputDir, 'storage/perf-reports');
  assert.equal(result.retries, 3);
  assert.equal(result.retryDelay, 250);
  assert.equal(result.timeout, 45000);
  assert.equal(result.headless, true);
});

test('parseArguments respects CLI overrides', () => {
  const result = parseArguments([
    '--templates=home,product',
    '--output=tmp/reports',
    '--base-url=shop.example.com',
    '--retries=5',
    '--retry-delay=100',
    '--timeout=120000',
    '--headless=false',
    '--owner-map=config/owners.json',
    '--template-map=config/templates.json'
  ]);

  assert.deepEqual(result.templates, ['home', 'product']);
  assert.equal(result.outputDir, 'tmp/reports');
  assert.equal(result.baseUrl, 'https://shop.example.com');
  assert.equal(result.retries, 5);
  assert.equal(result.retryDelay, 100);
  assert.equal(result.timeout, 120000);
  assert.equal(result.headless, false);
  assert.equal(result.ownerMapPath, 'config/owners.json');
  assert.equal(result.templateMapPath, 'config/templates.json');
});

test('runAudit retries failed attempts and writes report', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'perf-audit-'));
  let attemptCount = 0;
  const delays = [];
  let closed = false;
  let writtenPath = null;
  let writtenContent = null;

  const options = {
    baseUrl: 'https://example.com',
    outputDir: tmpDir,
    retries: 3,
    retryDelay: 10,
    timeout: 1000,
    headless: true,
    templates: ['home'],
    ownerMap: {},
    templateMap: {}
  };

  const fakeBrowser = {
    newContext: async () => ({
      newPage: async () => ({
        addInitScript: async () => {},
        goto: async () => {},
        waitForTimeout: async () => {},
        evaluate: async () => ({
          metrics: { LCP: 2, CLS: 0.1, FID: 0.01, TTFB: 0.5 },
          blockingAssets: []
        })
      }),
      close: async () => {}
    }),
    close: async () => {
      closed = true;
    }
  };

  const collectMetrics = async () => {
    attemptCount += 1;
    if (attemptCount < 3) {
      throw new Error(`Synthetic failure ${attemptCount}`);
    }
    return {
      metrics: { LCP: 2, CLS: 0.1, FID: 0.01, TTFB: 0.5 },
      blockingAssets: []
    };
  };

  const delayFn = async (ms) => {
    delays.push(ms);
  };

  const now = () => new Date('2024-01-01T00:00:00.000Z');

  const writer = async (filePath, contents) => {
    writtenPath = filePath;
    writtenContent = contents;
  };

  const { outputPath, report } = await runAudit(options, {
    browserFactory: async () => fakeBrowser,
    collectMetrics,
    delayFn,
    now,
    writer
  });

  assert.equal(attemptCount, 3);
  assert.deepEqual(delays, [10, 20]);
  assert.equal(closed, true);
  assert.ok(writtenPath.endsWith('.json'));
  assert.equal(outputPath, writtenPath);

  const parsed = JSON.parse(writtenContent);
  assert.equal(parsed.baseUrl, 'https://example.com');
  assert.equal(parsed.results.length, 1);
  assert.equal(parsed.results[0].status, 'complete');
  assert.equal(parsed.results[0].attempts, 3);
  assert.deepEqual(report.results[0].metrics, { LCP: 2, CLS: 0.1, FID: 0.01, TTFB: 0.5 });
});

test('runTemplateWithRetries returns failure metadata after exhausting retries', async () => {
  let counter = 0;
  const result = await runTemplateWithRetries(
    async () => {
      counter += 1;
      throw new Error(`Attempt ${counter}`);
    },
    {
      retries: 2,
      retryDelay: 5,
      delayFn: async () => {}
    }
  );

  assert.equal(counter, 2);
  assert.equal(result.status, 'failed');
  assert.equal(result.attempts, 2);
  assert.ok(result.error.message.includes('Attempt 2'));
});
