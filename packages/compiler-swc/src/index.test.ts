import { describe, expect, it } from 'vitest';
import motifExtract from './index.js';

describe('@usemotif/compiler-swc', () => {
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
      `import { Box } from '@usemotif/react';\nconst X = () => <Box p={4} />;\n`,
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

  // Regression: aggregated CSS was an append-only array on the (reused)
  // plugin instance, so re-transforming a module in watch mode appended
  // its CSS again and the virtual stylesheet grew with duplicates each
  // rebuild. Keyed by module id, a re-transform must overwrite, not append.
  it('does not duplicate a module CSS across rebuilds (watch mode)', async () => {
    type Hook = ((...a: unknown[]) => unknown) | { handler: (...a: unknown[]) => unknown };
    const fn = (h: Hook | undefined): ((...a: unknown[]) => unknown) => {
      if (h === undefined) throw new Error('hook missing');
      return typeof h === 'function' ? h : h.handler;
    };
    const raw = motifExtract.raw({}, { framework: 'rollup' }) as unknown as Record<string, Hook>;
    const ctx = { warn() {}, error() {} } as never;
    const code = `import { Box } from '@usemotif/react';\nconst X = () => <Box _hover={{ opacity: 0.5 }} />;\n`;
    const id = '/abs/card.tsx';

    // Initial build + one watch-mode rebuild of the same module.
    await fn(raw.transform).call(ctx, code, id);
    await fn(raw.transform).call(ctx, code, id);

    // Resolve + load the virtual module to obtain the placeholder sentinel.
    const resolvedId = fn(raw.resolveId).call(ctx, 'virtual:motif-extract.css') as string;
    const sentinel = fn(raw.load).call(ctx, resolvedId) as string;
    const bundle: Record<string, { type: 'asset'; fileName: string; source: string }> = {
      'styles.css': { type: 'asset', fileName: 'styles.css', source: sentinel },
    };
    fn(raw.generateBundle).call(ctx, {}, bundle);

    const out = bundle['styles.css']!.source;
    expect(out).toContain(':hover');
    // The pseudo rule must appear exactly once despite two transforms.
    expect(out.split(':hover').length - 1).toBe(1);
  });
});
