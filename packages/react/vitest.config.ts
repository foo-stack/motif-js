import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/react',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
