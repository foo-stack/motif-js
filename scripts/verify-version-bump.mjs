#!/usr/bin/env node
/**
 * Sanity-check the planned version bump before publishing.
 *
 *   node scripts/verify-version-bump.mjs
 *
 * Reads the current version of `@motif-js/core` from
 * `packages/core/package.json` and the previous published version
 * from npm, and prints both. Fails (exit 1) if the major component
 * jumped by more than 1 — catches the v0.3.0 → v1.0.0 surprise we
 * hit closing Phase E (intended bump was v0.4.0, all changesets
 * declared `minor`, but the linked-mode + 0.x cli combo graduated
 * to 1.0.0).
 *
 * Run this BEFORE `node scripts/publish.mjs` whenever a release
 * cycle is in flight. A future enhancement could parse pending
 * `.changeset/*.md` files and show the predicted bump per-package.
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');

function localVersion(pkg) {
  const json = JSON.parse(readFileSync(`${ROOT}/packages/${pkg}/package.json`, 'utf8'));
  return json.version;
}

function publishedVersion(name) {
  try {
    return execSync(`npm view ${name} version`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function parseSemver(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v);
  if (m === null) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

function jumpKind(prev, next) {
  if (prev === null || next === null) return 'unknown';
  if (next.major > prev.major) {
    if (prev.major === 0 && next.major === 1) return 'graduation';
    return next.major - prev.major === 1 ? 'major' : 'major-skip';
  }
  if (next.major === prev.major && next.minor > prev.minor) return 'minor';
  if (next.major === prev.major && next.minor === prev.minor && next.patch > prev.patch)
    return 'patch';
  if (next.major === prev.major && next.minor === prev.minor && next.patch === prev.patch)
    return 'no-op';
  return 'downgrade';
}

const local = localVersion('core');
const published = publishedVersion('@motif-js/core');
const prev = parseSemver(published ?? '0.0.0');
const next = parseSemver(local ?? '0.0.0');

console.log(`@motif-js/core  published=${published ?? '(unpublished)'}  local=${local}`);

const kind = jumpKind(prev, next);
console.log(`bump kind: ${kind}`);

if (kind === 'major-skip') {
  console.error(
    `\nERROR: major jumped by more than 1 (${prev?.major} → ${next?.major}). ` +
      `If this is intentional, override with --allow-skip. Otherwise, inspect ` +
      `.changeset/ + the auto-version PR before publishing.`,
  );
  if (!process.argv.includes('--allow-skip')) process.exit(1);
}
if (kind === 'graduation') {
  console.warn(
    `\nWARNING: this release graduates 0.x → 1.0. Confirm Phase ROADMAP is ` +
      `up-to-date and that v1.0 is the intended public-stability claim.`,
  );
}
// Minor lineage was capped at 1.5.0; M-5 + M-6 drifted to 1.7.0. From
// 1.7.0 onward the policy is patch-only — any future change ships as
// 1.7.X regardless of how meaningful it is. Override with --allow-minor
// only after explicit confirmation that minor semantics are wanted.
if (
  kind === 'minor' &&
  prev !== null &&
  (prev.major > 1 || (prev.major === 1 && prev.minor >= 7))
) {
  console.error(
    `\nERROR: minor bump (${prev.major}.${prev.minor} → ${next?.major}.${next?.minor}) blocked. ` +
      `From 1.7.0 onward, motif-js releases are patch-only — see ` +
      `~/.claude/projects/.../memory/feedback_patch_only_bumps.md. ` +
      `If a genuine minor is intended, override with --allow-minor.`,
  );
  if (!process.argv.includes('--allow-minor')) process.exit(1);
}
if (kind === 'downgrade') {
  console.error(`\nERROR: local ${local} is lower than published ${published}. Refusing.`);
  process.exit(1);
}
