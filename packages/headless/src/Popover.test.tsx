import { act, createRef, useEffect, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePresence } from '@usemotif/react';
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
// A faithful pointer click: mousedown (which drives useClickOutside) then
// click (which drives the trigger toggle), each flushed separately so React
// re-renders between them - exactly as the browser delivers two top-level
// events. Without the flush the trigger's click closure reads the stale
// pre-mousedown `open`, masking the dismiss-vs-toggle race. A bare
// `.click()` never fires mousedown and so never exercises it at all.
function pointerClick(el: Element): void {
  act(() => {
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
  act(() => {
    (el as HTMLElement).click();
  });
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

  it('preserves the consumer ref on the trigger child (#262)', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Popover.Root>
        <Popover.Trigger>
          <button ref={ref} data-testid="t">
            Open
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <span>panel</span>
        </Popover.Content>
      </Popover.Root>,
    );
    expect(ref.current).toBe(container.querySelector('[data-testid="t"]'));
  });

  it('only sets aria-controls while open (#263)', () => {
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
    const t = container.querySelector('[data-testid="t"]')!;
    expect(t.getAttribute('aria-controls')).toBeNull();
    click(t);
    expect(t.getAttribute('aria-controls')).not.toBeNull();
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

  // #164 - a real click on the trigger while open fires mousedown
  // (useClickOutside) then click (the trigger toggle). The trigger must be
  // ignored by click-outside so the click toggles closed instead of the
  // mousedown dismissing and the click re-opening.
  it('closes when the trigger is clicked while open (no double-toggle)', () => {
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
    const trigger = container.querySelector('[data-testid="t"]')!;
    pointerClick(trigger);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    // Click the trigger again - it should close, not flicker back open.
    pointerClick(trigger);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
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

  // #188 - Popover is non-modal and never moves focus into the content, so
  // focus stays on the trigger. Escape must still close it. The listener is on
  // the document, not the portaled Content div (which never sees the keydown).
  it('Escape closes the popover when focus is on the trigger', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button data-testid="t">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <span>panel</span>
        </Popover.Content>
      </Popover.Root>,
    );
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    const trigger = container.querySelector('[data-testid="t"]') as HTMLElement;
    trigger.focus();
    act(() => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});

describe('Popover - exit transition (exitDurationMs > 0)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function close(): void {
    const trigger = container.querySelector('[data-testid="t"]') as HTMLElement;
    act(() => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
  }

  it('keeps the surface mounted during exit, flags data-motif-state, then unmounts', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button data-testid="t">Open</button>
        </Popover.Trigger>
        <Popover.Content exitDurationMs={300}>
          <span>panel</span>
        </Popover.Content>
      </Popover.Root>,
    );
    const panel = document.querySelector('[role="dialog"]');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('data-motif-state')).toBeNull();

    close();
    const exiting = document.querySelector('[role="dialog"]');
    expect(exiting).not.toBeNull();
    expect(exiting?.getAttribute('data-motif-state')).toBe('exiting');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('settles immediately when transitionend fires before the fallback', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button data-testid="t">Open</button>
        </Popover.Trigger>
        <Popover.Content exitDurationMs={5000}>
          <span>panel</span>
        </Popover.Content>
      </Popover.Root>,
    );
    close();
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.getAttribute('data-motif-state')).toBe('exiting');

    const event = new Event('transitionend', { bubbles: false });
    Object.defineProperty(event, 'target', { value: panel });
    act(() => {
      panel.dispatchEvent(event);
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('settles via a registered descendant exit (presence route) before the fallback', () => {
    // A descendant that registers a pending exit through the PresenceContext the
    // popover publishes - the off-thread (WAAPI) settle route.
    let complete: (() => void) | null = null;
    function ExitingChild(): ReactElement {
      const presence = usePresence();
      const exiting = presence.phase === 'exiting';
      useEffect(() => {
        if (!exiting) return undefined;
        complete = presence.registerExit();
        return () => {
          complete = null;
        };
      }, [exiting, presence]);
      return <span data-testid="surface" />;
    }
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <button data-testid="t">Open</button>
        </Popover.Trigger>
        <Popover.Content exitDurationMs={5000}>
          <ExitingChild />
        </Popover.Content>
      </Popover.Root>,
    );
    close();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(typeof complete).toBe('function');

    act(() => {
      complete?.();
    });
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

  it('Item asChild projects the menuitem semantics onto a provided element', () => {
    const onSelect = (): void => {
      selected = true;
    };
    let selected = false;
    render(
      <Menu.Root>
        <Menu.Trigger>
          <button data-testid="t">Actions</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item asChild onSelect={onSelect}>
            <a href="#go" data-testid="link">
              Go
            </a>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    click(container.querySelector('[data-testid="t"]')!);
    // The semantics land on the provided <a>, not a wrapper <div>.
    const link = document.querySelector('[data-testid="link"]') as HTMLElement;
    expect(link).not.toBeNull();
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('role')).toBe('menuitem');
    expect(link.getAttribute('tabindex')).toBe('-1');
    // It is the registered, activatable item.
    click(link);
    expect(selected).toBe(true);
  });

  // #164 - same trigger ignore fix; clicking the trigger while the menu is
  // open must close it rather than dismiss-then-reopen.
  it('closes when the trigger is clicked while open (no double-toggle)', () => {
    render(
      <Menu.Root>
        <Menu.Trigger>
          <button data-testid="t">Actions</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>One</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    const trigger = container.querySelector('[data-testid="t"]')!;
    pointerClick(trigger);
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
    pointerClick(trigger);
    expect(document.querySelector('[role="menu"]')).toBeNull();
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

  it('preserves the consumer ref on the trigger child (#262)', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Menu.Root>
        <Menu.Trigger>
          <button ref={ref} data-testid="t">
            a
          </button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>x</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    expect(ref.current).toBe(container.querySelector('[data-testid="t"]'));
  });

  it('only sets aria-controls while open (#263)', () => {
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
    const t = container.querySelector('[data-testid="t"]')!;
    expect(t.getAttribute('aria-controls')).toBeNull();
    click(t);
    expect(t.getAttribute('aria-controls')).not.toBeNull();
  });

  it('Escape closes an all-disabled menu (#261)', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <button>a</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item disabled>one</Menu.Item>
          <Menu.Item disabled>two</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    // No enabled item to focus → the container takes focus so it can receive
    // the key event.
    expect(document.activeElement).toBe(menu);
    act(() => {
      menu.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
    });
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('navigates in DOM order when an item mounts later (#240)', () => {
    function Tree({ showB }: { showB: boolean }): React.ReactElement {
      return (
        <Menu.Root defaultOpen>
          <Menu.Trigger>
            <button>a</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>A</Menu.Item>
            {showB ? <Menu.Item>B</Menu.Item> : null}
            <Menu.Item>C</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );
    }
    render(<Tree showB={false} />);
    // B mounts after A and C → appended to the end of the registry while
    // sitting between them in the DOM.
    render(<Tree showB />);
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    // DOM order is A, B, C.
    expect(items[1]!.textContent).toBe('B');
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    // From A (auto-focused), ArrowDown must go to B (visual next), not C.
    act(() => {
      menu.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      );
    });
    expect(document.activeElement).toBe(items[1]);
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

  it('Item asChild projects the menuitem semantics onto a provided element', () => {
    let cut = false;
    const onCut = (): void => {
      cut = true;
    };
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div data-testid="region">Right click</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item asChild onSelect={onCut}>
            <a href="#cut" data-testid="cut">
              Cut
            </a>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
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
    const link = document.querySelector('[data-testid="cut"]') as HTMLElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('role')).toBe('menuitem');
    expect(link.getAttribute('tabindex')).toBe('-1');
    act(() => link.click());
    expect(cut).toBe(true);
  });

  // Regression: ContextMenu had no focus-restore at all - closing it
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

  it('positions at document coordinates, adding the scroll offset (#225)', () => {
    const origX = Object.getOwnPropertyDescriptor(window, 'scrollX');
    const origY = Object.getOwnPropertyDescriptor(window, 'scrollY');
    Object.defineProperty(window, 'scrollX', { configurable: true, get: () => 30 });
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => 500 });
    try {
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
      act(() => {
        container.querySelector('[data-testid="region"]')!.dispatchEvent(
          new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100,
          }),
        );
      });
      const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
      // Portaled position:absolute is document-relative → clientY + scrollY.
      expect(menu.style.top).toBe('600px');
      expect(menu.style.left).toBe('130px');
    } finally {
      if (origX) Object.defineProperty(window, 'scrollX', origX);
      if (origY) Object.defineProperty(window, 'scrollY', origY);
    }
  });

  it('Escape closes an all-disabled menu (#261)', () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div data-testid="region">Right click</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item disabled>Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
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
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    // No enabled item → the menu container is focused so Escape reaches it.
    expect(document.activeElement).toBe(menu);
    act(() => {
      menu.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
    });
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });
});
