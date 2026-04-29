import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      // RN ships Flow-syntax JS that vitest's parser can't read. The
      // `@motif-js/react-native` package already maintains a jsdom-
      // compatible mock for its own tests; we reuse it here so any
      // headless `*.native.test.tsx` file can import RN primitives
      // (Modal / Pressable / View) and have them render as DOM hosts.
      // Web tests don't import `react-native`, so this alias is
      // inert for them.
      'react-native': fileURLToPath(
        new URL('../react-native/src/__test-setup__/react-native-mock.tsx', import.meta.url),
      ),
    },
  },
  test: {
    name: '@motif-js/headless',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
