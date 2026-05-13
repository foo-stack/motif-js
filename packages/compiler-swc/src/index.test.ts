import { describe, expect, it } from 'vitest';
import motifExtract from './index.js';

describe('@motif-js/compiler-swc', () => {
  it('exposes vite / rollup / webpack / esbuild / rspack / farm builders', () => {
    expect(typeof motifExtract.vite).toBe('function');
    expect(typeof motifExtract.rollup).toBe('function');
    expect(typeof motifExtract.webpack).toBe('function');
    expect(typeof motifExtract.esbuild).toBe('function');
    expect(typeof motifExtract.rspack).toBe('function');
    expect(typeof motifExtract.farm).toBe('function');
  });

  it('vite plugin runs the babel transform on .tsx files', async () => {
    const captured: string[] = [];
    const plugin = motifExtract.vite({
      onCss: (css) => captured.push(css),
    });
    const inst = Array.isArray(plugin) ? plugin[0]! : plugin;

    const transform =
      typeof inst.transform === 'function'
        ? inst.transform
        : (inst.transform as { handler: (code: string, id: string) => unknown }).handler;

    const result = await transform.call(
      { warn() {}, error() {} } as unknown as ThisParameterType<typeof transform>,
      `import { Box } from '@motif-js/react';\nconst X = () => <Box p={4} />;\n`,
      '/abs/path/file.tsx',
    );
    const code = (result as { code: string }).code;
    expect(code).toContain('padding: 4');
    expect(code).not.toMatch(/\bp=\{4\}/);
  });

  it('skips files outside include / inside exclude', async () => {
    const plugin = motifExtract.vite();
    const inst = Array.isArray(plugin) ? plugin[0]! : plugin;
    const include =
      typeof inst.transform === 'object' && inst.transform !== null
        ? (inst.transform as { filter: { id: { include: unknown } } }).filter
        : undefined;
    // unplugin v3 surfaces include via filter; we can't easily probe it
    // without plumbing through the bundler. Verify behaviour via
    // transformInclude on the unplugin instance's raw factory output:
    const raw = motifExtract.raw({}, { framework: 'vite' });
    expect(typeof raw.transformInclude).toBe('function');
    expect(raw.transformInclude!.call({} as never, '/x/file.tsx')).toBe(true);
    expect(raw.transformInclude!.call({} as never, '/x/file.css')).toBe(false);
    expect(raw.transformInclude!.call({} as never, '/x/node_modules/y/z.tsx')).toBe(false);
    void include;
  });
});
