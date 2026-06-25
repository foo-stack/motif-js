import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@usemotif/compiler-web',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
