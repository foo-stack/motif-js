import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/compiler-core',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
