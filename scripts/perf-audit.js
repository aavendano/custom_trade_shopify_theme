#!/usr/bin/env node
/**
 * Performance baseline automation.
 * Collects Core Web Vital approximations using Playwright and exports MCP-friendly JSON reports.
 */

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
let cachedChromium = null;
function getChromium() {
  if (cachedChromium) return cachedChromium;
  try {
    const { chromium } = require('playwright');
    cachedChromium = chromium;
    return cachedChromium;
  } catch (error) {
    throw new Error('Playwright is required to run the performance audit. Install the "playwright" package.');
  }
}

const DEFAULT_TEMPLATE_PATHS = {
  home: '/',
  collection: '/collections/all',
  product: '/products/example'
};

const DEFAULT_OPTIONS = {
  baseUrl: 'http://127.0.0.1:9292',
  outputDir: 'storage/perf-reports',
  retries: 3,
  retryDelay: 250,
  timeout: 45000,
  headless: true,
  templates: ['home', 'collection', 'product']
};

function parseArguments(argv, env = process.env) {
  const options = {
    baseUrl: env.PERF_AUDIT_BASE_URL || DEFAULT_OPTIONS.baseUrl,
    outputDir: env.PERF_AUDIT_OUTPUT || DEFAULT_OPTIONS.outputDir,
    retries: env.PERF_AUDIT_RETRIES ? Number(env.PERF_AUDIT_RETRIES) : DEFAULT_OPTIONS.retries,
    retryDelay: env.PERF_AUDIT_RETRY_DELAY ? Number(env.PERF_AUDIT_RETRY_DELAY) : DEFAULT_OPTIONS.retryDelay,
    timeout: env.PERF_AUDIT_TIMEOUT ? Number(env.PERF_AUDIT_TIMEOUT) : DEFAULT_OPTIONS.timeout,
    headless: env.PERF_AUDIT_HEADLESS ? env.PERF_AUDIT_HEADLESS !== 'false' : DEFAULT_OPTIONS.headless,
    templates: env.PERF_TEMPLATES ? env.PERF_TEMPLATES.split(',').map((t) => t.trim()).filter(Boolean) : DEFAULT_OPTIONS.templates,
    ownerMapPath: env.PERF_OWNER_MAP || null,
    templateMapPath: env.PERF_TEMPLATE_MAP || null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue] = arg.includes('=') ? arg.split('=') : [arg, argv[i + 1]];
    const valueProvided = arg.includes('=') ? true : argv[i + 1] && !argv[i + 1].startsWith('--');
    const value = valueProvided ? rawValue : undefined;
    if (!valueProvided && argv[i + 1] && !argv[i + 1].startsWith('--')) i += 1;

    switch (flag) {
      case '--templates':
        if (!value) throw new Error('Missing value for --templates');
        options.templates = value.split(',').map((t) => t.trim()).filter(Boolean);
        break;
      case '--output':
        if (!value) throw new Error('Missing value for --output');
        options.outputDir = value;
        break;
      case '--base-url':
        if (!value) throw new Error('Missing value for --base-url');
        options.baseUrl = value;
        break;
      case '--retries':
        options.retries = Number(value);
        break;
      case '--retry-delay':
        options.retryDelay = Number(value);
        break;
      case '--timeout':
        options.timeout = Number(value);
        break;
      case '--headless':
        options.headless = value !== 'false';
        break;
      case '--owner-map':
        options.ownerMapPath = value;
        break;
      case '--template-map':
        options.templateMapPath = value;
        break;
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  options.baseUrl = normaliseBaseUrl(options.baseUrl);
  options.templates = options.templates.length ? options.templates : DEFAULT_OPTIONS.templates;

  return options;
}

function normaliseBaseUrl(baseUrl) {
  if (!baseUrl) return DEFAULT_OPTIONS.baseUrl;
  if (/^https?:\/\//i.test(baseUrl)) return baseUrl;
  return `https://${baseUrl}`;
}

async function loadJsonFile(filePath) {
  if (!filePath) return null;
  try {
    const raw = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to read JSON file at ${filePath}: ${error.message}`);
  }
}

function buildTemplateUrl(template, baseUrl, templateMap = {}) {
  const map = { ...DEFAULT_TEMPLATE_PATHS, ...templateMap };
  const rawPath = map[template] || `/${template}`;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  const base = new URL(baseUrl);
  return new URL(rawPath, base).toString();
}

function formatTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function serializeError(error) {
  if (!error) return null;
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  };
}

async function collectTemplateMetrics(browser, template, url, options) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.addInitScript(`(() => {
    window.__perfMetrics = { lcp: null, cls: 0, fid: null };
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          window.__perfMetrics.lcp = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.warn('LCP observer unavailable', error);
    }

    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__perfMetrics.cls += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('CLS observer unavailable', error);
    }

    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length) {
          const entry = entries[0];
          window.__perfMetrics.fid = entry.processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.warn('FID observer unavailable', error);
    }
  })();`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: options.timeout });
  await page.waitForTimeout(3000);

  const ownerMap = options.ownerMap || {};

  const data = await page.evaluate(({ ownerMapEntries }) => {
    const metrics = window.__perfMetrics || {};
    const navEntry = performance.getEntriesByType('navigation')[0];

    const toSeconds = (value) => (typeof value === 'number' ? Number((value / 1000).toFixed(3)) : null);

    const resources = performance.getEntriesByType('resource') || [];
    const host = location.host;
    const ownerMap = Object.fromEntries(ownerMapEntries);

    const blockingAssets = resources
      .filter((entry) => ['link', 'script', 'css'].includes(entry.initiatorType))
      .map((entry) => {
        const entryUrl = new URL(entry.name, location.href);
        const type = entry.initiatorType === 'link' || entry.initiatorType === 'css' ? 'css' : 'script';
        const thirdParty = entryUrl.host !== host;
        const ownerInfo = ownerMap[entryUrl.host] || ownerMap[entryUrl.origin] || null;
        const impact = entry.duration > 800 ? 'high' : entry.duration > 250 ? 'medium' : 'low';
        return {
          path: entryUrl.href,
          type,
          duration: Number(entry.duration.toFixed(2)),
          transferSize: entry.transferSize || 0,
          thirdParty,
          impact,
          owner: ownerInfo ? ownerInfo.owner || null : null,
          mitigation: ownerInfo ? ownerInfo.mitigation || null : null
        };
      })
      .sort((a, b) => b.duration - a.duration);

    return {
      metrics: {
        LCP: toSeconds(metrics.lcp),
        CLS: typeof metrics.cls === 'number' ? Number(metrics.cls.toFixed(3)) : null,
        FID: toSeconds(metrics.fid),
        TTFB:
          navEntry && typeof navEntry.responseStart === 'number' && typeof navEntry.requestStart === 'number'
            ? toSeconds(navEntry.responseStart - navEntry.requestStart)
            : null
      },
      blockingAssets
    };
  }, { ownerMapEntries: Object.entries(ownerMap) });

  await context.close();

  return {
    template,
    url,
    metrics: data.metrics,
    blockingAssets: data.blockingAssets
  };
}

async function runTemplateWithRetries(taskFn, { retries, retryDelay, delayFn }) {
  let attempt = 0;
  let delay = retryDelay;
  let lastError = null;
  while (attempt < retries) {
    attempt += 1;
    try {
      const value = await taskFn(attempt);
      return { status: 'complete', attempts: attempt, value };
    } catch (error) {
      lastError = error;
      if (attempt >= retries) {
        break;
      }
      await delayFn(delay, attempt, error);
      delay *= 2;
    }
  }
  return { status: 'failed', attempts: retries, error: serializeError(lastError) };
}

async function defaultWriter(filePath, contents) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, contents, 'utf8');
}

async function runAudit(options, dependencies = {}) {
  const delayFn = dependencies.delayFn || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const now = dependencies.now || (() => new Date());
  const writer = dependencies.writer || defaultWriter;
  const collect = dependencies.collectMetrics || ((browser, template, url) => collectTemplateMetrics(browser, template, url, options));

  const ownerMap = options.ownerMap || {};
  const templateMap = options.templateMap || {};

  const browserFactory = dependencies.browserFactory || (() => getChromium().launch({ headless: options.headless }));
  const browser = await browserFactory();

  const startedAt = now();
  const results = [];

  try {
    for (const template of options.templates) {
      const url = buildTemplateUrl(template, options.baseUrl, templateMap);
      const attemptResult = await runTemplateWithRetries(
        () => collect(browser, template, url, { ...options, ownerMap }),
        { retries: options.retries, retryDelay: options.retryDelay, delayFn }
      );

      if (attemptResult.status === 'complete') {
        results.push({
          template,
          url,
          status: 'complete',
          attempts: attemptResult.attempts,
          recordedAt: now().toISOString(),
          metrics: attemptResult.value.metrics,
          blockingAssets: attemptResult.value.blockingAssets
        });
      } else {
        results.push({
          template,
          url,
          status: 'failed',
          attempts: attemptResult.attempts,
          error: attemptResult.error
        });
      }
    }
  } finally {
    if (browser && typeof browser.close === 'function') {
      await browser.close();
    }
  }

  const report = {
    baseUrl: options.baseUrl,
    generatedAt: startedAt.toISOString(),
    options: {
      retries: options.retries,
      retryDelay: options.retryDelay,
      timeout: options.timeout
    },
    results
  };

  const outputDir = options.outputDir;
  const outputPath = path.join(outputDir, `${formatTimestamp(startedAt)}.json`);
  await writer(outputPath, `${JSON.stringify(report, null, 2)}\n`);

  return { outputPath, report };
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const [ownerMap, templateMap] = await Promise.all([
      loadJsonFile(options.ownerMapPath),
      loadJsonFile(options.templateMapPath)
    ]);

    options.ownerMap = ownerMap || {};
    options.templateMap = templateMap || {};

    const { outputPath } = await runAudit(options);
    console.log(`Performance report written to ${outputPath}`);
  } catch (error) {
    console.error('Performance audit failed:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArguments,
  runAudit,
  collectTemplateMetrics,
  buildTemplateUrl,
  formatTimestamp,
  runTemplateWithRetries,
  normaliseBaseUrl
};
