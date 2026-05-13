import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'motif-js',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
