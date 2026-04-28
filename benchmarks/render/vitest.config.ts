import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js-bench/render',
    environment: 'jsdom',
    include: ['src/**/*.bench.ts', 'src/**/*.bench.tsx'],
  },
});
