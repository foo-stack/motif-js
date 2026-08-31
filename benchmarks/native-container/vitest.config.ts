import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    name: '@motif-js-bench/native-container',
    environment: 'jsdom',
    include: ['src/**/*.bench.ts', 'src/**/*.bench.tsx'],
  },
  resolve: {
    alias: {
      // The real `react-native` ships Flow-syntax JS that vitest's
      // parser rejects. Redirect to the same shim the unit-test suite
      // uses - we don't actually exercise the native runtime, we just
      // need View / onLayout / Dimensions / StyleSheet for the polyfill.
      'react-native': fileURLToPath(
        new URL('./src/__test-setup__/react-native-mock.tsx', import.meta.url),
      ),
    },
  },
});
