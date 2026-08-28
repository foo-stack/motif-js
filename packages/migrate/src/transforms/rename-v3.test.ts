import { describe, expect, it } from 'vitest';
import { applyRenameV3, needsRenameV3 } from './rename-v3.js';

describe('applyRenameV3', () => {
  it('rewrites @motif-js/react-web (v1 DOM bindings) to @usemotif/react', () => {
    expect(applyRenameV3(`import { Box } from '@motif-js/react-web';`)).toBe(
      `import { Box } from '@usemotif/react';`,
    );
  });

  it('rewrites @motif-js/react (v1 aggregator or v2 DOM) to @usemotif/react', () => {
    expect(applyRenameV3(`import { Box } from '@motif-js/react';`)).toBe(
      `import { Box } from '@usemotif/react';`,
    );
  });

  it('rewrites @motif-js/react-native to @usemotif/react-native', () => {
    expect(applyRenameV3(`import { Box } from '@motif-js/react-native';`)).toBe(
      `import { Box } from '@usemotif/react-native';`,
    );
  });

  it('redirects @motif-js/compiler-swc onto @usemotif/compiler-web', () => {
    // The bundler plugin outlived its name: `compiler-swc` was an alias
    // for `compiler-web` until it was removed. A plain scope swap would
    // land the caller on a package that no longer receives releases.
    expect(applyRenameV3(`import motif from '@motif-js/compiler-swc';`)).toBe(
      `import motif from '@usemotif/compiler-web';`,
    );
  });

  it('redirects a @motif-js/compiler-swc package.json dependency key', () => {
    const src = JSON.stringify(
      { devDependencies: { '@motif-js/compiler-swc': '^2.0.0' } },
      null,
      2,
    );
    const parsed = JSON.parse(applyRenameV3(src)) as {
      devDependencies: Record<string, string>;
    };
    expect(parsed.devDependencies['@usemotif/compiler-web']).toBe('^2.0.0');
    expect('@motif-js/compiler-swc' in parsed.devDependencies).toBe(false);
  });

  it('rewrites every other @motif-js/<name> to @usemotif/<name>', () => {
    const src = [
      `import { createTheme } from '@motif-js/core';`,
      `import { useTheme } from '@motif-js/headless';`,
      `import { Icon } from '@motif-js/icons';`,
      `import '@motif-js/reset/auto';`,
      `import { lightTokens } from '@motif-js/tokens';`,
      `import { renderWithMotif } from '@motif-js/test-utils';`,
      `import { findMotifBindings } from '@motif-js/compiler-core';`,
      `import motifBabelPlugin from '@motif-js/compiler-babel';`,
      `import motifMetroPlugin from '@motif-js/compiler-metro';`,
      `import { applyRenameV2 } from '@motif-js/migrate';`,
    ].join('\n');
    const expected = [
      `import { createTheme } from '@usemotif/core';`,
      `import { useTheme } from '@usemotif/headless';`,
      `import { Icon } from '@usemotif/icons';`,
      `import '@usemotif/reset/auto';`,
      `import { lightTokens } from '@usemotif/tokens';`,
      `import { renderWithMotif } from '@usemotif/test-utils';`,
      `import { findMotifBindings } from '@usemotif/compiler-core';`,
      `import motifBabelPlugin from '@usemotif/compiler-babel';`,
      `import motifMetroPlugin from '@usemotif/compiler-metro';`,
      `import { applyRenameV2 } from '@usemotif/migrate';`,
    ].join('\n');
    expect(applyRenameV3(src)).toBe(expected);
  });

  it('leaves usemotif (the meta package) untouched', () => {
    expect(applyRenameV3(`import { Box } from 'usemotif';`)).toBe(
      `import { Box } from 'usemotif';`,
    );
  });

  it('leaves @usemotif/* (already on v3) untouched', () => {
    const src = [
      `import { Box } from '@usemotif/react';`,
      `import { Box } from '@usemotif/react-native';`,
      `import { createTheme } from '@usemotif/core';`,
    ].join('\n');
    expect(applyRenameV3(src)).toBe(src);
  });

  it('preserves @motif-js/react subpath imports under @usemotif/react', () => {
    expect(applyRenameV3(`import '@motif-js/react/server';`)).toBe(
      `import '@usemotif/react/server';`,
    );
    expect(
      applyRenameV3(`import { TanstackVirtual } from '@motif-js/react/tanstack-virtual';`),
    ).toBe(`import { TanstackVirtual } from '@usemotif/react/tanstack-virtual';`);
  });

  it('rewrites @motif-js/react-web subpath imports onto @usemotif/react', () => {
    expect(applyRenameV3(`import '@motif-js/react-web/server';`)).toBe(
      `import '@usemotif/react/server';`,
    );
  });

  it('handles double-quoted imports', () => {
    expect(applyRenameV3(`import { Box } from "@motif-js/react";`)).toBe(
      `import { Box } from "@usemotif/react";`,
    );
  });

  it('handles dynamic import() calls', () => {
    expect(applyRenameV3(`await import('@motif-js/react/server');`)).toBe(
      `await import('@usemotif/react/server');`,
    );
  });

  it('handles CommonJS require() calls', () => {
    expect(applyRenameV3(`const { Box } = require('@motif-js/react');`)).toBe(
      `const { Box } = require('@usemotif/react');`,
    );
  });

  it('handles type-only imports', () => {
    expect(applyRenameV3(`import type { BoxProps } from '@motif-js/react';`)).toBe(
      `import type { BoxProps } from '@usemotif/react';`,
    );
  });

  it('handles aliased named imports', () => {
    expect(applyRenameV3(`import { Box as MotifBox } from '@motif-js/react-web';`)).toBe(
      `import { Box as MotifBox } from '@usemotif/react';`,
    );
  });

  it('handles namespace imports', () => {
    expect(applyRenameV3(`import * as Motif from '@motif-js/react';`)).toBe(
      `import * as Motif from '@usemotif/react';`,
    );
  });

  it('handles multi-line imports', () => {
    const src = `import {\n  Box,\n  Stack,\n} from '@motif-js/react';`;
    const expected = `import {\n  Box,\n  Stack,\n} from '@usemotif/react';`;
    expect(applyRenameV3(src)).toBe(expected);
  });

  it('handles re-exports', () => {
    expect(applyRenameV3(`export { Box } from '@motif-js/react';`)).toBe(
      `export { Box } from '@usemotif/react';`,
    );
  });

  it('rewrites package.json dependency keys (v1 + v2)', () => {
    const src = JSON.stringify(
      {
        dependencies: {
          '@motif-js/react-web': 'workspace:*',
          '@motif-js/react': 'workspace:*',
          '@motif-js/react-native': 'workspace:*',
          '@motif-js/core': 'workspace:*',
          usemotif: 'workspace:*',
        },
      },
      null,
      2,
    );
    const out = applyRenameV3(src);
    const parsed = JSON.parse(out) as { dependencies: Record<string, string> };
    // Both '@motif-js/react-web' and '@motif-js/react' collapse onto
    // '@usemotif/react' (the renamed DOM bindings). Last-write-wins in
    // a plain object — the JSON parser keeps the latest entry, which
    // is fine since the value (workspace:*) is the same in all cases.
    expect(parsed.dependencies['@usemotif/react']).toBe('workspace:*');
    expect(parsed.dependencies['@usemotif/react-native']).toBe('workspace:*');
    expect(parsed.dependencies['@usemotif/core']).toBe('workspace:*');
    expect(parsed.dependencies.usemotif).toBe('workspace:*');
    expect('@motif-js/react' in parsed.dependencies).toBe(false);
    expect('@motif-js/react-web' in parsed.dependencies).toBe(false);
  });

  it('leaves unrelated packages alone', () => {
    const src = [
      `import { useState } from 'react';`,
      `import { render } from 'react-dom';`,
      `import { reactify } from 'some-other-lib';`,
      `import './styles/react.css';`,
    ].join('\n');
    expect(applyRenameV3(src)).toBe(src);
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
    const out = applyRenameV3(src);
    expect(out).toContain('yarn add @usemotif/react');
    expect(out).toContain(`import { Box } from '@usemotif/react';`);
  });
});

describe('needsRenameV3', () => {
  it('returns true for files containing v1 or v2 specifiers', () => {
    expect(needsRenameV3(`import { Box } from '@motif-js/react-web';`)).toBe(true);
    expect(needsRenameV3(`import { Box } from '@motif-js/react';`)).toBe(true);
    expect(needsRenameV3(`import { Box } from '@motif-js/react-native';`)).toBe(true);
    expect(needsRenameV3(`import { createTheme } from '@motif-js/core';`)).toBe(true);
  });

  it('returns false for files already on v3 or with only unrelated specifiers', () => {
    expect(needsRenameV3(`import { Box } from 'usemotif';`)).toBe(false);
    expect(needsRenameV3(`import { Box } from '@usemotif/react';`)).toBe(false);
    expect(needsRenameV3(`import { Box } from '@usemotif/react-native';`)).toBe(false);
    expect(needsRenameV3(`import { useState } from 'react';`)).toBe(false);
  });

  it('does NOT mutate its own regex (.lastIndex) across calls', () => {
    const src = `import { Box } from '@motif-js/react';`;
    expect(needsRenameV3(src)).toBe(true);
    expect(needsRenameV3(src)).toBe(true);
    expect(needsRenameV3(src)).toBe(true);
  });
});
