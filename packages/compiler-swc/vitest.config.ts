import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/compiler-swc',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
