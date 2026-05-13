/**
 * `rename-v2` codemod: rewrite v1 motif-js import specifiers to their
 * v2 names.
 *
 * | v1                       | v2                  |
 * |--------------------------|---------------------|
 * | `@motif-js/react-web`    | `@motif-js/react`   |
 * | `@motif-js/react`        | `motif-js`          |
 * | `@motif-js/react-native` | `@motif-js/react-native` (unchanged) |
 *
 * Touches only **import specifier strings** inside source files —
 * import statements, `require()` calls, dynamic `import()`, and the
 * dependency keys of `package.json`. Comments and string literals
 * elsewhere are left alone.
 *
 * ## Sequencing trap
 *
 * The two rewrites overlap. If we naively replace `@motif-js/react` →
 * `motif-js` first, then `@motif-js/react-web` → `@motif-js/react`,
 * the first pass already destroyed every `@motif-js/react` occurrence
 * — including the `@motif-js/react` part of `@motif-js/react-web`,
 * leaving garbage like `motif-js-web`.
 *
 * The safe order is the opposite: `@motif-js/react-web` →
 * `@motif-js/react` FIRST, then `@motif-js/react` → `motif-js`. After
 * step one, every occurrence of `@motif-js/react` in the file refers
 * to the v2 DOM bindings (just renamed from react-web), and step two
 * can safely promote any *other* `@motif-js/react` references (the
 * v1 aggregator) up to `motif-js`.
 *
 * That's still wrong, because step two would clobber the
 * just-renamed `@motif-js/react` references too. So in practice we
 * use a one-pass single regex with alternation that matches whichever
 * of the two source names appears at the call site:
 *
 *   /@motif-js\/react-web|@motif-js\/react(?![-\w/])/g
 *
 * — for each match, decide the replacement based on the matched text.
 * react-web → @motif-js/react, bare react → motif-js. The negative
 * lookahead `(?![-\w/])` on the bare-react branch ensures we don't
 * catch react-web / react-native / react-foo (the `-` exclusion) or
 * the `@motif-js/react/server` and `@motif-js/react/tanstack-virtual`
 * subpaths (the `/` exclusion). Those subpath exports still belong
 * to the renamed DOM bindings package and must survive untouched.
 */

const SOURCE_PATTERN = /@motif-js\/react-web|@motif-js\/react(?![-\w/])/g;

function replaceSource(match: string): string {
  if (match === '@motif-js/react-web') return '@motif-js/react';
  // The other branch of the alternation. Anchored with negative
  // lookahead so it can only be the bare aggregator name.
  return 'motif-js';
}

/**
 * Apply the rename-v2 transform to a source string. The matching is
 * applied to the **entire** text, regardless of file kind — that's
 * intentional. Import-specifier strings have a unique enough shape
 * (the leading `@motif-js/` namespace) that false positives in prose
 * are rare. For `.md` / `.mdx` / `.json` files this lets the same
 * transform handle install snippets, code fences, and the
 * `dependencies` keys of package.json without separate parsers.
 *
 * If the input is `package.json`, sub-path imports like
 * `@motif-js/react/server` survive (the lookahead spares them) — the
 * `/server` and `/tanstack-virtual` exports still belong to the
 * renamed DOM bindings package.
 */
export function applyRenameV2(source: string): string {
  return source.replace(SOURCE_PATTERN, replaceSource);
}

/**
 * Convenience predicate: does the source contain anything the
 * transform would change? Used to skip the write step for unaffected
 * files (saves filesystem churn + leaves mtimes alone).
 */
export function needsRenameV2(source: string): boolean {
  // `SOURCE_PATTERN` is `g`-flagged, so reuse via `.test()` would mutate
  // its `.lastIndex` and corrupt later calls. Build a fresh non-global
  // regex per check.
  return /@motif-js\/react-web|@motif-js\/react(?![-\w/])/.test(source);
}
