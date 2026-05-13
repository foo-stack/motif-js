import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/compiler-swc',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
