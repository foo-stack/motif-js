import { transformSync } from '@babel/core';
import { describe, expect, it } from 'vitest';
import motifMetro from './index.js';

describe('@motif-js/compiler-metro', () => {
  it('returns a [plugin, options] tuple Babel can consume', () => {
    const tuple = motifMetro();
    expect(Array.isArray(tuple)).toBe(true);
    expect(tuple).toHaveLength(2);
    expect(typeof tuple[0]).toBe('function');
    expect(tuple[1]).toMatchObject({ target: 'native' });
  });

  it('hoists StyleSheet.create on native target', () => {
    const tuple = motifMetro();
    const result = transformSync(
      `import { Box } from '@motif-js/react-native';\nconst X = () => <Box p={4} />;\n`,
      {
        babelrc: false,
        configFile: false,
        filename: 'test.tsx',
        plugins: [tuple],
        parserOpts: { plugins: ['jsx', 'typescript'] },
        generatorOpts: { compact: false },
      },
    );
    const code = result?.code ?? '';
    expect(code).not.toMatch(/\bp=\{4\}/);
    expect(code).toContain('StyleSheet');
    expect(code).toContain('_motifStyles');
    expect(code).toContain('padding: 4');
    expect(code).toMatch(/style=\{_motifStyles\.id\d+\}/);
  });

  it('respects target override', () => {
    const tuple = motifMetro({ target: 'web' });
    const result = transformSync(
      `import { Box } from '@motif-js/react-web';\nconst X = () => <Box p={4} />;\n`,
      {
        babelrc: false,
        configFile: false,
        filename: 'test.tsx',
        plugins: [tuple],
        parserOpts: { plugins: ['jsx', 'typescript'] },
        generatorOpts: { compact: false },
      },
    );
    // With target=web, the static prop should be extracted.
    expect(result?.code).not.toMatch(/\bp=\{4\}/);
    expect(result?.code).toContain('padding: 4');
  });
});
