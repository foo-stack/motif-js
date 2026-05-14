import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/compiler-core',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
