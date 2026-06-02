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

/**
 * Parse a line as a fence opener. Per CommonMark a fence is a run of 3+
 * identical backticks or tildes (indented up to 3 spaces), optionally
 * followed by an info string. The run length matters: a 4-backtick fence
 * exists precisely so the block can contain a ``` example. A backtick
 * info string may not itself contain a backtick (CommonMark), which keeps
 * a line that merely formats inline code from being read as an opener.
 *
 * Returns the fence character and run length, or `null` if not an opener.
 */
function parseFenceOpen(line: string): { char: '`' | '~'; len: number } | null {
  const m = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line.replace(/\r$/, ''));
  if (m === null) return null;
  const run = m[1]!;
  const char = run[0] as '`' | '~';
  if (char === '`' && m[2]!.includes('`')) return null;
  return { char, len: run.length };
}

/**
 * A closing fence is a line of at least as many of the *same* fence
 * character as the opener (indented up to 3 spaces), with nothing but
 * trailing whitespace after it.
 */
function isFenceClose(line: string, char: '`' | '~', len: number): boolean {
  return new RegExp(`^ {0,3}\\${char}{${len},}[ \\t]*$`).test(line.replace(/\r$/, ''));
}

/**
 * Apply `transform` only to the fenced code blocks of `source`, returning
 * the source with prose and inline code preserved verbatim. The whole
 * block (fence lines included) is handed to `transform`, matching the
 * behaviour of the single regex this replaced.
 *
 * A line scanner — not one regex — because the close must match the
 * opener's *length*. The old `` ```…``` `` regex stopped at the first
 * inner triple-backtick, so a 4-backtick block wrapping a ``` example had
 * its real code treated as prose (codemod under-applied) and the trailing
 * prose mis-bucketed. Same for longer tilde fences. An unterminated fence
 * runs to end-of-input, per CommonMark.
 */
export function applyWithinMarkdownCode(
  source: string,
  transform: (code: string) => string,
): string {
  const lines = source.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const open = parseFenceOpen(lines[i]!);
    if (open === null) {
      out.push(lines[i]!);
      i += 1;
      continue;
    }
    const block: string[] = [lines[i]!];
    i += 1;
    while (i < lines.length) {
      block.push(lines[i]!);
      const closed = isFenceClose(lines[i]!, open.char, open.len);
      i += 1;
      if (closed) break;
    }
    out.push(transform(block.join('\n')));
  }
  return out.join('\n');
}

/** True when the path is a Markdown / MDX document. */
export function isMarkdownPath(path: string): boolean {
  return /\.mdx?$/i.test(path);
}
