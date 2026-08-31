#!/usr/bin/env node
/**
 * The CI publish lane: `changeset publish` with the workspace protocol
 * converted first.
 *
 * `changeset publish` shells out to `npm publish`, which ships
 * `workspace:*` ranges into the registry verbatim - every install of such a
 * package then fails with "Workspace not found". (Yarn converts the protocol,
 * but only under `yarn npm publish`, which changesets does not use.) 1.2.2 and
 * 1.2.3 shipped that way.
 *
 * So: rewrite every publishable manifest in place, assert nothing survived,
 * publish, and restore the originals in a `finally` - even on failure, so a
 * failed release never leaves a dirty tree for the changesets action to tag.
 *
 * Any arguments are forwarded to `changeset publish`.
 */

import { spawnSync } from 'node:child_process';
import {
  ROOT,
  assertNoWorkspaceRanges,
  buildVersionMap,
  convertManifestsInPlace,
  findPublishablePackages,
  restoreManifests,
} from './workspace-protocol.mjs';

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function main() {
  const packages = findPublishablePackages();
  if (packages.length === 0) {
    throw new Error('No publishable usemotif / @usemotif/* packages found under packages/');
  }

  const versionMap = buildVersionMap();
  log(`Converting workspace protocol in ${packages.length} publishable manifest(s)...`);
  const undo = convertManifestsInPlace(packages, versionMap, (pkg) =>
    log(`  converted ${pkg.name}`),
  );

  let status;
  try {
    assertNoWorkspaceRanges(packages);
    log(`Publishing via changeset publish...`);
    const r = spawnSync('yarn', ['changeset', 'publish', ...process.argv.slice(2)], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    if (r.error) throw r.error;
    status = r.status ?? 1;
  } finally {
    restoreManifests(undo);
    if (undo.length > 0) log(`Restored ${undo.length} manifest(s).`);
  }

  process.exit(status);
}

try {
  main();
} catch (err) {
  process.stderr.write(`${err.stack ?? err.message ?? String(err)}\n`);
  process.exit(1);
}
