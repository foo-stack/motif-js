import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/react-web',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
