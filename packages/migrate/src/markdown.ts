/**
 * Markdown-aware codemod scoping.
 *
 * The rename transforms operate on raw text, which is correct for source
 * and JSON files. But in `.md` / `.mdx` docs a bare mention of an old
 * package specifier in *prose* (e.g. "we renamed `@motif-js/react` to …",
 * or a changelog entry recording the historical name) should NOT be
 * rewritten — only the actual code in fenced blocks and inline-code spans
 * should change. Rewriting prose silently corrupts historical docs.
 *
 * {@link applyWithinMarkdownCode} runs the given transform only inside
 * fenced code blocks and leaves everything else untouched.
 *
 * Only **fenced** blocks (```` ``` ````/`~~~`) are rewritten — not inline
 * code spans. Inline code is routinely used to format a *name* in prose
 * ("we renamed `@motif-js/react` to …"), so rewriting it would corrupt
 * exactly the historical changelog/migration notes this scoping protects.
 * Fenced blocks are unambiguous copy-paste snippets, so updating them is
 * safe. (An old install command written in *inline* code is left for the
 * author to update by hand — preserving prose is the safer default.)
 */

// A fenced code block opened by ``` or ~~~ (non-greedy to the matching
// closing fence). Inline spans are intentionally excluded — see above.
const FENCED_CODE_BLOCK = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;

/**
 * Apply `transform` only to the fenced code blocks of `source`, returning
 * the source with prose and inline code preserved verbatim.
 */
export function applyWithinMarkdownCode(
  source: string,
  transform: (code: string) => string,
): string {
  return source.replace(FENCED_CODE_BLOCK, (codeRegion) => transform(codeRegion));
}

/** True when the path is a Markdown / MDX document. */
export function isMarkdownPath(path: string): boolean {
  return /\.mdx?$/i.test(path);
}
