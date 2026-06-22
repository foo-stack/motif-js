import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/recipes',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
