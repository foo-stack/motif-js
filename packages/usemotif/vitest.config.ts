import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'usemotif',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
