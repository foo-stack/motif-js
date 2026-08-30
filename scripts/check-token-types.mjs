#!/usr/bin/env node
/**
 * Prove that token paths actually reach a style prop's type.
 *
 * The failure mode this guards is silence. A style prop's value union keeps
 * `(string & {})` so raw CSS values compile, which means a severed
 * augmentation channel produces no error anywhere: the code still builds, the
 * editor just stops suggesting anything. Nothing else in the build would
 * notice.
 *
 * So this compiles a fixture that augments `MotifCustomTheme` exactly the way
 * the docs tell a consumer to, then reads the resolved type of a style prop
 * and looks for the token arm.
 *
 * Exit codes are distinct on purpose:
 *   0  the token arm is present
 *   1  the fixture compiled and the token arm is missing (a regression)
 *   2  the fixture did not compile, so the run proves nothing either way
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const EXIT_MISSING_TOKENS = 1;
const EXIT_INCONCLUSIVE = 2;

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(here, 'fixtures', 'token-types');
const tsconfigPath = path.join(fixtureDir, 'tsconfig.json');
const strictDir = path.join(here, 'fixtures', 'token-types-strict');

/** The props the probe reads, and the scale each one must resolve against. */
const PROBES = [
  { alias: 'PaddingValue', prefix: '$space.', foreign: '$colors.' },
  { alias: 'BackgroundValue', prefix: '$colors.', foreign: '$space.' },
  { alias: 'HoverPaddingValue', prefix: '$space.', foreign: '$colors.' },
];

function inconclusive(message, detail) {
  console.error(`token types: ${message}`);
  console.error('This run proves nothing about the token arm either way.');
  if (detail) console.error(detail);
  process.exit(EXIT_INCONCLUSIVE);
}

const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
if (configFile.error) {
  inconclusive(
    'the fixture tsconfig could not be read.',
    ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'),
  );
}

const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, fixtureDir);
if (parsed.errors.length > 0) {
  inconclusive(
    'the fixture tsconfig could not be parsed.',
    parsed.errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'),
  );
}

const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = [...program.getSemanticDiagnostics(), ...program.getSyntacticDiagnostics()];

if (diagnostics.length > 0) {
  // One compile failure here is not ambiguous: the permissive fixture writes
  // bad token paths at real call sites on purpose, so a rejection message
  // means strict mode became the default rather than staying opt-in.
  const leaked = diagnostics.some((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, ' ').includes('Not a path in the'),
  );
  if (leaked) {
    console.error(
      'token types: strict rejection reached a fixture that never opted in.\n' +
        '  Bad token paths must still compile unless `strictTokens` is set.',
    );
    process.exit(EXIT_MISSING_TOKENS);
  }

  const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => fixtureDir,
    getNewLine: () => '\n',
  });
  inconclusive('the fixture does not compile.', formatted);
}

const checker = program.getTypeChecker();
const usage = program.getSourceFile(path.join(fixtureDir, 'usage.ts'));
if (!usage) inconclusive('the fixture usage file is not in the program.');

/** Collect the string-literal members of a (possibly non-union) type. */
function literalMembers(type) {
  const parts = type.isUnion() ? type.types : [type];
  return parts.filter((t) => t.isStringLiteral()).map((t) => t.value);
}

const failures = [];
const report = [];

for (const { alias, prefix, foreign } of PROBES) {
  // Read the alias's own type node rather than the symbol. A symbol pulled
  // from `locals` resolves to `any` for a type alias, which would make every
  // probe silently pass.
  const declaration = usage.statements.find(
    (node) => ts.isTypeAliasDeclaration(node) && node.name.text === alias,
  );
  if (!declaration) {
    inconclusive(`the fixture no longer declares the type alias '${alias}'.`);
  }

  const type = checker.getTypeAtLocation(declaration.type);
  if (type.flags & ts.TypeFlags.Any) {
    inconclusive(`'${alias}' resolved to 'any', so nothing was actually read.`);
  }
  const literals = literalMembers(type);
  const own = literals.filter((v) => v.startsWith(prefix));
  const crossed = literals.filter((v) => v.startsWith(foreign));

  if (own.length === 0) {
    failures.push(
      `${alias} carries no '${prefix}' paths. Either the augmentation is not ` +
        `reaching StyleProps, or the prop lost its scale.`,
    );
  }
  if (crossed.length > 0) {
    failures.push(
      `${alias} carries ${crossed.length} '${foreign}' path(s) ` +
        `(${crossed.slice(0, 3).join(', ')}). Scales must stay separate.`,
    );
  }
  report.push(`  ${alias}: ${own.length} ${prefix}* path(s)`);
}

if (failures.length > 0) {
  console.error('token types: the token arm is missing or wrong.\n');
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    `\nThe fixture compiles either way, because '(string & {})' keeps every ` +
      `raw value assignable.\nThat is exactly why this check exists.`,
  );
  process.exit(EXIT_MISSING_TOKENS);
}

console.log('token types: the augmented theme reaches the style props.');
for (const line of report) console.log(line);

// The strict fixture is the other half of the contract. It opts into
// `strictTokens` and pairs every rejection case with `@ts-expect-error`, so a
// clean compile means every one of them was actually rejected, and a
// `TS2578: Unused '@ts-expect-error' directive` means strict mode stopped
// working. `boundary.tsx` records the cases strict mode deliberately does not
// reach, so a change in either direction shows up here.
const strictConfig = ts.readConfigFile(path.join(strictDir, 'tsconfig.json'), ts.sys.readFile);
if (strictConfig.error) {
  inconclusive(
    'the strict fixture tsconfig could not be read.',
    ts.flattenDiagnosticMessageText(strictConfig.error.messageText, '\n'),
  );
}

const strictParsed = ts.parseJsonConfigFileContent(strictConfig.config, ts.sys, strictDir);
const strictProgram = ts.createProgram(strictParsed.fileNames, strictParsed.options);
const strictDiagnostics = [
  ...strictProgram.getSemanticDiagnostics(),
  ...strictProgram.getSyntacticDiagnostics(),
];

if (strictDiagnostics.length > 0) {
  const unused = strictDiagnostics.filter((d) => d.code === 2578);
  console.error('\ntoken types: strict mode is not behaving as declared.\n');
  if (unused.length > 0) {
    console.error(
      `  - ${unused.length} '@ts-expect-error' directive(s) went unused, which means a ` +
        `bad token path was accepted where the fixture says it must be rejected.`,
    );
  }
  console.error(
    ts.formatDiagnosticsWithColorAndContext(strictDiagnostics, {
      getCanonicalFileName: (f) => f,
      getCurrentDirectory: () => strictDir,
      getNewLine: () => '\n',
    }),
  );
  process.exit(EXIT_MISSING_TOKENS);
}

console.log("token types: strict mode rejects paths outside a prop's scale.");
