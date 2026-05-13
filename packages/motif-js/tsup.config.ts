import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

const DIRECTIVE = "'use client';\n";

/** Prepend `'use client'` to the web output only. RSC is web-specific,
 * so the native entries (`dist/index.native.{js,cjs}`) stay clean. tsup's
 * `banner` option is stripped by esbuild's treeshake, hence post-process. */
async function prependUseClient(): Promise<void> {
  for (const file of ['dist/index.js', 'dist/index.cjs']) {
    const content = await readFile(file, 'utf8');
    if (!content.startsWith(DIRECTIVE)) {
      await writeFile(file, DIRECTIVE + content);
    }
  }
}

export default defineConfig({
  entry: ['src/index.ts', 'src/index.native.ts'],
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
