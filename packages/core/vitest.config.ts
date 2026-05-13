import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/core',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
