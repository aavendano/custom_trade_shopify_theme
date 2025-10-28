#!/usr/bin/env node
/**
 * Render-blocking asset analyzer.
 * Consumes performance audit JSON reports and produces Markdown/CSV summaries.
 */

const fsp = require('node:fs/promises');
const path = require('node:path');

const DEFAULT_OPTIONS = {
  input: ['storage/perf-reports'],
  outputDir: 'storage/perf-reports/summary',
  formats: ['markdown', 'csv'],
  assetRoot: process.cwd()
};

const IMPACT_ORDER = {
  high: 0,
  medium: 1,
  low: 2
};

function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function normaliseFormats(raw) {
  const formats = ensureArray(raw)
    .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : entry))
    .map((format) => format && format.trim().toLowerCase())
    .filter(Boolean);
  return formats.length ? Array.from(new Set(formats)) : DEFAULT_OPTIONS.formats;
}

function parseArguments(argv, env = process.env) {
  const options = {
    input: env.PERF_ANALYZE_INPUT ? env.PERF_ANALYZE_INPUT.split(',').map((p) => p.trim()).filter(Boolean) : DEFAULT_OPTIONS.input,
    outputDir: env.PERF_ANALYZE_OUTPUT || DEFAULT_OPTIONS.outputDir,
    formats: env.PERF_ANALYZE_FORMATS ? normaliseFormats(env.PERF_ANALYZE_FORMATS) : DEFAULT_OPTIONS.formats,
    assetRoot: env.PERF_ANALYZE_ASSET_ROOT || DEFAULT_OPTIONS.assetRoot
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue] = arg.includes('=') ? arg.split('=') : [arg, argv[i + 1]];
    const hasInlineValue = arg.includes('=');
    const isNextValue = argv[i + 1] && !argv[i + 1].startsWith('--');
    const value = hasInlineValue ? rawValue : isNextValue ? rawValue : undefined;
    if (!hasInlineValue && isNextValue) i += 1;

    switch (flag) {
      case '--input':
        if (!value) throw new Error('Missing value for --input');
        options.input = value.split(',').map((p) => p.trim()).filter(Boolean);
        break;
      case '--output':
        if (!value) throw new Error('Missing value for --output');
        options.outputDir = value;
        break;
      case '--formats':
        if (!value) throw new Error('Missing value for --formats');
        options.formats = normaliseFormats(value);
        break;
      case '--asset-root':
        if (!value) throw new Error('Missing value for --asset-root');
        options.assetRoot = value;
        break;
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  if (!options.input.length) {
    throw new Error('At least one input path must be provided.');
  }

  options.formats = options.formats.length ? options.formats : DEFAULT_OPTIONS.formats;

  return options;
}

function resolvePath(baseDir, targetPath) {
  if (!targetPath) return baseDir;
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(baseDir, targetPath);
}

async function discoverReportFiles(inputs, { readdir, stat }) {
  const files = [];
  for (const input of inputs) {
    const fileStat = await stat(input);
    if (fileStat.isDirectory()) {
      const entries = await readdir(input, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!entry.name.endsWith('.json')) continue;
        files.push(path.join(input, entry.name));
      }
    } else if (fileStat.isFile()) {
      files.push(input);
    }
  }
  return files;
}

function scoreRow(row) {
  const impactRank = row.impact in IMPACT_ORDER ? IMPACT_ORDER[row.impact] : 99;
  return { impactRank, duration: row.duration || 0 };
}

function compareRows(a, b) {
  const aScore = scoreRow(a);
  const bScore = scoreRow(b);
  if (aScore.impactRank !== bScore.impactRank) return aScore.impactRank - bScore.impactRank;
  return (bScore.duration || 0) - (aScore.duration || 0);
}

function sanitiseNumber(value, decimals = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return Number(value.toFixed(decimals));
}

function thirdPartyLabel(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'Unknown';
}

function localStatusLabel(status) {
  switch (status) {
    case 'present':
      return 'Present';
    case 'missing':
      return 'Missing';
    case 'skipped':
      return 'N/A';
    default:
      return status || 'N/A';
  }
}

function generateMarkdown(rows) {
  const header = '# Render Blocking Assets Summary\n\n';
  if (!rows.length) {
    return `${header}_No render blocking assets were detected._\n`;
  }

  const tableHeader = '| Template | Impact | Type | Third Party | Duration (ms) | Transfer (bytes) | Asset | Owner | Mitigation | Local |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';

  const lines = rows.map((row) => {
    const assetCell = row.asset ? `\`${row.asset}\`` : '';
    const ownerCell = row.owner ? row.owner : '';
    const mitigationCell = row.mitigation ? row.mitigation : '';
    return `| ${row.template || ''} | ${row.impact || ''} | ${row.type || ''} | ${thirdPartyLabel(row.thirdParty)} | ${row.duration != null ? row.duration : ''} | ${row.transfer != null ? row.transfer : ''} | ${assetCell} | ${ownerCell} | ${mitigationCell} | ${localStatusLabel(row.localStatus)} |`;
  });

  return `${header}${tableHeader}${lines.join('\n')}\n`;
}

function csvEscape(value) {
  if (value == null) return '';
  const text = String(value);
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function generateCsv(rows) {
  const header = [
    'template',
    'impact',
    'type',
    'third_party',
    'duration_ms',
    'transfer_bytes',
    'asset',
    'owner',
    'mitigation',
    'local_status',
    'local_path'
  ];
  const lines = rows.map((row) => {
    const fields = [
      row.template || '',
      row.impact || '',
      row.type || '',
      thirdPartyLabel(row.thirdParty),
      row.duration != null ? row.duration : '',
      row.transfer != null ? row.transfer : '',
      row.asset || '',
      row.owner || '',
      row.mitigation || '',
      localStatusLabel(row.localStatus),
      row.localPath || ''
    ];
    return fields.map(csvEscape).join(',');
  });
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

async function analyzeAssets(options, dependencies = {}) {
  const cwd = dependencies.cwd || process.cwd();
  const resolvedInputs = ensureArray(options.input).map((inputPath) => resolvePath(cwd, inputPath));
  const outputDir = resolvePath(cwd, options.outputDir);
  const assetRoot = resolvePath(cwd, options.assetRoot || cwd);
  const formats = normaliseFormats(options.formats);

  const readdir = dependencies.readdir || ((dir, opts) => fsp.readdir(dir, opts));
  const stat = dependencies.stat || ((target) => fsp.stat(target));
  const readFile = dependencies.readFile || ((filePath) => fsp.readFile(filePath, 'utf8'));
  const writer = dependencies.writer || (async (filePath, contents) => {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.writeFile(filePath, contents, 'utf8');
  });
  const fileExists = dependencies.fileExists || (async (filePath) => {
    try {
      await fsp.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  });

  const warnings = [];
  const rows = [];
  const missingCache = new Map();

  const reportFiles = await discoverReportFiles(resolvedInputs, { readdir, stat });
  if (!reportFiles.length) {
    throw new Error('No performance report JSON files found for the provided input paths.');
  }

  for (const reportPath of reportFiles) {
    let parsed;
    try {
      const raw = await readFile(reportPath);
      parsed = JSON.parse(raw);
    } catch (error) {
      warnings.push(`Unable to parse report ${reportPath}: ${error.message}`);
      continue;
    }

    const results = ensureArray(parsed && parsed.results);
    if (!results.length) {
      warnings.push(`Report ${reportPath} does not contain any results.`);
      continue;
    }

    for (const result of results) {
      if (!result || result.status !== 'complete') {
        warnings.push(`Template ${result && result.template ? result.template : 'unknown'} in ${reportPath} did not complete successfully.`);
        continue;
      }

      const assets = ensureArray(result.blockingAssets);
      for (const asset of assets) {
        if (!asset || !asset.path) continue;
        const duration = sanitiseNumber(asset.duration, 2);
        const transfer = sanitiseNumber(asset.transferSize, 0);
        let localStatus = 'skipped';
        let localPath = '';

        if (asset.thirdParty === false) {
          try {
            const assetUrl = new URL(asset.path);
            const candidatePath = decodeURIComponent(assetUrl.pathname.replace(/^\/+/, ''));
            if (candidatePath) {
              localPath = candidatePath;
              if (!missingCache.has(candidatePath)) {
                const exists = await fileExists(path.join(assetRoot, candidatePath));
                missingCache.set(candidatePath, exists ? 'present' : 'missing');
              }
              localStatus = missingCache.get(candidatePath);
              if (localStatus === 'missing') {
                warnings.push(`Missing local file for asset ${asset.path} (expected at ${path.join(assetRoot, candidatePath)})`);
              }
            }
          } catch (error) {
            localStatus = 'skipped';
          }
        }

        rows.push({
          template: result.template || 'unknown',
          url: result.url || '',
          impact: asset.impact || 'unknown',
          type: asset.type || 'unknown',
          thirdParty: asset.thirdParty,
          duration,
          transfer,
          asset: asset.path,
          owner: asset.owner || '',
          mitigation: asset.mitigation || '',
          localStatus,
          localPath
        });
      }
    }
  }

  rows.sort(compareRows);

  const outputs = {};

  for (const format of formats) {
    if (format === 'markdown') {
      const filePath = path.join(outputDir, 'render-blockers.md');
      const contents = generateMarkdown(rows);
      await writer(filePath, contents);
      outputs.markdownPath = filePath;
    } else if (format === 'csv') {
      const filePath = path.join(outputDir, 'render-blockers.csv');
      const contents = generateCsv(rows);
      await writer(filePath, contents);
      outputs.csvPath = filePath;
    }
  }

  return { ...outputs, warnings, rows };
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = await analyzeAssets(options);
    if (result.markdownPath) {
      console.log(`Markdown summary written to ${result.markdownPath}`);
    }
    if (result.csvPath) {
      console.log(`CSV summary written to ${result.csvPath}`);
    }
    if (result.warnings.length) {
      result.warnings.forEach((message) => console.warn(`Warning: ${message}`));
    }
  } catch (error) {
    console.error('Asset analysis failed:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArguments,
  analyzeAssets,
  generateMarkdown,
  generateCsv,
  normaliseFormats
};
