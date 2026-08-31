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
 * graduation branch warns (`stderr`) and continues - that's the
 * legitimate first-publish case on the new scope.
 *
 * Run this BEFORE `node scripts/publish.mjs` whenever a release
 * cycle is in flight.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyBump } from './version-bump.mjs';

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
 * only warns), and the script exited 0 - signalling "safe to publish" for
 * an already-published version on any transient registry hiccup. The gate
 * has to fail closed, so we distinguish "definitely not there" from
 * "couldn't tell" and abort on the latter. Mirrors publish.mjs's npmView.
 */
function publishedVersion(name) {
  // argv form (no shell) so the package name can never be parsed as shell
  // syntax; a 404 is distinguished from an ambiguous failure via the result.
  const r = spawnSync('npm', ['view', name, 'version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (r.error) {
    throw new Error(`npm view ${name} could not run: ${r.error.message}`);
  }
  if (r.status !== 0) {
    const detail = `${r.stderr ?? ''}${r.stdout ?? ''}`;
    if (/E404|404 Not Found|is not in (this|the) registry|code E404/i.test(detail)) {
      return NOT_PUBLISHED;
    }
    throw new Error(
      `npm view ${name} failed and it was not a 404 - refusing to treat it as ` +
        `unpublished (which would wave through an already-published version). ` +
        `Original error:\n${detail.trim() || `exit ${r.status}`}`,
    );
  }
  const out = (r.stdout ?? '').trim();
  // A clean exit with empty output means the registry has no version for
  // this name - treat it the same as a 404 rather than as `0.0.0`.
  return out.length === 0 ? NOT_PUBLISHED : out;
}

const local = localVersion('core');
const published = publishedVersion('@usemotif/core');
const isUnpublished = published === NOT_PUBLISHED;
const publishedDisplay = isUnpublished ? '(unpublished)' : published;

console.log(`@usemotif/core  published=${publishedDisplay}  local=${local}`);

// A never-published package legitimately has no prior version: compare
// against 0.0.0 so a planned 1.0.0 reads as `graduation`, not a parse
// failure.
const kind = classifyBump(isUnpublished ? '0.0.0' : published, local);
console.log(`bump kind: ${kind}`);

if (kind === 'unknown') {
  // An unparseable local (or published) version used to fall through every
  // guard and exit 0 - silently signalling "safe to publish". Fail closed:
  // a version we can't reason about must block the release.
  console.error(
    `\nERROR: could not classify the version bump (published=${publishedDisplay}, ` +
      `local=${local}). Refusing - fix the version string before publishing.`,
  );
  process.exit(1);
}
if (kind === 'major-skip') {
  // Reference the real versions (there are no `prev`/`next` bindings in this
  // file - classifyBump returns only a string kind), and read --allow-skip
  // before building the message so the documented override actually works.
  const allow = process.argv.includes('--allow-skip');
  console.error(
    `\nERROR: major jumped by more than 1 (${publishedDisplay} → ${local}). ` +
      `If this is intentional, override with --allow-skip. Otherwise, inspect ` +
      `.changeset/ + the auto-version PR before publishing.`,
  );
  if (!allow) process.exit(1);
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
