import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/tokens',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
