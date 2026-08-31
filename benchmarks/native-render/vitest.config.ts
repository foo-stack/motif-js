import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    name: '@motif-js-bench/native-render',
    environment: 'jsdom',
    include: ['src/**/*.bench.ts', 'src/**/*.bench.tsx'],
  },
  resolve: {
    alias: {
      // The real `react-native` ships Flow-syntax JS that vitest's
      // parser rejects. Reuse the canonical jsdom-compatible mock
      // from `@usemotif/react-native` - same alias that headless +
      // native-container benches use, so behaviour stays consistent
      // across the workspace.
      'react-native': fileURLToPath(
        new URL(
          '../../packages/react-native/src/__test-setup__/react-native-mock.tsx',
          import.meta.url,
        ),
      ),
    },
  },
});
