import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Popover } from './Popover.js';
import { Menu } from './Menu.js';
import { ContextMenu } from './ContextMenu.js';

let container: HTMLElement;
let root: Root;
function render(node: React.ReactNode): void {
  act(() => root.render(node));
}
function click(el: Element): void {
  act(() => (el as HTMLElement).click());
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

describe('Popover', () => {
  it('opens on Trigger click and exposes role=dialog', () => {
    render(
      <Popover.Root>
        <Popover.Trigger>
          <button data-testid="t">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <span>panel</span>
        </Popover.Content>
      </Popover.Root>,
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    click(container.querySelector('[data-testid="t"]')!);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('Trigger gets aria-expanded + aria-haspopup', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button data-testid="t">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <span>x</span>
        </Popover.Content>
      </Popover.Root>,
    );
    const t = container.querySelector('[data-testid="t"]')!;
    expect(t.getAttribute('aria-expanded')).toBe('true');
    expect(t.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('Close button closes the popover', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button>Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Close>
            <button data-testid="close">x</button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>,
    );
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    click(document.querySelector('[data-testid="close"]')!);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});

describe('Menu', () => {
  it('opens on Trigger click and exposes role=menu + role=menuitem', () => {
    render(
      <Menu.Root>
        <Menu.Trigger>
          <button data-testid="t">Actions</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>One</Menu.Item>
          <Menu.Item>Two</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    click(container.querySelector('[data-testid="t"]')!);
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
    expect(document.querySelectorAll('[role="menuitem"]').length).toBe(2);
  });

  it('Trigger has aria-haspopup=menu', () => {
    render(
      <Menu.Root>
        <Menu.Trigger>
          <button data-testid="t">a</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>x</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    expect(container.querySelector('[data-testid="t"]')!.getAttribute('aria-haspopup')).toBe(
      'menu',
    );
  });

  it('disabled item gets aria-disabled', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <button>a</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item disabled>blocked</Menu.Item>
          <Menu.Item>fine</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    const items = document.querySelectorAll('[role="menuitem"]');
    expect(items[0]!.getAttribute('aria-disabled')).toBe('true');
    expect(items[1]!.getAttribute('aria-disabled')).toBeNull();
  });

  // Regression: the context value was a fresh object each render, so the
  // auto-focus effect (keyed on the whole ctx) re-ran on every parent
  // re-render and yanked focus back to the first item, defeating Arrow-key
  // navigation.
  it('does not steal focus back to the first item on re-render', () => {
    const tree = (
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <button>a</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>One</Menu.Item>
          <Menu.Item>Two</Menu.Item>
          <Menu.Item>Three</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );
    render(tree);
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    // On open the first enabled item is focused.
    expect(document.activeElement).toBe(items[0]);
    // Arrow down to the second item.
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    act(() => {
      menu.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      );
    });
    expect(document.activeElement).toBe(items[1]);
    // A parent re-render must NOT reset focus to the first item.
    render(tree);
    expect(document.activeElement).toBe(items[1]);
  });

  it('registers each item exactly once (no duplicate registration on re-render)', () => {
    const tree = (
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <button>a</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>One</Menu.Item>
          <Menu.Item>Two</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );
    render(tree);
    render(tree);
    // Arrow navigation walks the registry; from the first item ArrowUp
    // wraps to the last. If items were registered multiple times the wrap
    // math would land on the wrong element.
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    act(() => {
      menu.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      );
    });
    expect(document.activeElement).toBe(items[items.length - 1]);
    expect(items.length).toBe(2);
  });

  // Regression: click-outside closed the menu but left focus where it was
  // (often lost to <body>) instead of returning it to the trigger like
  // Escape does.
  it('returns focus to the trigger on click-outside', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <button data-testid="trigger">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>One</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    // Click on the document body (outside the portaled menu).
    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(container.querySelector('[data-testid="trigger"]'));
  });
});

describe('ContextMenu', () => {
  it('opens on contextmenu event', () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div data-testid="region">Right click</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    expect(document.querySelector('[role="menu"]')).toBeNull();
    const region = container.querySelector('[data-testid="region"]')!;
    act(() => {
      region.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100,
        }),
      );
    });
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
  });

  // Regression: ContextMenu had no focus-restore at all — closing it
  // dropped focus to <body>. It now returns focus to whatever was focused
  // before the menu opened.
  it('returns focus to the previously focused element on close', () => {
    render(
      <div>
        <button data-testid="prev">prev</button>
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <div data-testid="region">Right click</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Cut</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </div>,
    );
    const prev = container.querySelector<HTMLElement>('[data-testid="prev"]')!;
    act(() => prev.focus());
    expect(document.activeElement).toBe(prev);
    // Open via right-click; focus moves into the menu.
    act(() => {
      container.querySelector('[data-testid="region"]')!.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 10,
          clientY: 10,
        }),
      );
    });
    expect(document.activeElement).not.toBe(prev);
    // Escape closes and returns focus to where it was before opening.
    act(() => {
      document
        .querySelector('[role="menu"]')!
        .dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
        );
    });
    expect(document.activeElement).toBe(prev);
  });
});
