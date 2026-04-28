import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/headless',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
