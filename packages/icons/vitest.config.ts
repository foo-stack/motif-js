import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js/icons',
    environment: 'jsdom',
    include: ['src/icons.test.tsx', 'src/icons.test.ts'],
  },
});
