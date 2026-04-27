import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/tokens',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
