import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@motif-js-bench/render',
    environment: 'jsdom',
    include: ['src/**/*.bench.ts', 'src/**/*.bench.tsx'],
  },
  resolve: {
    // Tamagui's core imports from `react-native`; alias to react-native-web
    // so we can SSR-render Tamagui components in a jsdom bench without
    // pulling the actual native runtime. This matches what a real Tamagui
    // web app does via webpack / vite aliasing.
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
