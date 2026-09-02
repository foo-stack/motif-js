#!/usr/bin/env node
/**
 * Hold the public claims to their recorded evidence.
 *
 * `.claims.json` records every claim the README, the landing page, and the docs
 * make, each with a verdict and evidence someone else can re-run. A ledger
 * written once is a snapshot; this is what stops it drifting back into fiction.
 *
 * Three things go wrong on their own, and each is checked here:
 *
 *  1. The copy moves and the ledger does not. An entry whose `text` has left the
 *     file it points at is either an answered claim, which records a
 *     `disposition`, or an unrecorded edit. The second is the failure.
 *  2. A claim is marked false and shipped anyway. An entry still carrying a
 *     `fails` or `qualify` verdict, whose text is still on the page, with
 *     nothing saying what was decided, is a known-wrong claim in production.
 *  3. The evidence rots. A cited path is deleted, a symbol is renamed, a command
 *     stops exiting zero. The claim then rests on nothing, and nobody notices
 *     because the copy still reads fine.
 *
 * `text` is authoritative and `line` is advisory: lines move whenever anything
 * above them is edited, so this searches the file for the text and reports a
 * moved line as a hint rather than a failure.
 *
 * Exit codes are distinct so a failure says which kind it is:
 *   0  every entry resolves
 *   1  the ledger and the copy disagree, or evidence no longer holds
 *   2  the ledger itself could not be read or is malformed, so the run proves
 *      nothing either way
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXIT_DRIFT = 1;
const EXIT_INCONCLUSIVE = 2;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = path.join(root, '.claims.json');

function inconclusive(message, detail) {
  console.error(`claims: ${message}`);
  console.error('This run proves nothing about the claims either way.');
  if (detail) console.error(detail);
  process.exit(EXIT_INCONCLUSIVE);
}

if (!fs.existsSync(ledgerPath)) inconclusive('.claims.json is missing.');

let ledger;
try {
  ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
} catch (error) {
  inconclusive('.claims.json is not valid JSON.', error.message);
}
if (!Array.isArray(ledger.claims) || ledger.claims.length === 0) {
  inconclusive('.claims.json records no claims.');
}

const KINDS = new Set(Object.keys(ledger._evidenceKinds ?? {}));
if (KINDS.size === 0) inconclusive('.claims.json declares no evidence kinds.');

/**
 * Read a dotted path out of a JSON artifact. Segments are matched literally, so
 * a key containing a dot (`packages."@usemotif/react"`) is written with quotes.
 */
function readField(target, field) {
  let node;
  try {
    node = JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch {
    return undefined;
  }
  for (const segment of field.match(/"[^"]+"|[^.]+/g) ?? []) {
    const key = segment.startsWith('"') ? segment.slice(1, -1) : segment;
    if (node === null || typeof node !== 'object' || !(key in node)) return undefined;
    node = node[key];
  }
  return node;
}

const ACTIONS = new Set(['rewritten', 'qualified', 'removed', 'deferred']);
const problems = [];
const tally = { entries: 0, present: 0, answered: 0, manual: 0 };

const readLines = (() => {
  const cache = new Map();
  return (file) => {
    if (!cache.has(file)) {
      const full = path.join(root, file);
      cache.set(file, fs.existsSync(full) ? fs.readFileSync(full, 'utf8').split('\n') : null);
    }
    return cache.get(file);
  };
})();

for (const claim of ledger.claims) {
  tally.entries += 1;
  const { id, file, text, verdict, disposition, evidence } = claim;

  if (!id || !file || !text || !verdict || !evidence) {
    problems.push([id ?? '(no id)', 'entry is missing id, file, text, verdict, or evidence']);
    continue;
  }
  if (disposition && !ACTIONS.has(disposition.action)) {
    problems.push([id, `unknown disposition action '${disposition.action}'`]);
  }

  const lines = readLines(file);
  if (lines === null) {
    if (!disposition) problems.push([id, `points at a file that no longer exists: ${file}`]);
    continue;
  }

  const present = lines.some((line) => line.includes(text));
  if (present) tally.present += 1;
  if (disposition) tally.answered += 1;

  // 1. the copy moved and nobody recorded why
  if (!present && !disposition) {
    problems.push([id, 'its text is gone from the file and no disposition records why']);
  }
  // 2. a claim known to be wrong is still on the page, unanswered
  if (present && (verdict === 'fails' || verdict === 'qualify') && !disposition) {
    problems.push([id, `still carries the ${verdict} text with no disposition`]);
  }
  // a removed whole claim should not still be readable; a removed table cell
  // shares its row label with the cells that remain, so it legitimately can be
  if (present && disposition?.action === 'removed' && !claim.subject) {
    problems.push([id, 'is marked removed but its text is still in the file']);
  }

  // 3. the evidence rotted
  const { kind } = evidence;
  if (!KINDS.has(kind)) {
    problems.push([id, `unknown evidence kind '${kind}'`]);
    continue;
  }
  if (!evidence.note) problems.push([id, 'evidence carries no note']);

  if (kind === 'source' || kind === 'artifact') {
    if (!evidence.path) {
      problems.push([id, `${kind} evidence has no path`]);
      continue;
    }
    const target = path.join(root, evidence.path);
    if (!fs.existsSync(target)) {
      problems.push([id, `evidence path no longer exists: ${evidence.path}`]);
      continue;
    }
    // evidence only this checkout can follow is not evidence
    try {
      execSync(`git check-ignore -q ${JSON.stringify(evidence.path)}`, {
        cwd: root,
        stdio: 'ignore',
      });
      problems.push([
        id,
        `evidence path is gitignored, so nobody else can follow it: ${evidence.path}`,
      ]);
    } catch {
      /* tracked, which is what we want */
    }
    if (evidence.symbol) {
      const stat = fs.statSync(target);
      const files = stat.isDirectory()
        ? fs.readdirSync(target).map((f) => path.join(target, f))
        : [target];
      const found = files.some(
        (f) => fs.statSync(f).isFile() && fs.readFileSync(f, 'utf8').includes(evidence.symbol),
      );
      if (!found) problems.push([id, `evidence symbol not found in ${evidence.path}`]);
    }

    // A claim that quotes a value the project itself controls needs that value
    // compared, not just the file it lives in confirmed to exist. The README's
    // version number went stale for a whole release with this check green,
    // because its evidence proved a manifest was present and nothing more.
    if (evidence.field !== undefined) {
      if (evidence.value === undefined) {
        problems.push([id, `evidence names field '${evidence.field}' but no value to compare`]);
      } else {
        const actual = readField(target, evidence.field);
        if (actual === undefined) {
          problems.push([id, `evidence field '${evidence.field}' not found in ${evidence.path}`]);
        } else if (String(actual) !== String(evidence.value)) {
          problems.push([
            id,
            `evidence says ${evidence.field} is '${evidence.value}', but ${evidence.path} ` +
              `says '${actual}'`,
          ]);
        }
      }
    }
  }

  if (kind === 'command') {
    if (!evidence.run) {
      problems.push([id, 'command evidence has no run']);
      continue;
    }
    try {
      execSync(evidence.run, { cwd: root, stdio: 'ignore' });
    } catch {
      problems.push([id, `evidence command exited nonzero: ${evidence.run.slice(0, 70)}`]);
    }
  }

  // A claim about a library this project does not control has to cite that
  // library, not our own reading of it. No network call here: an unreachable
  // URL is a fact about the network, and failing CI on it would teach people to
  // ignore this check.
  if (kind === 'doc') {
    if (!evidence.url) problems.push([id, 'doc evidence has no url']);
    else if (!/^https:\/\/\S+$/.test(evidence.url)) {
      problems.push([id, `doc evidence url is not an https URL: ${evidence.url}`]);
    }
  }

  if (kind === 'manual') tally.manual += 1;
}

if (problems.length > 0) {
  console.error('claims: the ledger and the shipped copy disagree.\n');
  for (const [id, message] of problems) console.error(`  ${id}: ${message}`);
  console.error(
    `\n${problems.length} problem(s) across ${tally.entries} claims.\n` +
      `Edit the copy and the entry together: an answered claim records a ` +
      `disposition, it is never deleted.`,
  );
  process.exit(EXIT_DRIFT);
}

console.log(`claims: ${tally.entries} claims hold against their evidence.`);
console.log(`  ${tally.present} still on the page, ${tally.answered} answered and recorded`);
console.log(`  ${tally.manual} rest on a human check, which nothing here can re-run`);

// Artifact evidence that names neither a symbol nor a field proves only that a
// file exists. That is a citation, not evidence, and it is how a quoted number
// stays green while it goes stale. Reported rather than failed, because some of
// these genuinely cannot be reduced to one field and want a different evidence
// kind instead. Counted every run so the number has to shrink deliberately
// rather than being rediscovered by an audit.
const uncheckable = ledger.claims.filter((claim) => {
  const evidence = claim.evidence ?? {};
  return evidence.kind === 'artifact' && !evidence.symbol && evidence.field === undefined;
});
if (uncheckable.length > 0) {
  console.log(`  ${uncheckable.length} cite an artifact without naming what in it to check:`);
  for (const claim of uncheckable) console.log(`    ${claim.id} -> ${claim.evidence.path}`);
}
