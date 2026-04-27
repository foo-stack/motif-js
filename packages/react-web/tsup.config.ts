import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

const DIRECTIVE = "'use client';\n";

/**
 * Prepend `'use client'` to the bundled output. Marks the whole bundle
 * as a client reference so Next App Router treats every export
 * accordingly — they still SSR (client components render server-side as
 * part of the SSR pass), just no longer count as pure RSC. Practical
 * norm for runtime CSS-in-JS (Tamagui / Mantine / Chakra all do this);
 * future per-entry splitting could relax this for the hookless
 * primitives (Box / Stack / Text / Container).
 *
 * tsup's `banner` option is stripped by esbuild's treeshake when the
 * banner is a free string expression, so we prepend post-build.
 */
async function prependUseClient(): Promise<void> {
  // Only the main entry needs 'use client'; the server entry runs on
  // Node and must not be marked as a client reference.
  for (const file of ['dist/index.js', 'dist/index.cjs']) {
    const content = await readFile(file, 'utf8');
    if (!content.startsWith(DIRECTIVE)) {
      await writeFile(file, DIRECTIVE + content);
    }
  }
}

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
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
