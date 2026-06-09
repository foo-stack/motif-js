#!/usr/bin/env node
/**
 * `usemotif-migrate` CLI.
 *
 * Usage:
 *   usemotif-migrate rename-v3 [path] [--dry-run]
 *   usemotif-migrate rename-v2 [path] [--dry-run]
 *   usemotif-migrate --help
 *
 * Default path is the current working directory. The transform walks
 * matching files via fast-glob, applies the transform, and writes
 * back any file whose content changed.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { exit, stderr, stdout } from 'node:process';
import fg from 'fast-glob';
import { applyWithinMarkdownCode, isMarkdownPath } from './markdown.js';
import { applyRenameV2, needsRenameV2 } from './transforms/rename-v2.js';
import { applyRenameV3, needsRenameV3 } from './transforms/rename-v3.js';

interface ParsedArgs {
  readonly command: string | null;
  readonly path: string;
  readonly dryRun: boolean;
  readonly help: boolean;
}

const DEFAULT_GLOBS: string[] = [
  '**/*.{ts,tsx,js,jsx,mjs,cjs,md,mdx,json}',
  '!**/node_modules/**',
  '!**/dist/**',
  '!**/.next/**',
  '!**/.vorge/**',
  '!**/.turbo/**',
  '!**/.cache/**',
  '!**/build/**',
  '!**/out/**',
  '!**/coverage/**',
  '!**/__visual__/**',
];

const HELP = `usemotif-migrate — codemod toolkit for motif-js

Usage:
  usemotif-migrate rename-v3 [path]   Rewrite v1 or v2 motif-js import
                                      specifiers to their v3 (@usemotif/*)
                                      names in every file under [path]
                                      (default: cwd).

  usemotif-migrate rename-v2 [path]   Rewrite v1 motif-js import specifiers
                                      to their v2 names. Use this before
                                      rename-v3 if you're still on v1
                                      cross-platform code (see below).

  usemotif-migrate --help             Show this message.

Flags:
  --dry-run     Print the files that would change without writing them.

rename-v3 rename map:
  @motif-js/react-web      →  @usemotif/react
  @motif-js/react          →  @usemotif/react  ⚠ (see note)
  @motif-js/react-native   →  @usemotif/react-native
  @motif-js/<other>        →  @usemotif/<other>

  Subpath imports (e.g. @motif-js/react/server) survive — the
  renamed DOM bindings still own those exports under
  @usemotif/react.

⚠ The @motif-js/react ambiguity:
  In v1 this was the cross-platform aggregator; in v2 it was the
  DOM bindings. rename-v3 always maps it to @usemotif/react (the v3
  DOM bindings). For v1 cross-platform code that should instead
  become the unscoped 'usemotif' meta package, run rename-v2 FIRST
  to disambiguate, then rename-v3:

    usemotif-migrate rename-v2 .
    usemotif-migrate rename-v3 .

rename-v2 rename map (v1 → v2, kept for back-compat):
  @motif-js/react-web      →  @motif-js/react
  @motif-js/react          →  usemotif
  @motif-js/react-native   →  (unchanged)
`;

function parseArgs(argv: readonly string[]): ParsedArgs {
  let command: string | null = null;
  let path = '.';
  let dryRun = false;
  let help = false;
  let positionalIndex = 0;
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      help = true;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg.startsWith('--')) {
      stderr.write(`unknown flag: ${arg}\n`);
      exit(2);
    } else if (positionalIndex === 0) {
      command = arg;
      positionalIndex++;
    } else if (positionalIndex === 1) {
      path = arg;
      positionalIndex++;
    } else {
      stderr.write(`unexpected positional argument: ${arg}\n`);
      exit(2);
    }
  }
  return { command, path, dryRun, help };
}

interface Transform {
  readonly apply: (source: string) => string;
  readonly needs: (source: string) => boolean;
}

async function runTransform(
  rootArg: string,
  dryRun: boolean,
  transform: Transform,
): Promise<number> {
  const root = resolve(rootArg);
  const files = await fg(DEFAULT_GLOBS, { cwd: root, absolute: true, dot: false });
  let changed = 0;
  let failed = 0;
  for (const absPath of files) {
    const rel = relative(root, absPath);
    // Guard each file independently: one unreadable/unwritable file (EACCES,
    // EISDIR, a transform throw) must not abort the run and strand the files
    // already rewritten with a raw stack trace. Collect failures and report.
    try {
      const src = await readFile(absPath, 'utf8');
      if (!transform.needs(src)) continue;
      // In Markdown/MDX, only rewrite code regions (fenced blocks + inline
      // code) so prose mentions of old specifiers — changelog entries,
      // migration notes — aren't silently corrupted.
      const out = isMarkdownPath(absPath)
        ? applyWithinMarkdownCode(src, transform.apply)
        : transform.apply(src);
      if (out === src) continue;
      if (dryRun) {
        stdout.write(`would change: ${rel}\n`);
      } else {
        await writeFile(absPath, out, 'utf8');
        stdout.write(`changed: ${rel}\n`);
      }
      changed++;
    } catch (err) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      stderr.write(`failed: ${rel}: ${message}\n`);
    }
  }
  stdout.write(
    `${dryRun ? 'would change' : 'changed'} ${changed} file${changed === 1 ? '' : 's'}` +
      `${failed > 0 ? `, failed on ${failed}` : ''}.\n`,
  );
  // Non-zero exit on any failure so CI / scripted callers notice.
  return failed > 0 ? 1 : 0;
}

export async function main(argv: readonly string[]): Promise<number> {
  const args = parseArgs(argv);
  if (args.help || args.command === null) {
    stdout.write(HELP);
    return 0;
  }
  if (args.command === 'rename-v3') {
    return runTransform(args.path, args.dryRun, {
      apply: applyRenameV3,
      needs: needsRenameV3,
    });
  }
  if (args.command === 'rename-v2') {
    return runTransform(args.path, args.dryRun, {
      apply: applyRenameV2,
      needs: needsRenameV2,
    });
  }
  stderr.write(`unknown command: ${args.command}\n`);
  stderr.write(HELP);
  return 2;
}
