import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

const DIRECTIVE = "'use client';\n";

/**
 * Prepend `'use client'` to the bundled output. Every component here is
 * interactive, so the whole bundle is a client reference; without the
 * directive in `dist`, importing this package from a React Server
 * Component fails at build time even though the source files carry it.
 *
 * Only the barrel needs it. `package.json` exports a single `"."` entry,
 * so the barrel is the only module a consumer can address, and the
 * directive it carries covers everything reached through it.
 *
 * tsup's `banner` option is stripped by esbuild's treeshake when the
 * banner is a free string expression, so we prepend post-build.
 */
async function prependUseClient(): Promise<void> {
  for (const file of ['dist/index.js', 'dist/index.cjs']) {
    const content = await readFile(file, 'utf8');
    if (!content.startsWith(DIRECTIVE)) {
      await writeFile(file, DIRECTIVE + content);
    }
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // tsup's dts pipeline trips TS 6's deprecated-`baseUrl` warning. Scope the
  // ignoreDeprecations escape hatch to dts-only so the project's tsconfig
  // stays strict for IDE / typecheck.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  clean: true,
  treeshake: true,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  onSuccess: prependUseClient,
});
