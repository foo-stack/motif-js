import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/compiler-babel',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
