import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/reset',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
