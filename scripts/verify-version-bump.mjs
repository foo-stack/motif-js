#!/usr/bin/env node
/**
 * Sanity-check the planned version bump before publishing.
 *
 *   node scripts/verify-version-bump.mjs
 *
 * Reads the current version of `@usemotif/core` from
 * `packages/core/package.json` and the previous published version
 * from npm, and prints both. Fails (exit 1) if the major component
 * jumped by more than 1.
 *
 * For the v3 rebrand: the `@usemotif/core` package has never been
 * published before, so `npm view` returns nothing, `prev` becomes
 * `{0,0,0}`, and a planned `1.0.0` reads as `kind: graduation`. The
 * graduation branch warns (`stderr`) and continues — that's the
 * legitimate first-publish case on the new scope.
 *
 * Run this BEFORE `node scripts/publish.mjs` whenever a release
 * cycle is in flight.
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

/** Sentinel: the package is genuinely not published yet (npm 404). */
const NOT_PUBLISHED = Symbol('not-published');

/**
 * Returns the latest published version string, or {@link NOT_PUBLISHED}
 * when the registry confirms the package does not exist (404).
 *
 * Throws on any *ambiguous* failure (network, auth, registry outage). The
 * previous `catch { return null }` treated every failure as unpublished,
 * so `prev` fell back to `0.0.0`, the bump read as a `graduation` (which
 * only warns), and the script exited 0 — signalling "safe to publish" for
 * an already-published version on any transient registry hiccup. The gate
 * has to fail closed, so we distinguish "definitely not there" from
 * "couldn't tell" and abort on the latter. Mirrors publish.mjs's npmView.
 */
function publishedVersion(name) {
  let out;
  try {
    out = execSync(`npm view ${name} version`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    const detail = `${err?.stderr ?? ''}${err?.stdout ?? ''}`;
    if (/E404|404 Not Found|is not in (this|the) registry|code E404/i.test(detail)) {
      return NOT_PUBLISHED;
    }
    throw new Error(
      `npm view ${name} failed and it was not a 404 — refusing to treat it as ` +
        `unpublished (which would wave through an already-published version). ` +
        `Original error:\n${detail.trim() || err?.message || err}`,
    );
  }
  // A clean exit with empty output means the registry has no version for
  // this name — treat it the same as a 404 rather than as `0.0.0`.
  return out.length === 0 ? NOT_PUBLISHED : out;
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
const published = publishedVersion('@usemotif/core');
const isUnpublished = published === NOT_PUBLISHED;
const publishedDisplay = isUnpublished ? '(unpublished)' : published;
const prev = parseSemver(isUnpublished ? '0.0.0' : published);
const next = parseSemver(local ?? '0.0.0');

console.log(`@usemotif/core  published=${publishedDisplay}  local=${local}`);

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
// (The v2-epoch "patch-only from 1.7.0" gate was scoped to the @motif-js/*
// line, which is frozen after the v3 rebrand. The fresh @usemotif/* line
// starts at 1.0.0 with no inherited bump-policy constraint. If a similar
// gate is wanted later (e.g. patch-only from 1.0.0), reinstate it here.)
if (kind === 'downgrade') {
  console.error(`\nERROR: local ${local} is lower than published ${publishedDisplay}. Refusing.`);
  process.exit(1);
}
