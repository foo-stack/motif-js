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

  it('runs as a babel plugin and is a no-op for native target on a Box', () => {
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
    // Native target with Box from react-native — for now the babel
    // plugin's native path is a no-op (StyleSheet.create hoisting is
    // a future enhancement). Verify the file passes through unmodified
    // (props still on JSX).
    expect(result?.code).toContain('p={4}');
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
