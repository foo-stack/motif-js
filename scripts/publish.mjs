#!/usr/bin/env node
/**
 * Publish the usemotif + @usemotif/* packages to npm from a clean local checkout.
 *
 *   node scripts/publish.mjs                   # full run — preflight, build, confirm, publish
 *   node scripts/publish.mjs --dry-run         # print plan, do nothing
 *   node scripts/publish.mjs --skip-build      # assume dist/ already fresh
 *   node scripts/publish.mjs --skip-checks     # skip git-clean + on-main checks
 *   node scripts/publish.mjs --otp=123456      # pass OTP to each publish (good for ~5min)
 *   node scripts/publish.mjs --tag             # also create v<core-version> git tag
 *   node scripts/publish.mjs --tag --push-tag  # …and push the tag to origin
 *   node scripts/publish.mjs --yes             # skip the interactive confirmation
 *
 * Exits non-zero on the first failure; already-published packages are
 * skipped (not treated as errors), so reruns after a partial failure
 * are safe.
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const PACKAGES_DIR = join(ROOT, 'packages');

const args = process.argv.slice(2);
const argSet = new Set(args);
const DRY_RUN = argSet.has('--dry-run') || argSet.has('-n');
const SKIP_BUILD = argSet.has('--skip-build');
const SKIP_CHECKS = argSet.has('--skip-checks') || argSet.has('-f');
const MAKE_TAG = argSet.has('--tag');
const PUSH_TAG = argSet.has('--push-tag');
const SKIP_CONFIRM = argSet.has('--yes') || argSet.has('-y');
const OTP = (() => {
  const arg = args.find((a) => a.startsWith('--otp='));
  return arg ? arg.slice('--otp='.length) : null;
})();

const COLORS = {
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(msg) {
  process.stdout.write(`${msg}\n`);
}
function header(msg) {
  log(`${COLORS.bold}${COLORS.blue}▸ ${msg}${COLORS.reset}`);
}
function success(msg) {
  log(`${COLORS.green}✓${COLORS.reset} ${msg}`);
}
function warn(msg) {
  log(`${COLORS.yellow}! ${msg}${COLORS.reset}`);
}
function fail(msg) {
  log(`${COLORS.red}✗ ${msg}${COLORS.reset}`);
}
function dim(msg) {
  return `${COLORS.dim}${msg}${COLORS.reset}`;
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function findPublishablePackages() {
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
    // Publishable surface: every `@usemotif/*` workspace plus the
    // unscoped `usemotif` meta package. (Brand history: the meta
    // package was `@motif-js/react` in v1; renamed to `usemotif` in
    // v2 after npm blocked the originally-planned `motif-js` name as
    // too similar to an existing `motif.js`. The 13 sibling packages
    // moved from `@motif-js/*` to `@usemotif/*` in v3.)
    if (pkg.name !== 'usemotif' && !pkg.name?.startsWith('@usemotif/')) continue;
    out.push({ name: pkg.name, version: pkg.version, dir, pkgPath });
  }
  return out.toSorted((a, b) => a.name.localeCompare(b.name));
}

/** Sentinel: the package is genuinely not published yet (npm 404). */
const NOT_PUBLISHED = Symbol('not-published');

/**
 * Returns the latest published version string, or {@link NOT_PUBLISHED}
 * when the registry confirms the package does not exist (404).
 *
 * Throws on any *ambiguous* failure (network, auth, registry outage). The
 * previous `catch { return null }` swallowed every error and treated the
 * package as new, so a transient blip would attempt to (re)publish
 * already-published versions and defeat the idempotent-skip guarantee the
 * header comment promises. We must distinguish "definitely not there" from
 * "couldn't tell" and abort on the latter.
 */
function npmView(name) {
  try {
    return run(`npm view ${name} version`, { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    const detail = `${err?.stderr ?? ''}${err?.stdout ?? ''}`;
    if (/E404|404 Not Found|is not in (this|the) registry|code E404/i.test(detail)) {
      return NOT_PUBLISHED;
    }
    throw new Error(
      `npm view ${name} failed and it was not a 404 — refusing to treat it as a new ` +
        `package (that could republish existing versions). Original error:\n${detail.trim() || err?.message || err}`,
    );
  }
}

/**
 * Build a Map of workspace package name → current local version.
 * Includes every package under packages/, not just publishable ones,
 * so a published package depending on a private workspace sibling
 * (rare, but legal) still gets resolved.
 */
function buildVersionMap() {
  const map = new Map();
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
    if (pkg.name && pkg.version) {
      map.set(pkg.name, pkg.version);
    }
  }
  return map;
}

/**
 * Resolve a single yarn workspace-protocol range to a concrete semver
 * range that npm understands. Mirrors Yarn 4's published-manifest
 * rewrite:
 *
 *   workspace:*           → "1.2.3"
 *   workspace:^           → "^1.2.3"
 *   workspace:~           → "~1.2.3"
 *   workspace:^1.0.0      → "^1.0.0"  (already explicit, just strip)
 */
function resolveWorkspaceProtocol(range, depName, versionMap) {
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
 * Rewrite a parsed package.json's `dependencies`, `devDependencies`,
 * and `peerDependencies` blocks so all `workspace:*` ranges become
 * concrete versions. Returns the original object unchanged if no
 * workspace deps were found, so callers can use referential equality
 * to skip the file-write round-trip.
 */
function rewriteWorkspaceDeps(pkg, versionMap) {
  let result = pkg;
  for (const block of ['dependencies', 'devDependencies', 'peerDependencies']) {
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

function preflight() {
  header('Preflight');

  if (!SKIP_CHECKS) {
    const branch = run('git rev-parse --abbrev-ref HEAD');
    if (branch !== 'main') {
      fail(`Not on main (currently on '${branch}'). Pass --skip-checks to override.`);
      process.exit(1);
    }
    success(`On branch main`);

    const dirty = run('git status --porcelain');
    if (dirty) {
      fail(
        `Working tree is dirty:\n${dirty}\nCommit or stash before publishing. Pass --skip-checks to override.`,
      );
      process.exit(1);
    }
    success('Working tree is clean');

    const aheadBehind = run('git rev-list --left-right --count origin/main...HEAD').split('\t');
    const [behind, ahead] = aheadBehind.map((n) => Number.parseInt(n, 10));
    if (ahead > 0) {
      warn(
        `You are ${ahead} commit(s) ahead of origin/main — these are being published without being pushed.`,
      );
    }
    if (behind > 0) {
      fail(`You are ${behind} commit(s) behind origin/main. Pull first.`);
      process.exit(1);
    }
  } else {
    warn('Skipping git-clean + on-main checks (--skip-checks)');
  }

  try {
    const who = run('npm whoami');
    success(`Logged in to npm as ${COLORS.bold}${who}${COLORS.reset}`);
  } catch {
    fail('Not logged in to npm. Run `npm login` first, or set NPM_TOKEN in your env.');
    process.exit(1);
  }

  if (OTP !== null) {
    success(`OTP supplied (will be passed to each npm publish)`);
  } else {
    log(
      dim(
        '  No --otp= passed; npm will prompt interactively per package if 2FA is required for publish.',
      ),
    );
  }
}

function build() {
  if (SKIP_BUILD) {
    warn('Skipping build (--skip-build) — assuming dist/ is fresh');
    return;
  }
  header('Building packages');
  const r = spawnSync('yarn', ['build'], { stdio: 'inherit', cwd: ROOT });
  if (r.status !== 0) {
    fail('Build failed.');
    process.exit(r.status ?? 1);
  }
  success('Build succeeded');
}

function plan(packages) {
  header('Publish plan');
  const rows = packages.map((p) => {
    // npmView throws on ambiguous failures — that intentionally aborts the
    // whole run via main().catch rather than silently publishing.
    const viewed = npmView(p.name);
    const isNew = viewed === NOT_PUBLISHED;
    // Normalise the sentinel back to null so the toPublish/skipped filters
    // below keep working (`null !== version` ⇒ publish).
    const published = isNew ? null : viewed;
    const status = isNew
      ? `${COLORS.green}new${COLORS.reset}`
      : published === p.version
        ? `${COLORS.dim}already published${COLORS.reset}`
        : `${COLORS.green}${published} → ${p.version}${COLORS.reset}`;
    return { ...p, published, status };
  });
  const nameWidth = Math.max(...rows.map((r) => r.name.length));
  for (const r of rows) {
    log(`  ${r.name.padEnd(nameWidth)}  ${r.status}`);
  }
  const toPublish = rows.filter((r) => r.published !== r.version);
  const skipped = rows.filter((r) => r.published === r.version);
  if (skipped.length > 0) {
    log(dim(`  (${skipped.length} already at target version — will be skipped)`));
  }
  return { rows, toPublish, skipped };
}

async function confirm(message) {
  if (SKIP_CONFIRM || DRY_RUN) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(`${message} [y/N] `, (ans) => {
      rl.close();
      res(ans.trim().toLowerCase().startsWith('y'));
    });
  });
}

function publishOne(pkg, versionMap) {
  const label = `${pkg.name}@${pkg.version}`;
  if (DRY_RUN) {
    log(`  ${dim('[dry-run]')} would publish ${label}`);
    return { ok: true, pkg, skipped: false };
  }

  // Yarn 4 stores cross-package deps as `workspace:*`; raw `npm publish`
  // ships those strings verbatim and bricks every install with
  // EUNSUPPORTEDPROTOCOL. Rewrite to concrete versions in-place,
  // run the publish, then restore the original file content
  // (regardless of success/failure) so the working tree stays clean.
  const originalContent = readFileSync(pkg.pkgPath, 'utf8');
  const rewritten = rewriteWorkspaceDeps(JSON.parse(originalContent), versionMap);
  const needsRewrite = rewritten !== JSON.parse(originalContent);

  let r;
  try {
    if (needsRewrite) {
      writeFileSync(pkg.pkgPath, `${JSON.stringify(rewritten, null, 2)}\n`, 'utf8');
    }
    const npmArgs = ['publish', '--access', 'public'];
    if (OTP !== null) npmArgs.push(`--otp=${OTP}`);
    r = spawnSync('npm', npmArgs, {
      cwd: pkg.dir,
      stdio: 'inherit',
    });
  } finally {
    if (needsRewrite) {
      writeFileSync(pkg.pkgPath, originalContent, 'utf8');
    }
  }

  if (r.status === 0) {
    success(`Published ${label}`);
    return { ok: true, pkg, skipped: false };
  }
  fail(`Failed to publish ${label} (exit ${r.status})`);
  return { ok: false, pkg, skipped: false };
}

function maybeTag(packages) {
  if (!MAKE_TAG) return;
  const core = packages.find((p) => p.name === '@usemotif/core');
  if (!core) {
    warn('No @usemotif/core found — skipping tag');
    return;
  }
  const tagName = `v${core.version}`;
  header(`Tagging ${tagName}`);
  if (DRY_RUN) {
    log(`  ${dim('[dry-run]')} would run: git tag ${tagName}`);
    if (PUSH_TAG) log(`  ${dim('[dry-run]')} would run: git push origin ${tagName}`);
    return;
  }
  try {
    run(`git tag ${tagName}`, { stdio: 'pipe' });
    success(`Created tag ${tagName}`);
  } catch (err) {
    fail(`Failed to create tag ${tagName}: ${err.message}`);
    return;
  }
  if (PUSH_TAG) {
    try {
      run(`git push origin ${tagName}`, { stdio: 'pipe' });
      success(`Pushed tag ${tagName} to origin`);
    } catch (err) {
      fail(`Failed to push tag: ${err.message}`);
    }
  } else {
    log(dim(`  push manually with: git push origin ${tagName}`));
  }
}

async function main() {
  const packages = findPublishablePackages();
  if (packages.length === 0) {
    fail('No publishable usemotif / @usemotif/* packages found under packages/');
    process.exit(1);
  }

  preflight();
  build();
  const { toPublish } = plan(packages);

  if (toPublish.length === 0) {
    success('Nothing to publish — every package is already at its target version.');
    return;
  }

  const ok = await confirm(
    DRY_RUN
      ? 'Dry-run — print the publish plan only?'
      : `Publish ${toPublish.length} package(s) to https://registry.npmjs.org now?`,
  );
  if (!ok) {
    warn('Aborted by user.');
    process.exit(1);
  }

  header('Publishing');
  const versionMap = buildVersionMap();
  const results = toPublish.map((pkg) => publishOne(pkg, versionMap));

  const failures = results.filter((r) => !r.ok);
  log('');
  header('Summary');
  for (const r of results) {
    const prefix = r.ok ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
    log(`  ${prefix} ${r.pkg.name}@${r.pkg.version}`);
  }

  if (failures.length > 0) {
    fail(`${failures.length} package(s) failed to publish.`);
    process.exit(1);
  }

  maybeTag(packages);

  success(`Done — ${results.length} package(s) published${MAKE_TAG ? ' + tagged' : ''}.`);
}

main().catch((err) => {
  fail(err.stack ?? err.message ?? String(err));
  process.exit(1);
});
