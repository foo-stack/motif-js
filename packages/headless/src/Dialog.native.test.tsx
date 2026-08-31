/** @vitest-environment jsdom */
/**
 * Native Dialog tests run against the `react-native` mock (aliased in
 * vitest.config.ts), which renders Modal / Pressable / View / Text as
 * DOM hosts so jsdom can query them.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Dialog } from './Dialog.native.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
});

describe('Native Dialog - content visible to assistive tech (#223)', () => {
  it('renders the surface as a sibling of the hidden scrim, not a descendant', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>My dialog</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    // The scrim is the Pressable that hides itself + descendants.
    const scrim = Array.from(container.querySelectorAll('[data-motif-host="Pressable"]')).find(
      (el) => el.getAttribute('importantforaccessibility') === 'no-hide-descendants',
    );
    expect(scrim).toBeTruthy();
    // The dialog content must NOT live inside that hidden scrim, or the whole
    // dialog is invisible to VoiceOver/TalkBack.
    expect(scrim!.textContent).not.toContain('My dialog');
    expect(container.textContent).toContain('My dialog');
  });
});

describe('Native Dialog - accessibilityHint (#241)', () => {
  it('passes the description text (not its element id) to the surface accessibilityHint', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Helpful description.</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    // The surface is the View labelled by the title (the centering container
    // isn't). String attributes render reliably in the mock.
    const surface = Array.from(container.querySelectorAll('[data-motif-host="View"]')).find((el) =>
      el.hasAttribute('accessibilitylabelledby'),
    );
    expect(surface).toBeTruthy();
    expect(surface!.getAttribute('accessibilityhint')).toBe('Helpful description.');
  });
});
