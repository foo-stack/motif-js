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
 * Pack one package and return its manifest as npm actually wrote it into the
 * tarball. `tar -xzO` streams the single member to stdout without unpacking
 * the rest, which matters — some of these tarballs carry a whole dist tree.
 */
function packedManifest(pkg, destDir) {
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

  const extracted = spawnSync('tar', ['-xzOf', join(destDir, tarball), 'package/package.json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (extracted.status !== 0) {
    throw new Error(
      `could not read package.json from ${tarball}:\n${(extracted.stderr || '').trim()}`,
    );
  }
  return JSON.parse(extracted.stdout);
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
        const manifest = packedManifest(pkg, destDir);
        const hits = findWorkspaceRanges(manifest);
        for (const hit of hits) {
          offenders.push(`${pkg.name} → ${hit.block}.${hit.name} = "${hit.range}"`);
        }
        const mark =
          hits.length === 0 ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
        log(`  ${mark} ${pkg.name}@${manifest.version}`);
      }
    }
  } finally {
    restoreManifests(undo);
    if (destDir) rmSync(destDir, { recursive: true, force: true });
  }

  if (offenders.length > 0) {
    log('');
    log(
      `${COLORS.red}✗ ${offenders.length} workspace-protocol range(s) would reach the registry:${COLORS.reset}`,
    );
    for (const o of offenders) log(`    ${o}`);
    log('');
    log('These strings brick every install. Publish must go through scripts/release.mjs.');
    process.exit(1);
  }

  log('');
  log(
    `${COLORS.green}✓${COLORS.reset} ${packages.length} package(s) pack clean — no workspace protocol reaches npm.`,
  );
}

try {
  main();
} catch (err) {
  log(`${COLORS.red}✗ ${err.message ?? String(err)}${COLORS.reset}`);
  process.exit(1);
}
