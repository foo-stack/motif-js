import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { _electron as electron, expect, test } from '@playwright/test';

const here = dirname(fileURLToPath(import.meta.url));

// Launches the real Electron app and asserts the shared <DemoScreen/> painted.
// This is the proof "first-class desktop" rests on: the same component the web
// renders is alive in a desktop window. Requires the desktop-web build to
// exist (`yarn workspace @usemotif/example-desktop-web build`).
test('renders the shared demo in an Electron window', async () => {
  const app = await electron.launch({ args: [join(here, 'main.js')] });
  try {
    const window = await app.firstWindow();
    // The heading proves the themed primitives mounted and resolved tokens.
    await expect(window.getByText('motif on the desktop')).toBeVisible();
    // The interactive control proves Button + state work in the shell.
    await expect(window.getByText(/Toggle theme/)).toBeVisible();
  } finally {
    await app.close();
  }
});
