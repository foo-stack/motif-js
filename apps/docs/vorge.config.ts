import { defineConfig } from '@vorge/core/config';
import { fonts } from './plugins/fonts.js';

export default defineConfig({
  title: 'motif-js',
  description: 'Cross-platform React styling for web, native, and desktop.',
  theme: './theme',
  server: { port: 4321 },
  plugins: [fonts()],
});
