import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/migrate',
    include: ['src/**/*.test.ts'],
  },
});
