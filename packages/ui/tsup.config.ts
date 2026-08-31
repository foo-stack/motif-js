import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

const DIRECTIVE = "'use client';\n";

/**
 * Prepend `'use client'` to the bundled output. Without the directive in
 * `dist`, importing this package from a React Server Component fails at
 * build time even though the source files carry it.
 *
 * Only the barrel is listed. `package.json` exports a single `"."` entry,
 * so the per-component entries and shared chunks below cannot be addressed
 * by a consumer, and the boundary the barrel declares covers everything
 * reached through it. Adding a subpath export means adding it here too.
 *
 * tsup's `banner` option is stripped by esbuild's treeshake when the
 * banner is a free string expression, so we prepend post-build.
 */
async function prependUseClient(): Promise<void> {
  for (const file of ['dist/index.js', 'dist/index.cjs']) {
    const content = await readFile(file, 'utf8');
    if (!content.startsWith(DIRECTIVE)) {
      await writeFile(file, DIRECTIVE + content);
    }
  }
}

export default defineConfig({
  // One entry per component (plus the barrel) with ESM splitting, so importing
  // one component never drags in another's dependencies - notably, the display
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
    'src/AlertDialog.tsx',
    'src/ContextMenu.tsx',
    'src/Separator.tsx',
    'src/Skeleton.tsx',
    'src/Pagination.tsx',
    'src/Stepper.tsx',
    'src/Breadcrumb.tsx',
    'src/Toolbar.tsx',
    'src/NavigationMenu.tsx',
    'src/RangeSlider.tsx',
    'src/RatingInput.tsx',
    'src/Combobox.tsx',
    'src/MultiSelect.tsx',
    'src/ColorPicker.tsx',
    'src/FileUpload.tsx',
    'src/TimeInput.tsx',
    'src/HoverCard.tsx',
    'src/Collapsible.tsx',
    'src/Calendar.tsx',
    'src/DatePicker.tsx',
    'src/CommandPalette.tsx',
    'src/TreeView.tsx',
    'src/Stat.tsx',
    'src/EmptyState.tsx',
    'src/Timeline.tsx',
    'src/AvatarGroup.tsx',
    'src/Chip.tsx',
    'src/Banner.tsx',
    'src/FormField.tsx',
    'src/SegmentedControl.tsx',
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
  onSuccess: prependUseClient,
});
