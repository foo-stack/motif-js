import { describe, expect, it } from 'vitest';
import { applyWithinMarkdownCode, isMarkdownPath } from './markdown.js';
import { applyRenameV3 } from './transforms/rename-v3.js';

describe('isMarkdownPath', () => {
  it('matches .md and .mdx (case-insensitive), not source/json', () => {
    expect(isMarkdownPath('docs/guide.md')).toBe(true);
    expect(isMarkdownPath('docs/guide.MDX')).toBe(true);
    expect(isMarkdownPath('src/index.ts')).toBe(false);
    expect(isMarkdownPath('package.json')).toBe(false);
  });
});

describe('applyWithinMarkdownCode', () => {
  // Regression (#110): rename codemods rewrote prose mentions of old
  // specifiers in .md/.mdx, corrupting changelogs / migration notes.
  it('rewrites fenced code blocks but leaves prose untouched', () => {
    const md = [
      '# Migration',
      '',
      'We renamed `@motif-js/react` to the new scope. The old',
      '@motif-js/react package is gone.',
      '',
      '```ts',
      "import { Box } from '@motif-js/react';",
      '```',
      '',
      'See the @motif-js/core changelog for details.',
    ].join('\n');

    const out = applyWithinMarkdownCode(md, applyRenameV3);

    // Fenced code IS rewritten.
    expect(out).toContain("import { Box } from '@usemotif/react';");
    // Prose (including the inline-code mention which documents the OLD name)
    // is preserved verbatim.
    expect(out).toContain('We renamed `@motif-js/react` to the new scope.');
    expect(out).toContain('@motif-js/react package is gone.');
    expect(out).toContain('See the @motif-js/core changelog for details.');
  });

  it('leaves inline code untouched (it is often a name in prose, not a snippet)', () => {
    const md = 'Install `npm i @motif-js/react` - note @motif-js/react is the old name.';
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    // Inline code is preserved (safer default - avoids corrupting prose
    // that documents the old name). The whole string is unchanged.
    expect(out).toBe(md);
  });

  it('rewrites only inside the fence when prose and a fence both mention the name', () => {
    const md = '`@motif-js/core` (inline, kept)\n\n```\nimport "@motif-js/core";\n```';
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    expect(out).toContain('`@motif-js/core` (inline, kept)');
    expect(out).toContain('import "@usemotif/core";');
  });

  // #179 - a 4-backtick fence exists so the block can *contain* a triple
  // backtick. The old regex stopped at the first inner ``` , leaving the
  // real code unrewritten and mis-bucketing the trailing prose.
  it('rewrites a 4-backtick fence that wraps a triple-backtick example', () => {
    const md = [
      '````md',
      'Example:',
      '```ts',
      "import { Box } from '@motif-js/react';",
      '```',
      '````',
      '',
      'Trailing prose mentions @motif-js/core and must stay.',
    ].join('\n');
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    // The code inside the 4-backtick block is rewritten...
    expect(out).toContain("import { Box } from '@usemotif/react';");
    // ...and the inner ``` did not prematurely end the block, so the trailing
    // prose stays prose (untouched).
    expect(out).toContain('Trailing prose mentions @motif-js/core and must stay.');
  });

  it('does not treat a shorter inner run as the closing fence (tilde)', () => {
    const md = [
      '~~~~',
      "import '@motif-js/react';",
      '~~~',
      "still '@motif-js/core' code",
      '~~~~',
    ].join('\n');
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    expect(out).toContain("import '@usemotif/react';");
    // The 3-tilde line is inside the 4-tilde block, so code after it is
    // still code and gets rewritten too.
    expect(out).toContain("still '@usemotif/core' code");
  });

  it('treats an unterminated fence as code to end-of-input (CommonMark)', () => {
    const md = ['```ts', "import '@motif-js/react';"].join('\n');
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    expect(out).toContain("import '@usemotif/react';");
  });
});
