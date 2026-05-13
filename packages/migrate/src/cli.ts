#!/usr/bin/env node
/**
 * `motif-js-migrate` CLI.
 *
 * Usage:
 *   motif-js-migrate rename-v2 [path] [--dry-run]
 *   motif-js-migrate --help
 *
 * Default path is the current working directory. The transform walks
 * matching files via fast-glob, applies `applyRenameV2`, and writes
 * back any file whose content changed.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { exit, stderr, stdout } from 'node:process';
import fg from 'fast-glob';
import { applyRenameV2, needsRenameV2 } from './transforms/rename-v2.js';

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

const HELP = `motif-js-migrate — codemod toolkit for motif-js

Usage:
  motif-js-migrate rename-v2 [path]   Rewrite v1 motif-js import specifiers
                                      to their v2 names in every file under
                                      [path] (default: cwd).
  motif-js-migrate --help             Show this message.

Flags:
  --dry-run     Print the files that would change without writing them.

Rename map:
  @motif-js/react-web    →  @motif-js/react
  @motif-js/react        →  motif-js
  @motif-js/react-native →  (unchanged)

Subpath imports (@motif-js/react/server, @motif-js/react/tanstack-virtual)
stay on @motif-js/react.
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

async function runRenameV2(rootArg: string, dryRun: boolean): Promise<number> {
  const root = resolve(rootArg);
  const files = await fg(DEFAULT_GLOBS, { cwd: root, absolute: true, dot: false });
  let changed = 0;
  for (const absPath of files) {
    const src = await readFile(absPath, 'utf8');
    if (!needsRenameV2(src)) continue;
    const out = applyRenameV2(src);
    if (out === src) continue;
    const rel = relative(root, absPath);
    if (dryRun) {
      stdout.write(`would change: ${rel}\n`);
    } else {
      await writeFile(absPath, out, 'utf8');
      stdout.write(`changed: ${rel}\n`);
    }
    changed++;
  }
  stdout.write(
    `${dryRun ? 'would change' : 'changed'} ${changed} file${changed === 1 ? '' : 's'}.\n`,
  );
  return 0;
}

export async function main(argv: readonly string[]): Promise<number> {
  const args = parseArgs(argv);
  if (args.help || args.command === null) {
    stdout.write(HELP);
    return 0;
  }
  if (args.command === 'rename-v2') {
    return runRenameV2(args.path, args.dryRun);
  }
  stderr.write(`unknown command: ${args.command}\n`);
  stderr.write(HELP);
  return 2;
}
