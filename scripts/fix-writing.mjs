#!/usr/bin/env node
/**
 * Replace the characters the writing rule bans, in prose only.
 *
 * The rule in the coding standards bans the em dash, the en dash, and the
 * ellipsis character. There are thousands of them, which is why this is a
 * script: a sweep that size cannot be reviewed as hand-work, and the same rules
 * have to run again later against the rendered surfaces and the remaining code
 * lines.
 *
 * Two modes, because the risk is not the same everywhere:
 *
 *   comments  Only lines that are entirely a comment. Used for package source,
 *             where a string literal carrying one of these characters is
 *             behaviour, not prose, and editing it would change what the code
 *             does or what a test asserts.
 *   all       Every line. Used for scripts, configs and markdown, which are
 *             prose end to end.
 *
 * Substitutions are deliberately narrow. ` - ` spaced on both sides is the
 * overwhelming majority and is the only em dash shape this touches. Anything
 * else is left for a person, because the replacement depends on the sentence:
 * see the report this prints at the end.
 *
 *   node scripts/fix-writing.mjs --mode comments <path>...
 *   node scripts/fix-writing.mjs --mode all --dry-run <path>...
 */
import fs from 'node:fs';
import path from 'node:path';

// Escape sequences, not the characters themselves. A file that carries the
// literal em dash cannot survive its own sweep: an earlier version of this
// script rewrote `ELLIPSIS` to '...' and quietly turned the BANNED character
// class into one that matches every full stop. Writing them as escapes also
// keeps this file clean for the check that comes later.
const EM = '\u2014';
const EN = '\u2013';
const ELLIPSIS = '\u2026';
const BANNED = new RegExp(`[${EM}${EN}${ELLIPSIS}]`);

/** A line that is nothing but a comment. `{/*` covers JSX, which is easy to miss. */
function isCommentLine(line) {
  const trimmed = line.trim();
  return (
    trimmed.startsWith('*') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('{/*')
  );
}

/**
 * Apply only the shapes we are confident about, and report the rest.
 * Returns the new line plus every occurrence it deliberately did not touch.
 */
function rewrite(line) {
  const skipped = [];
  let out = line;

  // A character standing alone as a string value is a symbol, not punctuation:
  // the indeterminate mark on a checkbox, the truncation marker in pagination,
  // the placeholder for "no value yet". Replacing those changes what a reader
  // sees rather than how a sentence is written, so they are protected here and
  // restored afterwards. This is a rule rather than a list, so it keeps holding
  // as more of them appear.
  const glyphs = [];
  // The lookarounds matter: `` `xs`-`xl` `` contains the substring `` `-` ``
  // without being a standalone glyph, and rewriting it as one leaves a range
  // separator sitting between two code spans untouched.
  out = out.replace(
    new RegExp(`(?<![\\w\`'"])(['"\`])([${EM}${EN}${ELLIPSIS}])\\1(?![\\w\`'"])`, 'g'),
    (match) => {
      glyphs.push(match);
      return `@@motifGlyph${glyphs.length - 1}@@`;
    },
  );

  // The dominant shape: a spaced em dash used as a separator.
  out = out.replaceAll(` ${EM} `, ' - ');
  // The same separator, wrapped: the dash ends the line and the clause
  // continues on the next one. 69 of the 75 shapes that are not the simple case
  // are this, and treating them as anything else would be wrong.
  out = out.replace(new RegExp(` ${EM}$`), ' -');
  // An ellipsis is always three dots, whatever surrounds it.
  out = out.replaceAll(ELLIPSIS, '...');
  // Every en dash left after glyph protection is a range separator: 6-144,
  // h1-h6, `xs`-`xl`, or `${a} - ${b}` where interpolation forces the spaces.
  // A spaced one keeps its spaces; the rest collapse to a bare hyphen.
  out = out.replaceAll(` ${EN} `, ' - ');
  out = out.replaceAll(EN, '-');

  out = out.replace(/@@motifGlyph(\d+)@@/g, (_, i) => glyphs[Number(i)]);

  for (const match of out.matchAll(new RegExp(`.?[${EM}${EN}].?`, 'g'))) {
    skipped.push(match[0]);
  }
  return { out, skipped };
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const modeIndex = args.indexOf('--mode');
const mode = modeIndex === -1 ? 'comments' : args[modeIndex + 1];
if (mode !== 'comments' && mode !== 'all') {
  console.error(`fix-writing: unknown mode '${mode}'. Use 'comments' or 'all'.`);
  process.exit(2);
}
const targets = args.filter((a, i) => !a.startsWith('--') && i !== modeIndex + 1);
if (targets.length === 0) {
  console.error('fix-writing: no paths given.');
  process.exit(2);
}

/** Expand a directory into the source files this script knows how to read. */
const EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.mjs',
  '.md',
  '.mdx',
  '.json',
  '.yml',
  '.yaml',
  '.js',
  '.css',
  '.svg',
]);
function expand(target) {
  if (!fs.existsSync(target)) return [];
  if (fs.statSync(target).isFile()) return [target];
  const out = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === 'dist' ||
        entry.name === '.git' ||
        entry.name === 'storybook-static' ||
        entry.name === 'test-results' ||
        entry.name === '__visual__'
      ) {
        // Build output and committed fixtures. Rewriting a bundle would edit
        // data, and rewriting a baseline PNG is meaningless.
        continue;
      }
      out.push(...expand(full));
    } else if (EXTENSIONS.has(path.extname(entry.name)) && !entry.name.includes('CHANGELOG')) {
      out.push(full);
    }
  }
  return out;
}

const files = targets.flatMap(expand);
let filesChanged = 0;
let replaced = 0;
const skippedByFile = new Map();

for (const file of files) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
  const original = fs.readFileSync(file, 'utf8');
  if (!BANNED.test(original)) continue;

  const lines = original.split('\n');
  const skipped = [];
  let touched = false;

  const next = lines.map((line, i) => {
    if (!BANNED.test(line)) return line;
    if (mode === 'comments' && !isCommentLine(line)) {
      skipped.push(`${i + 1}: ${line.trim().slice(0, 90)}`);
      return line;
    }
    const { out, skipped: left } = rewrite(line);
    if (out !== line) {
      touched = true;
      replaced += (line.length - out.length) / 2 || 1;
    }
    for (const s of left) skipped.push(`${i + 1}: shape ${JSON.stringify(s)}`);
    return out;
  });

  if (skipped.length > 0) skippedByFile.set(file, skipped);
  if (touched) {
    filesChanged += 1;
    if (!dryRun) fs.writeFileSync(file, next.join('\n'));
  }
}

console.log(`${dryRun ? 'would change' : 'changed'} ${filesChanged} file(s), mode '${mode}'`);
if (skippedByFile.size > 0) {
  const total = [...skippedByFile.values()].reduce((n, s) => n + s.length, 0);
  console.log(`\nleft for a person: ${total} occurrence(s) in ${skippedByFile.size} file(s)`);
  for (const [file, entries] of skippedByFile) {
    console.log(`  ${path.relative(process.cwd(), file)}`);
    for (const e of entries) console.log(`    ${e}`);
  }
}
