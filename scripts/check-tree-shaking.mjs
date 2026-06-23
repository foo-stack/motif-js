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
    // Box dispatches through wrappers for `drag` / `layout` / `stagger`
    // props (added in the motion-roadmap), so an `import { Box }`
    // statically pulls `useDrag`, `useLayoutAnimation`, and the stagger
    // context — even when consumers don't use those props. Tree-shaking
    // can't eliminate them because the conditional dispatch creates a
    // runtime reference at Box's entry point. Rebaselined in v1.1.0;
    // nudged in v1.1.5 by the reduced-motion enter-gating + SSR-safety
    // changes the web Box now carries.
    code: `import { Box } from '@usemotif/react';\nconsole.log(Box);\n`,
    budget: 10762, // gzip bytes
  },
  {
    name: '@usemotif/react — Button only',
    code: `import { Button } from '@usemotif/react';\nconsole.log(Button);\n`,
    // Tracks the web Box growth above (Button composes Box).
    budget: 11602,
  },
  {
    name: '@usemotif/react-native — Box only',
    // Same dispatch pattern as the web Box, plus the native motion-
    // driver registry pulls in via the drag / layout wrappers.
    // Rebaselined in v1.1.0; bumped again in v1.1.4 when Box gained the
    // native style translator (shadow/transform/web-only-key sanitisation),
    // which it imports unconditionally so shadows render on RN. Bumped
    // again in v1.1.5 when the exit path gained the presence-`active`
    // driver plumbing + expanded web→native style translation.
    code: `import { Box } from '@usemotif/react-native';\nconsole.log(Box);\n`,
    budget: 13332,
  },
  {
    name: '@usemotif/headless — Dialog only',
    code: `import { Dialog } from '@usemotif/headless';\nconsole.log(Dialog);\n`,
    // Dialog brings Portal + Overlay + FocusScope + Box. The
    // architectural floor for any modal-style headless component.
    // Grew in v1.1.0 because Box itself grew (motion-roadmap dispatch);
    // rebaselined to match. Nudged in v1.1.4 alongside the web Box's
    // SSR-safe enter-overlay gating, and again in v1.1.5 with the
    // overlay/menu focus + a11y wiring fixes.
    budget: 16237,
  },
  {
    name: '@usemotif/headless — Tooltip only',
    code: `import { Tooltip } from '@usemotif/headless';\nconsole.log(Tooltip);\n`,
    // Tooltip pulls Portal + Box via @usemotif/react — the exact same
    // module set as Dialog (verified via esbuild metafile: no
    // Tooltip-only package is dragged in). It is simply a larger
    // component than Dialog. Grew in v1.1.0 alongside Box's growth, and
    // again in v1.1.3 by the core CSS-value escaping (#150 security fix)
    // that the shared `stringifyDeclarations` path now carries, and in
    // v1.1.5 tracking the shared Box + overlay growth.
    budget: 16797,
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
    // Bumped in v1.1.4 by the literal-extraction mutation guard, which walks a
    // const binding's reference paths to refuse extracting mutated objects, and
    // in v1.1.5 by the extraction precedence + bail-out correctness fixes.
    budget: 5967,
  },
  {
    name: '@usemotif/ui — Card only',
    code: `import { Card } from '@usemotif/ui';\nconsole.log(Card);\n`,
    // The kit is code-split per component, so a display component pulls only
    // its primitives (Box + styled + its recipe) — NOT Modal's
    // `@usemotif/headless` dependency. A regression that re-couples them (e.g.
    // losing the per-component split) jumps this ~5 KB to Modal's footprint.
    budget: 11800,
  },
  {
    name: '@usemotif/ui — Modal only',
    code: `import { Modal } from '@usemotif/ui';\nconsole.log(Modal);\n`,
    // Modal legitimately pulls the headless Dialog + Adapt on top of the
    // primitives — the ~5 KB over Card-only is exactly that headless surface.
    budget: 17100,
  },
  {
    name: '@usemotif/ui — Tooltip only',
    code: `import { Tooltip } from '@usemotif/ui';\nconsole.log(Tooltip);\n`,
    // Pulls the headless Tooltip behaviour + Box, NOT Modal's Dialog/Adapt or
    // Toast's toaster — proof the per-component split holds.
    budget: 17300,
  },
  {
    name: '@usemotif/ui — Toast only',
    code: `import { Toaster } from '@usemotif/ui';\nconsole.log(Toaster);\n`,
    // Pulls the headless Toast system + Box/Text, NOT Modal's or Tooltip's
    // behaviours.
    budget: 17600,
  },
  {
    name: '@usemotif/ui — Switch only',
    code: `import { Switch } from '@usemotif/ui';\nconsole.log(Switch);\n`,
    // Switch is a themed <Box as="input">, pure primitives — it must NOT pull
    // any `@usemotif/headless` behaviour, so it stays near the Card-only floor.
    budget: 11800,
  },
  {
    name: '@usemotif/ui — Tabs only',
    code: `import { Tabs } from '@usemotif/ui';\nconsole.log(Tabs);\n`,
    // Pulls the headless Tabs (disclosure) behaviour + Box, NOT Modal's or the
    // other components'.
    budget: 17600,
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

// Default the width when there are no targets: Math.max() with no args is
// -Infinity, which would turn every pad() width into NaN.
const W_NAME = targets.length > 0 ? Math.max(...targets.map((t) => t.name.length)) + 2 : 0;

let overruns = 0;
let errors = 0;
const rows = [];
for (const t of targets) {
  try {
    const { raw, gzipped } = await bundleAndMeasure(t.code);
    const status = gzipped <= t.budget ? 'OK' : 'OVER';
    if (status === 'OVER') overruns += 1;
    rows.push({ name: t.name, status, raw, gzipped, budget: t.budget });
  } catch (err) {
    // A target that fails to bundle (a renamed/removed export, an esbuild
    // resolve failure) is a hard failure, not a pass — track it so the exit
    // code below reflects it. A silently-skipped ERR would let the release
    // workflow treat a fully-broken tree-shaking check as green.
    errors += 1;
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

if (errors > 0) {
  console.error(`\n${errors} target(s) failed to bundle (see ERR above).`);
}
if (overruns > 0) {
  console.error(`\n${overruns} target(s) over budget.`);
  console.error('Tree-shaking might be broken — likely culprits:');
  console.error('  - `sideEffects: true` (or absent) in a package.json that should be `false`');
  console.error('  - top-level work in a barrel-export module');
  console.error('  - a re-export that pulls in the whole package transitively');
}
if (overruns > 0 || errors > 0) {
  process.exit(1);
}
