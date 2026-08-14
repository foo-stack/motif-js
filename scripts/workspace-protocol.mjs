/**
 * Yarn workspace-protocol → concrete-semver conversion, shared by every
 * publish path.
 *
 * Yarn 4 stores cross-package deps as `workspace:*` / `workspace:^`. Yarn
 * rewrites those to concrete ranges when *it* publishes (`yarn npm publish`),
 * but `npm publish` ships the strings verbatim and bricks every install:
 *
 *     Error: @usemotif/core@workspace:*: Workspace not found
 *
 * This module exists because the conversion used to live inside
 * `scripts/publish.mjs` only. The CI lane publishes through
 * `changeset publish`, which shells out to `npm publish` and never saw it —
 * so the hand lane produced correct manifests and CI produced broken ones.
 * Both lanes now import from here, so they cannot disagree again.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
export const PACKAGES_DIR = join(ROOT, 'packages');

/** Dependency blocks whose ranges are published and therefore must be converted. */
const DEP_BLOCKS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

/**
 * Every workspace package name → its current local version.
 *
 * Includes private packages, not just publishable ones, so a published
 * package depending on a private workspace sibling (rare, but legal) still
 * resolves.
 */
export function buildVersionMap() {
  const map = new Map();
  for (const name of readdirSync(PACKAGES_DIR)) {
    const dir = join(PACKAGES_DIR, name);
    if (!statSync(dir).isDirectory()) continue;
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    } catch {
      continue;
    }
    if (pkg.name && pkg.version) map.set(pkg.name, pkg.version);
  }
  return map;
}

/**
 * The packages this repo publishes: every `@usemotif/*` workspace plus the
 * unscoped `usemotif` meta package, minus anything marked private.
 *
 * (Brand history: the meta package was `@motif-js/react` in v1; renamed to
 * `usemotif` in v2 after npm blocked the originally-planned `motif-js` name as
 * too similar to an existing `motif.js`. The sibling packages moved from
 * `@motif-js/*` to `@usemotif/*` in v3.)
 */
export function findPublishablePackages() {
  const out = [];
  for (const name of readdirSync(PACKAGES_DIR)) {
    const dir = join(PACKAGES_DIR, name);
    if (!statSync(dir).isDirectory()) continue;
    const pkgPath = join(dir, 'package.json');
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    } catch {
      continue;
    }
    if (pkg.private) continue;
    if (pkg.name !== 'usemotif' && !pkg.name?.startsWith('@usemotif/')) continue;
    out.push({ name: pkg.name, version: pkg.version, dir, pkgPath });
  }
  return out.toSorted((a, b) => a.name.localeCompare(b.name));
}

/**
 * Resolve a single workspace-protocol range to a concrete semver range that
 * npm understands. Mirrors Yarn 4's published-manifest rewrite:
 *
 *   workspace:*           → "1.2.3"
 *   workspace:^           → "^1.2.3"
 *   workspace:~           → "~1.2.3"
 *   workspace:^1.0.0      → "^1.0.0"  (already explicit, just strip)
 */
export function resolveWorkspaceProtocol(range, depName, versionMap) {
  const target = versionMap.get(depName);
  if (target === undefined) {
    throw new Error(
      `Workspace dep "${depName}" (range "${range}") has no matching package in the workspace`,
    );
  }
  const suffix = range.slice('workspace:'.length);
  if (suffix === '*' || suffix === '') return target;
  if (suffix === '^') return `^${target}`;
  if (suffix === '~') return `~${target}`;
  return suffix;
}

/**
 * Rewrite a parsed package.json's dependency blocks so every
 * `workspace:`-protocol range becomes a concrete version.
 *
 * Returns the original object *by reference* when there was nothing to
 * rewrite, so callers can use an identity check to skip the file-write
 * round-trip entirely.
 */
export function rewriteWorkspaceDeps(pkg, versionMap) {
  let result = pkg;
  for (const block of DEP_BLOCKS) {
    const deps = pkg[block];
    if (!deps) continue;
    let newDeps = deps;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== 'string' || !range.startsWith('workspace:')) continue;
      if (newDeps === deps) newDeps = { ...deps };
      newDeps[name] = resolveWorkspaceProtocol(range, name, versionMap);
    }
    if (newDeps !== deps) {
      if (result === pkg) result = { ...pkg };
      result[block] = newDeps;
    }
  }
  return result;
}

/**
 * Collect every surviving `workspace:` range in a parsed manifest.
 *
 * The last line of defence before a publish: if the rewrite missed anything,
 * this is what turns it into a failed release instead of a broken tarball on
 * the registry.
 */
export function findWorkspaceRanges(pkg) {
  const found = [];
  for (const block of DEP_BLOCKS) {
    for (const [name, range] of Object.entries(pkg[block] ?? {})) {
      if (typeof range === 'string' && range.startsWith('workspace:')) {
        found.push({ block, name, range });
      }
    }
  }
  return found;
}

/**
 * Rewrite every given manifest on disk, returning an undo list to hand to
 * {@link restoreManifests}.
 *
 * Each undo entry is recorded before its file is written, so a throw partway
 * through still restores everything already touched. Callers must restore in a
 * `finally` — leaving converted manifests behind would commit concrete pins
 * into the tree and break `yarn install` for every contributor.
 */
export function convertManifestsInPlace(packages, versionMap, onConvert) {
  const undo = [];
  for (const pkg of packages) {
    const original = readFileSync(pkg.pkgPath, 'utf8');
    const parsed = JSON.parse(original);
    const rewritten = rewriteWorkspaceDeps(parsed, versionMap);
    // Same reference means there was nothing to convert — skip the write.
    if (rewritten === parsed) continue;
    undo.push({ pkgPath: pkg.pkgPath, original });
    writeFileSync(pkg.pkgPath, `${JSON.stringify(rewritten, null, 2)}\n`, 'utf8');
    onConvert?.(pkg);
  }
  return undo;
}

/** Restore manifests captured by {@link convertManifestsInPlace}. */
export function restoreManifests(undo) {
  for (const { pkgPath, original } of undo) {
    writeFileSync(pkgPath, original, 'utf8');
  }
}

/**
 * Throw if any `workspace:` range survived conversion in the on-disk manifests.
 *
 * This is the last point at which the bug is recoverable: once a manifest is on
 * the registry that version is immutable, and the only remedy is a fresh
 * release plus a deprecation of the broken one.
 */
export function assertNoWorkspaceRanges(packages) {
  const offenders = [];
  for (const pkg of packages) {
    const parsed = JSON.parse(readFileSync(pkg.pkgPath, 'utf8'));
    for (const hit of findWorkspaceRanges(parsed)) {
      offenders.push(`${pkg.name} → ${hit.block}.${hit.name} = "${hit.range}"`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `${offenders.length} workspace-protocol range(s) survived conversion:\n` +
        offenders.map((o) => `  ${o}`).join('\n'),
    );
  }
}
