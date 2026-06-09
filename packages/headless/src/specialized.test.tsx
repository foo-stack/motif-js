import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ColorPicker, TreeView, type TreeNode } from './specialized.js';

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

function treeitemById(id: string): HTMLElement {
  const items = Array.from(container.querySelectorAll<HTMLElement>('[role="treeitem"]'));
  const found = items.find((el) => el.textContent === id);
  if (found === undefined) throw new Error(`no treeitem "${id}"`);
  return found;
}

const tree: ReadonlyArray<TreeNode> = [
  {
    id: 'parent',
    label: 'parent',
    children: [
      { id: 'child-a', label: 'child-a' },
      { id: 'child-b', label: 'child-b' },
    ],
  },
];

describe('TreeView ArrowLeft (#207)', () => {
  it('moves focus to the parent from a leaf node', () => {
    render(
      <TreeView
        data={tree}
        defaultExpanded={['parent']}
        renderNode={({ node }) => <span>{node.id}</span>}
        aria-label="Files"
      />,
    );

    // Focus a leaf child, then ArrowLeft should climb to the parent.
    const childA = treeitemById('child-a');
    act(() => childA.focus());
    act(() => {
      childA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    });

    // The parent becomes the single tab stop (roving tabindex follows focus).
    expect(treeitemById('parent').tabIndex).toBe(0);
    expect(treeitemById('child-a').tabIndex).toBe(-1);
  });
});

describe('ColorPicker accessibility (#207)', () => {
  it('the saturation/value plane is a slider with aria-valuetext, not role=application', () => {
    render(<ColorPicker defaultValue="#ff0000" />);
    expect(container.querySelector('[role="application"]')).toBeNull();
    const plane = container.querySelector(
      '[role="slider"][aria-label="Saturation and value selector"]',
    );
    expect(plane).not.toBeNull();
    expect(plane!.getAttribute('aria-valuetext')).toMatch(/Saturation .*%, value .*%/);
  });

  it('FormatToggle uses a roving tabindex (single tab stop)', () => {
    render(<ColorPicker defaultValue="#ff0000" format="rgb" formats={['hex', 'rgb', 'hsl']} />);
    const radios = Array.from(
      container.querySelectorAll<HTMLElement>('[role="radiogroup"] [role="radio"]'),
    );
    expect(radios.length).toBe(3);
    // Exactly one radio is tabbable (the checked one); the rest are -1.
    const tabbable = radios.filter((r) => r.tabIndex === 0);
    expect(tabbable.length).toBe(1);
    expect(tabbable[0]!.getAttribute('aria-checked')).toBe('true');
  });

  it('FormatToggle ArrowRight moves selection to the next format', () => {
    let format = 'rgb';
    render(
      <ColorPicker
        value="rgb(255, 0, 0)"
        format="rgb"
        formats={['hex', 'rgb', 'hsl']}
        onFormatChange={(f) => {
          format = f;
        }}
      />,
    );
    const checked = container.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')!;
    act(() => {
      checked.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });
    expect(format).toBe('hsl');
  });
});
