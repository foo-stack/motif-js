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
    const md = 'Install `npm i @motif-js/react` — note @motif-js/react is the old name.';
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    // Inline code is preserved (safer default — avoids corrupting prose
    // that documents the old name). The whole string is unchanged.
    expect(out).toBe(md);
  });

  it('rewrites only inside the fence when prose and a fence both mention the name', () => {
    const md = '`@motif-js/core` (inline, kept)\n\n```\nimport "@motif-js/core";\n```';
    const out = applyWithinMarkdownCode(md, applyRenameV3);
    expect(out).toContain('`@motif-js/core` (inline, kept)');
    expect(out).toContain('import "@usemotif/core";');
  });
});
