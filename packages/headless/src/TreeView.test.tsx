import { act, createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TreeView, type TreeNode } from './specialized.js';

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

function press(el: HTMLElement, key: string): void {
  act(() => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });
}

const tree: ReadonlyArray<TreeNode> = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'src/index.ts', label: 'index.ts' },
      {
        id: 'src/lib',
        label: 'lib',
        children: [
          { id: 'src/lib/a.ts', label: 'a.ts' },
          { id: 'src/lib/b.ts', label: 'b.ts' },
        ],
      },
    ],
  },
  { id: 'README.md', label: 'README.md' },
];

function renderNode(info: {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
  toggle: () => void;
  select: () => void;
}): ReactElement {
  return createElement(
    'div',
    {
      'data-testid': info.node.id,
      'data-expanded': String(info.isExpanded),
      'data-selected': String(info.isSelected),
      'data-focused': String(info.isFocused),
      onClick: () => {
        info.toggle();
        info.select();
      },
    },
    info.node.label,
  );
}

describe('TreeView — render shape', () => {
  it('renders role="tree" and root-level role="treeitem"s', () => {
    render(<TreeView data={tree} renderNode={renderNode} aria-label="files" />);
    const treeEl = container.querySelector('[role="tree"]')!;
    expect(treeEl.getAttribute('aria-label')).toBe('files');
    // Two roots only — children of `src` are hidden until expanded.
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(2);
  });

  it('aria-level reflects depth (1-indexed)', () => {
    render(<TreeView data={tree} defaultExpanded={['src']} renderNode={renderNode} />);
    const items = container.querySelectorAll('[role="treeitem"]');
    expect(items[0]!.getAttribute('aria-level')).toBe('1');
    expect(items[1]!.getAttribute('aria-level')).toBe('2');
    expect(items[2]!.getAttribute('aria-level')).toBe('2');
  });

  it('aria-expanded set on items with children only', () => {
    render(<TreeView data={tree} renderNode={renderNode} />);
    const src = container.querySelector('[data-testid="src"]')!.parentElement!;
    const readme = container.querySelector('[data-testid="README.md"]')!.parentElement!;
    expect(src.getAttribute('aria-expanded')).toBe('false');
    expect(readme.hasAttribute('aria-expanded')).toBe(false);
  });

  it('defaultExpanded ids show their children', () => {
    render(<TreeView data={tree} defaultExpanded={['src']} renderNode={renderNode} />);
    expect(container.querySelector('[data-testid="src/index.ts"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="src/lib"]')).not.toBeNull();
    // Grandchildren still hidden because src/lib isn't expanded.
    expect(container.querySelector('[data-testid="src/lib/a.ts"]')).toBeNull();
  });
});

describe('TreeView — selection', () => {
  it('clicking a leaf node selects it', () => {
    render(<TreeView data={tree} defaultExpanded={['src']} renderNode={renderNode} />);
    const leaf = container.querySelector<HTMLElement>('[data-testid="src/index.ts"]')!;
    act(() => {
      leaf.click();
    });
    expect(leaf.getAttribute('data-selected')).toBe('true');
    const wrapper = leaf.parentElement!;
    expect(wrapper.getAttribute('aria-selected')).toBe('true');
  });

  // #237 — a disabled node advertises aria-disabled; selecting it (via the
  // select() callback or Enter) would contradict that.
  it('does not select a disabled node', () => {
    const onValueChange = vi.fn();
    const dtree: ReadonlyArray<TreeNode> = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B', disabled: true },
    ];
    render(
      <TreeView
        data={dtree}
        renderNode={renderNode}
        onValueChange={onValueChange}
        aria-label="t"
      />,
    );
    const node = container.querySelector<HTMLElement>('[data-testid="b"]')!;
    expect(node.parentElement!.getAttribute('aria-disabled')).toBe('true');
    // renderNode's onClick calls select() — must be a no-op for disabled.
    act(() => node.click());
    expect(onValueChange).not.toHaveBeenCalled();
    // Keyboard path: focus the disabled item, press Enter.
    act(() => node.parentElement!.focus());
    press(container.querySelector<HTMLElement>('[role="tree"]')!, 'Enter');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('controlled mode: onValueChange fires; selection persists from prop', () => {
    const onValueChange = vi.fn();
    render(
      <TreeView
        data={tree}
        value="README.md"
        onValueChange={onValueChange}
        defaultExpanded={['src']}
        renderNode={renderNode}
      />,
    );
    expect(
      container.querySelector('[data-testid="README.md"]')!.getAttribute('data-selected'),
    ).toBe('true');
    const leaf = container.querySelector<HTMLElement>('[data-testid="src/index.ts"]')!;
    act(() => {
      leaf.click();
    });
    expect(onValueChange).toHaveBeenCalledWith('src/index.ts');
    // Still README.md — controlled.
    expect(
      container.querySelector('[data-testid="README.md"]')!.getAttribute('data-selected'),
    ).toBe('true');
  });
});

describe('TreeView — keyboard navigation', () => {
  it('ArrowDown moves focus to the next visible node', () => {
    render(
      <TreeView data={tree} defaultValue="src" defaultExpanded={['src']} renderNode={renderNode} />,
    );
    const treeEl = container.querySelector<HTMLElement>('[role="tree"]')!;
    press(treeEl, 'ArrowDown');
    // Focus should land on src/index.ts.
    const focused = Array.from(container.querySelectorAll('[data-focused="true"]'))[0]!;
    expect(focused.getAttribute('data-testid')).toBe('src/index.ts');
  });

  it('ArrowRight on a collapsed parent expands it', () => {
    render(<TreeView data={tree} defaultValue="src" renderNode={renderNode} />);
    const treeEl = container.querySelector<HTMLElement>('[role="tree"]')!;
    expect(container.querySelector('[data-testid="src/index.ts"]')).toBeNull();
    press(treeEl, 'ArrowRight');
    expect(container.querySelector('[data-testid="src/index.ts"]')).not.toBeNull();
  });

  it('ArrowLeft on an expanded parent collapses it', () => {
    render(
      <TreeView data={tree} defaultValue="src" defaultExpanded={['src']} renderNode={renderNode} />,
    );
    const treeEl = container.querySelector<HTMLElement>('[role="tree"]')!;
    expect(container.querySelector('[data-testid="src/index.ts"]')).not.toBeNull();
    press(treeEl, 'ArrowLeft');
    expect(container.querySelector('[data-testid="src/index.ts"]')).toBeNull();
  });

  it('Enter selects the focused node', () => {
    const onValueChange = vi.fn();
    render(
      <TreeView
        data={tree}
        defaultValue="src"
        defaultExpanded={['src']}
        renderNode={renderNode}
        onValueChange={onValueChange}
      />,
    );
    const treeEl = container.querySelector<HTMLElement>('[role="tree"]')!;
    press(treeEl, 'ArrowDown'); // focus → src/index.ts
    press(treeEl, 'Enter');
    expect(onValueChange).toHaveBeenCalledWith('src/index.ts');
  });

  it('disabled nodes carry aria-disabled', () => {
    const treeWithDisabled: ReadonlyArray<TreeNode> = [
      { id: 'a', label: 'a', disabled: true },
      { id: 'b', label: 'b' },
    ];
    render(<TreeView data={treeWithDisabled} renderNode={renderNode} />);
    const items = container.querySelectorAll('[role="treeitem"]');
    expect(items[0]!.getAttribute('aria-disabled')).toBe('true');
    expect(items[1]!.hasAttribute('aria-disabled')).toBe(false);
  });

  // Regression: roving tabindex was cosmetic — arrow keys only updated
  // state, real DOM focus never moved off the container, so AT never
  // announced the active node.
  it('the active treeitem is the tab stop (tabIndex 0); others are -1', () => {
    render(
      <TreeView data={tree} defaultValue="src" defaultExpanded={['src']} renderNode={renderNode} />,
    );
    const items = container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    const active = container.querySelector('[data-testid="src"]')!.parentElement!;
    expect(active.getAttribute('tabindex')).toBe('0');
    const others = Array.from(items).filter((el) => el !== active);
    expect(others.every((el) => el.getAttribute('tabindex') === '-1')).toBe(true);
  });

  it('falls back to the first item as the tab stop when nothing is selected', () => {
    render(<TreeView data={tree} defaultExpanded={['src']} renderNode={renderNode} />);
    const first = container.querySelectorAll<HTMLElement>('[role="treeitem"]')[0]!;
    expect(first.getAttribute('tabindex')).toBe('0');
  });

  it('ArrowDown moves real DOM focus to the next item when focus is inside the tree', () => {
    render(
      <TreeView data={tree} defaultValue="src" defaultExpanded={['src']} renderNode={renderNode} />,
    );
    const srcItem = container.querySelector('[data-testid="src"]')!.parentElement as HTMLElement;
    act(() => srcItem.focus());
    expect(document.activeElement).toBe(srcItem);
    press(srcItem, 'ArrowDown');
    const nextItem = container.querySelector('[data-testid="src/index.ts"]')!
      .parentElement as HTMLElement;
    expect(document.activeElement).toBe(nextItem);
  });
});
