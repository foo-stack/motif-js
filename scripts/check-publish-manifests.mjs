#!/usr/bin/env node
/**
 * Publish smoke gate: pack every publishable package exactly as a release
 * would, then read the manifest back *out of the tarball* and assert no
 * `workspace:` range survived.
 *
 *   node scripts/check-publish-manifests.mjs
 *   node scripts/check-publish-manifests.mjs --no-pack   # manifest-only, no tarballs
 *
 * Why inspect the tarball rather than the tree: the tree is always correct —
 * `workspace:*` is the right thing to commit. The bug that shipped 1.2.2 and
 * 1.2.3 lived entirely in the gap between the tree and what npm packed from it,
 * so only the packed artifact can prove the conversion happened. Asserting on
 * the committed manifests under `packages/` would have passed while the
 * registry was broken.
 *
 * Runs the same convert → restore cycle as `scripts/release.mjs`, so drift
 * between the gate and the real publish path is not possible.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  assertNoWorkspaceRanges,
  buildVersionMap,
  convertManifestsInPlace,
  findPublishablePackages,
  findWorkspaceRanges,
  restoreManifests,
} from './workspace-protocol.mjs';

const NO_PACK = process.argv.includes('--no-pack');

const COLORS = { green: '\x1b[32m', red: '\x1b[31m', dim: '\x1b[2m', reset: '\x1b[0m' };

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

/**
 * Read one member out of a packed tarball. `tar -xzO` streams a single member
 * to stdout without unpacking the rest, which matters — some of these tarballs
 * carry a whole dist tree. Returns `null` when the member is absent so callers
 * can tell "not built" apart from "read failed".
 */
function readFromTarball(destDir, tarball, member) {
  const extracted = spawnSync('tar', ['-xzOf', join(destDir, tarball), member], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (extracted.status !== 0) return null;
  return extracted.stdout;
}

/**
 * Pack one package and return its tarball name plus the manifest as npm
 * actually wrote it into that tarball. Packing is the slow part, so it happens
 * once and every later read reuses the same artifact.
 */
function packPackage(pkg, destDir) {
  const packed = spawnSync('npm', ['pack', '--silent', '--pack-destination', destDir], {
    cwd: pkg.dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (packed.status !== 0) {
    throw new Error(
      `npm pack failed for ${pkg.name}:\n${(packed.stderr || packed.stdout || '').trim()}`,
    );
  }
  // `npm pack` prints the tarball name last; anything before it is notice
  // output that `--silent` did not suppress.
  const lines = packed.stdout.trim().split('\n');
  const tarball = lines[lines.length - 1]?.trim();
  if (!tarball) throw new Error(`npm pack produced no tarball name for ${pkg.name}`);

  const raw = readFromTarball(destDir, tarball, 'package/package.json');
  if (raw === null) throw new Error(`could not read package.json from ${tarball}`);
  return { tarball, manifest: JSON.parse(raw) };
}

const DIRECTIVE = "'use client'";

/**
 * Which published entries must carry `'use client'`, and which must not.
 *
 * Declared rather than derived, because source is not a reliable signal in
 * either direction: `usemotif` has no `'use client'` in its own source but
 * re-exports a client package and needs the directive, while
 * `@usemotif/react-native` has one and must never carry it (Metro has no
 * server components to protect).
 *
 * `must` entries are client references; a Server Component importing one has
 * to hit a boundary or the build fails. `mustNot` entries run on the server or
 * on native, where the directive would be wrong rather than merely redundant.
 *
 * A package listed here has to classify every JS target in its exports map.
 * An unclassified entry is a hard failure, so adding a subpath export forces a
 * deliberate decision instead of silently shipping an unmarked one.
 */
const CLIENT_ENTRY_POLICY = {
  usemotif: { must: ['.'], mustNot: [] },
  '@usemotif/react': { must: ['.', './svg', './tanstack-virtual'], mustNot: ['./server'] },
  '@usemotif/headless': { must: ['.'], mustNot: [] },
  '@usemotif/ui': { must: ['.'], mustNot: [] },
  '@usemotif/react-native': { must: [], mustNot: ['.', './flash-list', './reanimated'] },
};

/**
 * Walk an exports map and yield every JS file it can resolve to, tagged with
 * the entry key that owns it. Targets reached through a `react-native`
 * condition are flagged: they are consumed by Metro, never by an RSC bundler,
 * so the directive does not apply to them even under a `must` entry.
 */
function collectJsTargets(node, key, underReactNative, out) {
  if (typeof node === 'string') {
    if (/\.(js|cjs|mjs)$/.test(node)) out.push({ key, path: node, underReactNative });
    return;
  }
  if (node === null || typeof node !== 'object') return;
  for (const [condition, child] of Object.entries(node)) {
    // `types` points at a .d.ts and never carries runtime semantics.
    if (condition === 'types') continue;
    collectJsTargets(child, key, underReactNative || condition === 'react-native', out);
  }
}

/**
 * Assert the packed artifact carries `'use client'` exactly where the policy
 * says it should. Inspecting the tarball rather than the tree is the same
 * reasoning the workspace-range check uses: the tree is not what ships.
 */
function checkUseClientEntries(pkg, manifest, destDir, tarball, offenders) {
  const policy = CLIENT_ENTRY_POLICY[pkg.name];
  if (!policy) return;

  const must = new Set(policy.must);
  const mustNot = new Set(policy.mustNot);

  for (const [key, node] of Object.entries(manifest.exports ?? {})) {
    const targets = [];
    collectJsTargets(node, key, false, targets);
    if (targets.length === 0) continue;

    if (!must.has(key) && !mustNot.has(key)) {
      offenders.push(
        `${pkg.name} → exports "${key}" is not classified in CLIENT_ENTRY_POLICY. ` +
          `Decide whether it is a client reference and list it under must or mustNot.`,
      );
      continue;
    }

    for (const target of targets) {
      const member = `package/${target.path.replace(/^\.\//, '')}`;
      const content = readFromTarball(destDir, tarball, member);
      if (content === null) {
        offenders.push(
          `${pkg.name} → exports "${key}" points at ${target.path}, which is missing from the ` +
            `tarball. Run \`yarn build\` before this check.`,
        );
        continue;
      }
      const has = content.trimStart().startsWith(DIRECTIVE);
      // Native targets ship to Metro, which has no server components, so the
      // directive is neither required nor meaningful there.
      const wanted = must.has(key) && !target.underReactNative;
      if (wanted && !has) {
        offenders.push(
          `${pkg.name} → ${target.path} is missing the ${DIRECTIVE} directive. ` +
            `Importing "${key}" from a Server Component would fail.`,
        );
      } else if (!wanted && has) {
        offenders.push(
          `${pkg.name} → ${target.path} carries ${DIRECTIVE} but must not. ` +
            `Marking a server or native entry as a client reference breaks it.`,
        );
      }
    }
  }
}

/**
 * Catch the symmetric hole: a package that ships client components but was
 * never given a policy entry would otherwise be skipped entirely, which is the
 * same class of bug one level up.
 */
function assertClientPackageIsClassified(pkg, offenders) {
  if (CLIENT_ENTRY_POLICY[pkg.name]) return;
  const found = spawnSync('grep', ['-rl', 'use client', join(pkg.dir, 'src')], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  if (found.status !== 0 || found.stdout.trim() === '') return;
  offenders.push(
    `${pkg.name} → source contains ${DIRECTIVE} but the package has no CLIENT_ENTRY_POLICY ` +
      `entry, so its published entries are unchecked. Classify it.`,
  );
}

function main() {
  const packages = findPublishablePackages();
  if (packages.length === 0) {
    throw new Error('No publishable usemotif / @usemotif/* packages found under packages/');
  }

  const versionMap = buildVersionMap();
  const undo = convertManifestsInPlace(packages, versionMap);
  const destDir = NO_PACK ? null : mkdtempSync(join(tmpdir(), 'usemotif-pack-'));
  const offenders = [];

  try {
    // Cheap check first: if conversion itself left something behind, every
    // tarball is broken and packing 17 packages to prove it is wasted work.
    assertNoWorkspaceRanges(packages);

    if (NO_PACK) {
      log(`${COLORS.dim}--no-pack: verified converted manifests only.${COLORS.reset}`);
    } else {
      for (const pkg of packages) {
        const before = offenders.length;
        const { tarball, manifest } = packPackage(pkg, destDir);
        const hits = findWorkspaceRanges(manifest);
        for (const hit of hits) {
          offenders.push(`${pkg.name} → ${hit.block}.${hit.name} = "${hit.range}"`);
        }
        assertClientPackageIsClassified(pkg, offenders);
        checkUseClientEntries(pkg, manifest, destDir, tarball, offenders);
        const clean = offenders.length === before;
        const mark = clean ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
        log(`  ${mark} ${pkg.name}@${manifest.version}`);
      }
    }
  } finally {
    restoreManifests(undo);
    if (destDir) rmSync(destDir, { recursive: true, force: true });
  }

  if (offenders.length > 0) {
    log('');
    log(`${COLORS.red}✗ ${offenders.length} problem(s) would reach the registry:${COLORS.reset}`);
    for (const o of offenders) log(`    ${o}`);
    log('');
    log('A surviving workspace range bricks every install; publish must go through');
    log("scripts/release.mjs. A missing 'use client' crashes every Server Component import.");
    process.exit(1);
  }

  log('');
  log(
    `${COLORS.green}✓${COLORS.reset} ${packages.length} package(s) pack clean — no workspace protocol reaches npm, client entries are marked.`,
  );
}

try {
  main();
} catch (err) {
  log(`${COLORS.red}✗ ${err.message ?? String(err)}${COLORS.reset}`);
  process.exit(1);
}
