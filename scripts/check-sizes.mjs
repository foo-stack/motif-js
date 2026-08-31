#!/usr/bin/env node
/**
 * Bundle-size budget check.
 *
 *   node scripts/check-sizes.mjs              # exits non-zero on overrun
 *   node scripts/check-sizes.mjs --update     # rewrites .size-limits.json
 *                                             # to current sizes (use after a
 *                                             # legitimate growth event)
 *
 * Reads each `@usemotif/*` package's `dist/index.js`, gzip-compresses it,
 * and compares the resulting size against the budget in `.size-limits.json`.
 * Output mirrors the size-limit CLI format for readability.
 *
 * Phase G batch 1: this is the per-package size guardrail. The CI
 * release workflow runs it after `yarn build` so the auto-version PR
 * surfaces any package that's outgrown its budget before it ships to
 * npm. Bump a budget intentionally when a real feature lands; don't
 * let drift accumulate silently.
 */

import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const BUDGETS_PATH = `${ROOT}/.size-limits.json`;
const UPDATE_MODE = process.argv.includes('--update');

const budgets = JSON.parse(readFileSync(BUDGETS_PATH, 'utf8'));
const targets = Object.entries(budgets.packages);

function localPackagePath(pkgName) {
  // @usemotif/core → packages/core
  return `${ROOT}/packages/${pkgName.replace('@usemotif/', '')}/dist/index.js`;
}

function fmt(n) {
  if (n < 1000) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function pad(s, n) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

const results = [];
let overruns = 0;
let missing = 0;

for (const [pkg, budget] of targets) {
  const path = localPackagePath(pkg);
  if (!existsSync(path)) {
    results.push({ pkg, status: 'missing', budget });
    missing += 1;
    continue;
  }
  const raw = readFileSync(path);
  const gzipped = gzipSync(raw, { level: 9 }).length;
  const status = gzipped <= budget ? 'ok' : 'over';
  if (status === 'over') overruns += 1;
  results.push({ pkg, status, gzipped, budget, raw: raw.length });
}

if (results.length === 0) {
  console.log('No size budgets configured (.size-limits.json has no packages). Nothing to check.');
  process.exit(0);
}

// Guard the spread: Math.max() with no args is -Infinity, which would make
// every pad() width NaN and garble the table.
const W_PKG = Math.max(...results.map((r) => r.pkg.length)) + 2;

console.log(pad('package', W_PKG) + 'status   raw      gzip     budget');
console.log('-'.repeat(W_PKG + 38));
for (const r of results) {
  if (r.status === 'missing') {
    console.log(
      `${pad(r.pkg, W_PKG)}MISSING                         ${fmt(r.budget)} (no dist - run yarn build first)`,
    );
    continue;
  }
  const tag = r.status === 'ok' ? 'OK   ' : 'OVER ';
  console.log(
    `${pad(r.pkg, W_PKG)}${tag}    ${pad(fmt(r.raw), 9)}${pad(fmt(r.gzipped), 9)}${fmt(r.budget)}`,
  );
}

if (UPDATE_MODE) {
  // Write back the current gzipped sizes (rounded up by 5%) as the new
  // budgets. Use after a legitimate growth event; never run blindly to
  // silence overruns.
  for (const r of results) {
    if (r.status === 'ok' || r.status === 'over') {
      budgets.packages[r.pkg] = Math.ceil(r.gzipped * 1.05);
    }
  }
  writeFileSync(BUDGETS_PATH, JSON.stringify(budgets, null, 2) + '\n');
  console.log('\nUpdated .size-limits.json to current sizes (+5% headroom).');
}

if (missing > 0) {
  console.error(`\n${missing} package(s) missing dist/. Run \`yarn build\` first.`);
  process.exit(1);
}
if (overruns > 0 && !UPDATE_MODE) {
  console.error(`\n${overruns} package(s) over budget.`);
  console.error('Either:');
  console.error('  - explain the growth in the diff and run');
  console.error('    `node scripts/check-sizes.mjs --update` to rebaseline, OR');
  console.error('  - identify the culprit and shrink the bundle.');
  process.exit(1);
}
