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
});
