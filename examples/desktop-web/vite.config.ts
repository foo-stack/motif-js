import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `base: './'` makes the built asset URLs relative, so Electron (and Tauri)
// can load `dist/index.html` over `file://` without a dev server.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5174, host: true },
});
