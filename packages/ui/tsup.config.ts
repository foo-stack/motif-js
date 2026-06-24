import { defineConfig } from 'tsup';

export default defineConfig({
  // One entry per component (plus the barrel) with ESM splitting, so importing
  // one component never drags in another's dependencies — notably, the display
  // components stay free of Modal's `@usemotif/headless` import.
  entry: [
    'src/index.ts',
    'src/Card.tsx',
    'src/Badge.tsx',
    'src/Spinner.tsx',
    'src/Alert.tsx',
    'src/Modal.tsx',
    'src/Tooltip.tsx',
    'src/Toast.tsx',
    'src/Switch.tsx',
    'src/Tabs.tsx',
    'src/Checkbox.tsx',
    'src/Radio.tsx',
    'src/Popover.tsx',
    'src/Accordion.tsx',
    'src/Select.tsx',
    'src/Menu.tsx',
    'src/Slider.tsx',
    'src/Progress.tsx',
    'src/Drawer.tsx',
  ],
  splitting: true,
  format: ['esm', 'cjs'],
  // tsup's dts pipeline trips TS 6's deprecated-`baseUrl` warning. Scope the
  // ignoreDeprecations escape hatch to dts-only so the project's tsconfig
  // stays strict for IDE / typecheck.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  clean: true,
  treeshake: true,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  external: ['react', 'react-dom', 'usemotif', '@usemotif/headless', '@usemotif/recipes'],
});
