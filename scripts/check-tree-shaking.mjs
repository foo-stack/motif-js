#!/usr/bin/env node
/**
 * Import-cost guardrail.
 *
 *   node scripts/check-tree-shaking.mjs
 *
 * For each target, bundles a synthetic entrypoint that imports a
 * single named export from a motif package, measures the bundled
 * output (esbuild + minify + gzip), and compares against a budget.
 *
 * The "real" tree-shaking question is: when I import `Plus`, do I
 * pay for the rest of `@usemotif/icons`? The answer in motif's
 * architecture is "no, but you do pay for the transitive
 * dependency chain to `<Icon>` → `<Svg>` → `@usemotif/react` →
 * `@usemotif/react`'s `Box`." That's the architectural cost,
 * and the budgets reflect it.
 *
 * If a target balloons past its budget, two things might be true:
 *  1. A genuinely-tree-shake-breaking change landed (a barrel
 *     module gained side effects, a re-export bridged unrelated
 *     code, etc.).
 *  2. A dependency added real new functionality and the budget
 *     should rebaseline.
 *
 * Phase G batch 2: this is the runtime-side complement to
 * `scripts/check-sizes.mjs` (which budgets the full package).
 * Together they catch both "bundle grew" (size budget) and "this
 * single import pulls in the whole bundle anyway" (tree-shaking).
 */

import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');

const targets = [
  {
    name: '@usemotif/react — Box only',
    code: `import { Box } from '@usemotif/react';\nconsole.log(Box);\n`,
    budget: 9000, // gzip bytes
  },
  {
    name: '@usemotif/react — Button only',
    code: `import { Button } from '@usemotif/react';\nconsole.log(Button);\n`,
    budget: 11000,
  },
  {
    name: '@usemotif/react-native — Box only',
    code: `import { Box } from '@usemotif/react-native';\nconsole.log(Box);\n`,
    budget: 9000,
  },
  {
    name: '@usemotif/headless — Dialog only',
    code: `import { Dialog } from '@usemotif/headless';\nconsole.log(Dialog);\n`,
    // Dialog brings Portal + Overlay + FocusScope + Box. The
    // architectural floor for any modal-style headless component.
    budget: 11000,
  },
  {
    name: '@usemotif/headless — Tooltip only',
    code: `import { Tooltip } from '@usemotif/headless';\nconsole.log(Tooltip);\n`,
    // Tooltip pulls Portal + Box via @usemotif/react — the exact same
    // module set as Dialog (verified via esbuild metafile: no
    // Tooltip-only package is dragged in). It is simply a larger
    // component than Dialog — ~11.2 KB gzip vs Dialog's ~10.6 KB, its
    // own delay/hover/focus wiring. The old 11000 budget assumed
    // Tooltip ≈ Dialog, which was never true; rebaselined with ~850 B
    // headroom (#18). A regression past this signals real growth.
    budget: 12000,
  },
  {
    name: '@usemotif/icons — Plus only',
    code: `import { Plus } from '@usemotif/icons';\nconsole.log(Plus);\n`,
    // Plus → Icon → Svg via the dedicated `@usemotif/react/svg` entry,
    // which carries zero engine code. A single glyph now costs only the
    // glyph data + Icon/Svg (~550 B gzip) — it no longer drags in
    // `@usemotif/core` or the styled primitives. A regression back to
    // the barrel would jump this past ~6 KB and blow the budget (#10).
    budget: 1500,
  },
  {
    name: '@usemotif/compiler-core — extractWeb only',
    code: `import { extractWeb } from '@usemotif/compiler-core';\nconsole.log(extractWeb);\n`,
    budget: 5000,
  },
];

const dir = mkdtempSync(join(tmpdir(), 'motif-treeshake-'));

async function bundleAndMeasure(code) {
  const entry = join(dir, 'entry.js');
  writeFileSync(entry, code);
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: 'esm',
    platform: 'browser',
    treeShaking: true,
    write: false,
    target: 'es2022',
    external: [
      'react',
      'react-dom',
      'react-native',
      '@babel/core',
      '@babel/types',
      '@babel/parser',
      '@babel/traverse',
      'unplugin',
    ],
    absWorkingDir: ROOT,
    nodePaths: [`${ROOT}/node_modules`],
    logLevel: 'silent',
  });
  const out = result.outputFiles[0].contents;
  return { raw: out.length, gzipped: gzipSync(out, { level: 9 }).length };
}

function fmt(n) {
  if (n < 1000) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
function pad(s, n) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

const W_NAME = Math.max(...targets.map((t) => t.name.length)) + 2;

let overruns = 0;
const rows = [];
for (const t of targets) {
  try {
    const { raw, gzipped } = await bundleAndMeasure(t.code);
    const status = gzipped <= t.budget ? 'OK' : 'OVER';
    if (status === 'OVER') overruns += 1;
    rows.push({ name: t.name, status, raw, gzipped, budget: t.budget });
  } catch (err) {
    rows.push({ name: t.name, status: 'ERR', error: err.message ?? String(err) });
  }
}

console.log(pad('target', W_NAME) + 'status   raw       gzip      budget');
console.log('-'.repeat(W_NAME + 40));
for (const r of rows) {
  if (r.status === 'ERR') {
    console.log(`${pad(r.name, W_NAME)}ERR     ${r.error?.slice(0, 80) ?? ''}`);
    continue;
  }
  console.log(
    `${pad(r.name, W_NAME)}${pad(r.status, 8)}${pad(fmt(r.raw), 10)}${pad(fmt(r.gzipped), 10)}${fmt(r.budget)}`,
  );
}

rmSync(dir, { recursive: true, force: true });

if (overruns > 0) {
  console.error(`\n${overruns} target(s) over budget.`);
  console.error('Tree-shaking might be broken — likely culprits:');
  console.error('  - `sideEffects: true` (or absent) in a package.json that should be `false`');
  console.error('  - top-level work in a barrel-export module');
  console.error('  - a re-export that pulls in the whole package transitively');
  process.exit(1);
}
