import { defineConfig } from 'vitest/config';
import stylexPlugin from '@stylexjs/unplugin/vite';

export default defineConfig({
  // StyleX only produces atomic classes when compiled. Without this the
  // `stylex.create` calls in the benches would not be transformed and the row
  // would measure nothing. `dev: false` gives production-shape class names.
  plugins: [stylexPlugin({ dev: false, useCSSLayers: false })],
  test: {
    name: '@motif-js-bench/data-table',
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
