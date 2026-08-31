#!/usr/bin/env node
/**
 * Fail when a banned character reaches tracked source.
 *
 * The writing rule in the coding standards bans the em dash, the en dash and
 * the ellipsis character: they read as an AI tell. Removing four thousand of
 * them once is a sweep; this is what makes it a rule, because otherwise they
 * come back on the next pull request and the whole exercise was theatre.
 *
 * Two kinds of occurrence are allowed, and both are narrow on purpose:
 *
 *   A standalone glyph. A character alone inside quotes is a symbol, not
 *   punctuation: the indeterminate mark on a checkbox, the truncation marker in
 *   pagination, the placeholder for a value that is not there yet, the elision
 *   in a code sample standing for omitted code. Rewriting those changes what a
 *   reader sees rather than how a sentence is written.
 *
 *   `.claims.json`. It quotes public copy verbatim as the record of what a
 *   claim said when it was found. Rewriting those quotes would falsify the
 *   record, so the file is skipped and its own check keeps it honest.
 *
 * Exit codes:
 *   0  clean
 *   1  a banned character reached prose
 *   2  the check could not run, so it proves nothing
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EM = '—';
const EN = '–';
const ELLIPSIS = '…';
const BANNED = new RegExp(`[${EM}${EN}${ELLIPSIS}]`, 'g');
const GLYPH = new RegExp(`(?<![\\w\`'"])(['"\`])[${EM}${EN}${ELLIPSIS}]\\1(?![\\w\`'"])`, 'g');

const EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.mjs',
  '.js',
  '.md',
  '.mdx',
  '.json',
  '.yml',
  '.yaml',
  '.css',
  '.svg',
]);
const SKIP_FILES = new Set(['.claims.json']);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let tracked;
try {
  tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
    .trim()
    .split('\n');
} catch (error) {
  console.error('writing: could not list tracked files, so nothing was checked.');
  console.error(error.message);
  process.exit(2);
}
if (tracked.length < 2) {
  console.error('writing: git listed no files, so nothing was checked.');
  process.exit(2);
}

const violations = [];
let scanned = 0;

for (const file of tracked) {
  if (SKIP_FILES.has(file)) continue;
  if (file.includes('CHANGELOG')) continue;
  if (!EXTENSIONS.has(path.extname(file))) continue;

  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  let text;
  try {
    text = fs.readFileSync(full, 'utf8');
  } catch {
    continue;
  }
  scanned += 1;
  if (!BANNED.test(text)) continue;
  BANNED.lastIndex = 0;

  text.split('\n').forEach((line, i) => {
    const withoutGlyphs = line.replace(GLYPH, '');
    const found = withoutGlyphs.match(BANNED);
    BANNED.lastIndex = 0;
    if (found) violations.push({ file, line: i + 1, chars: found.join(''), text: line.trim() });
  });
}

if (violations.length > 0) {
  console.error(`writing: ${violations.length} banned character(s) in tracked source.\n`);
  for (const v of violations.slice(0, 40)) {
    console.error(`  ${v.file}:${v.line}  ${JSON.stringify(v.chars)}`);
    console.error(`    ${v.text.slice(0, 100)}`);
  }
  if (violations.length > 40) console.error(`  ...and ${violations.length - 40} more`);
  console.error(
    `\nUse a hyphen for a separator, or rephrase. Three dots for an ellipsis.\n` +
      `\`node scripts/fix-writing.mjs --mode all <path>\` applies the usual cases;\n` +
      `it reports anything it will not decide for you.`,
  );
  process.exit(1);
}

console.log(`writing: ${scanned} tracked files carry no banned characters.`);
