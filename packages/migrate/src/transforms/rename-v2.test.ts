import { describe, expect, it } from 'vitest';
import { applyRenameV2, hasV2Specifier, needsRenameV2 } from './rename-v2.js';

describe('applyRenameV2', () => {
  it('rewrites a named import from @motif-js/react-web to @motif-js/react', () => {
    expect(applyRenameV2(`import { Box } from '@motif-js/react-web';`)).toBe(
      `import { Box } from '@motif-js/react';`,
    );
  });

  it('rewrites a named import from @motif-js/react (v1 aggregator) to usemotif', () => {
    expect(applyRenameV2(`import { Box } from '@motif-js/react';`)).toBe(
      `import { Box } from 'usemotif';`,
    );
  });

  it('leaves @motif-js/react-native untouched', () => {
    expect(applyRenameV2(`import { Box } from '@motif-js/react-native';`)).toBe(
      `import { Box } from '@motif-js/react-native';`,
    );
  });

  it('leaves @motif-js/react/server (subpath) untouched', () => {
    expect(applyRenameV2(`import '@motif-js/react/server';`)).toBe(
      `import '@motif-js/react/server';`,
    );
  });

  it('rewrites @motif-js/react-web/server to @motif-js/react/server', () => {
    expect(applyRenameV2(`import '@motif-js/react-web/server';`)).toBe(
      `import '@motif-js/react/server';`,
    );
  });

  it('handles both renames in the same file in one pass', () => {
    const src = [
      `import { Box } from '@motif-js/react-web';`,
      `import { Portal } from '@motif-js/react';`,
      `import '@motif-js/react-web/server';`,
    ].join('\n');
    const expected = [
      `import { Box } from '@motif-js/react';`,
      `import { Portal } from 'usemotif';`,
      `import '@motif-js/react/server';`,
    ].join('\n');
    expect(applyRenameV2(src)).toBe(expected);
  });

  it('handles double-quoted imports', () => {
    expect(applyRenameV2(`import { Box } from "@motif-js/react-web";`)).toBe(
      `import { Box } from "@motif-js/react";`,
    );
  });

  it('handles dynamic import() calls', () => {
    expect(applyRenameV2(`await import('@motif-js/react-web/server');`)).toBe(
      `await import('@motif-js/react/server');`,
    );
  });

  it('handles CommonJS require() calls', () => {
    expect(applyRenameV2(`const { Box } = require('@motif-js/react-web');`)).toBe(
      `const { Box } = require('@motif-js/react');`,
    );
  });

  it('handles type-only imports', () => {
    expect(applyRenameV2(`import type { BoxProps } from '@motif-js/react';`)).toBe(
      `import type { BoxProps } from 'usemotif';`,
    );
  });

  it('handles aliased named imports', () => {
    expect(applyRenameV2(`import { Box as MotifBox } from '@motif-js/react-web';`)).toBe(
      `import { Box as MotifBox } from '@motif-js/react';`,
    );
  });

  it('handles multi-line imports', () => {
    const src = `import {\n  Box,\n  Stack,\n} from '@motif-js/react-web';`;
    const expected = `import {\n  Box,\n  Stack,\n} from '@motif-js/react';`;
    expect(applyRenameV2(src)).toBe(expected);
  });

  it('rewrites package.json dependency keys', () => {
    const src = JSON.stringify(
      {
        dependencies: {
          '@motif-js/react-web': 'workspace:*',
          '@motif-js/react': 'workspace:*',
          '@motif-js/react-native': 'workspace:*',
        },
      },
      null,
      2,
    );
    const out = applyRenameV2(src);
    const parsed = JSON.parse(out) as { dependencies: Record<string, string> };
    expect(parsed.dependencies).toEqual({
      '@motif-js/react': 'workspace:*',
      usemotif: 'workspace:*',
      '@motif-js/react-native': 'workspace:*',
    });
  });

  it('leaves unrelated packages alone', () => {
    const src = [
      `import { useState } from 'react';`,
      `import { render } from 'react-dom';`,
      `import { reactify } from 'some-other-lib';`,
      `import './styles/react.css';`,
    ].join('\n');
    expect(applyRenameV2(src)).toBe(src);
  });

  it('matches inside markdown / mdx code fences', () => {
    const src = [
      '## Install',
      '',
      '```sh',
      'yarn add @motif-js/react',
      '```',
      '',
      '```tsx',
      `import { Box } from '@motif-js/react';`,
      '```',
    ].join('\n');
    const out = applyRenameV2(src);
    expect(out).toContain('yarn add usemotif');
    expect(out).toContain(`import { Box } from 'usemotif';`);
  });
});

// #276 - a second run must not corrupt imports the first run produced.
// react-web → @motif-js/react lands on a name the bare-react rule would
// otherwise promote to `usemotif`; the already-v2 guard prevents that.
describe('applyRenameV2 - idempotency', () => {
  it('is a no-op on its own output for a file mixing aggregator + DOM imports', () => {
    const src = [
      `import { Box } from '@motif-js/react-web';`,
      `import { Portal } from '@motif-js/react';`,
      `import '@motif-js/react-web/server';`,
    ].join('\n');
    const once = applyRenameV2(src);
    // First pass produced the v2 names, including a `usemotif` import.
    expect(once).toContain(`from '@motif-js/react';`);
    expect(once).toContain(`from 'usemotif';`);
    // Second pass leaves the v2 DOM-bindings import alone - no corruption
    // into the meta package.
    const twice = applyRenameV2(once);
    expect(twice).toBe(once);
  });

  it('leaves bare @motif-js/react alone when the file already imports usemotif', () => {
    const src = [
      `import { Box } from '@motif-js/react';`,
      `import { Stack } from 'usemotif';`,
    ].join('\n');
    // The `usemotif` import marks this as already-v2, so the bare
    // @motif-js/react is the v2 DOM-bindings package, not the v1 aggregator.
    expect(applyRenameV2(src)).toBe(src);
  });

  it('leaves bare @motif-js/react alone when the file already imports @usemotif/* (v3)', () => {
    const src = [
      `import { Box } from '@motif-js/react';`,
      `import { tokens } from '@usemotif/core';`,
    ].join('\n');
    expect(applyRenameV2(src)).toBe(src);
  });

  it('an explicit alreadyV2=true suppresses the aggregator promotion', () => {
    const src = `import { Box } from '@motif-js/react';`;
    expect(applyRenameV2(src, true)).toBe(src);
    expect(applyRenameV2(src, false)).toBe(`import { Box } from 'usemotif';`);
  });

  it('still rewrites react-web → @motif-js/react even when alreadyV2 is true', () => {
    const src = `import { Box } from '@motif-js/react-web';`;
    expect(applyRenameV2(src, true)).toBe(`import { Box } from '@motif-js/react';`);
  });

  it('a prose mention of usemotif.dev does not suppress a first-run rewrite', () => {
    const src = [`// docs live at usemotif.dev`, `import { Box } from '@motif-js/react';`].join(
      '\n',
    );
    expect(applyRenameV2(src)).toBe(
      [`// docs live at usemotif.dev`, `import { Box } from 'usemotif';`].join('\n'),
    );
  });
});

describe('hasV2Specifier', () => {
  it('detects quoted unscoped + scoped v2/v3 specifiers', () => {
    expect(hasV2Specifier(`import 'usemotif';`)).toBe(true);
    expect(hasV2Specifier(`import "usemotif/server";`)).toBe(true);
    expect(hasV2Specifier(`import '@usemotif/react';`)).toBe(true);
    expect(hasV2Specifier(`"usemotif": "workspace:*"`)).toBe(true);
  });

  it('does not fire on prose or v1-only specifiers', () => {
    expect(hasV2Specifier(`// see usemotif.dev for docs`)).toBe(false);
    expect(hasV2Specifier(`import '@motif-js/react';`)).toBe(false);
    expect(hasV2Specifier(`import '@motif-js/react-web';`)).toBe(false);
  });
});

describe('needsRenameV2', () => {
  it('returns true for files containing v1 specifiers', () => {
    expect(needsRenameV2(`import { Box } from '@motif-js/react-web';`)).toBe(true);
    expect(needsRenameV2(`import { Box } from '@motif-js/react';`)).toBe(true);
  });

  it('returns false for files with only v2 / unrelated specifiers', () => {
    expect(needsRenameV2(`import { Box } from 'usemotif';`)).toBe(false);
    expect(needsRenameV2(`import { Box } from '@motif-js/react-native';`)).toBe(false);
    expect(needsRenameV2(`import { Box } from '@motif-js/react/server';`)).toBe(false);
    expect(needsRenameV2(`import { useState } from 'react';`)).toBe(false);
  });

  it('does NOT mutate its own regex (.lastIndex) across calls', () => {
    const src = `import { Box } from '@motif-js/react-web';`;
    expect(needsRenameV2(src)).toBe(true);
    expect(needsRenameV2(src)).toBe(true);
    expect(needsRenameV2(src)).toBe(true);
  });
});
