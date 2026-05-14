import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      // RN ships Flow-syntax JS that vitest's parser can't read. Tests
      // don't exercise the real RN runtime — they only render to JSON
      // via react-test-renderer — so we redirect the import to a
      // minimal shim that exposes View / Text / StyleSheet.
      'react-native': fileURLToPath(
        new URL('./src/__test-setup__/react-native-mock.tsx', import.meta.url),
      ),
    },
  },
  test: {
    name: '@usemotif/react-native',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
