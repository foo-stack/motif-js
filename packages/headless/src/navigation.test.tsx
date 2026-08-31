import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NavigationMenu, type NavigationMenuItem } from './navigation.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function menuitemByText(text: string): HTMLElement {
  const all = Array.from(document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  const found = all.find((el) => el.textContent === text);
  if (found === undefined) throw new Error(`no menuitem labelled "${text}"`);
  return found;
}

function openSubmenuCount(): number {
  return document.body.querySelectorAll('[role="menu"]').length;
}

const nestedItems: ReadonlyArray<NavigationMenuItem> = [
  {
    id: 'file',
    label: 'File',
    children: [
      {
        id: 'recent',
        label: 'Recent',
        children: [{ id: 'doc', label: 'Doc' }],
      },
    ],
  },
];

describe('NavigationMenu - nested submenu Escape (#198)', () => {
  it('a single Escape collapses only the innermost open submenu', () => {
    render(<NavigationMenu items={nestedItems} />);

    // Open level 1 (File → its menu), then level 2 (Recent → its menu).
    act(() => menuitemByText('File').click());
    act(() => menuitemByText('Recent').click());
    expect(openSubmenuCount()).toBe(2);

    // One Escape on the document (not a focused menuitem, so only the
    // submenu-level window listeners run). Only the deepest submenu closes.
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(openSubmenuCount()).toBe(1);

    // A second Escape closes the remaining level.
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(openSubmenuCount()).toBe(0);
  });
});
