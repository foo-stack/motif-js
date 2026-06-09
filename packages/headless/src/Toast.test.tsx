import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster, useToast } from './Toast.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

// Capture toast() outside the component so the test body can call it.
let toastFn: ((input: Parameters<ReturnType<typeof useToast>['toast']>[0]) => string) | null = null;
let dismissFn: ((id: string) => void) | null = null;
function HookHarness(): null {
  const ctx = useToast();
  toastFn = ctx.toast;
  dismissFn = ctx.dismiss;
  return null;
}

function listToasts(): Element[] {
  // Toasts portal into document.body via <Portal>, so query globally.
  return Array.from(document.body.querySelectorAll('[role="status"], [role="alert"]'));
}

describe('Toaster + useToast — push / queue / aria-live', () => {
  it('useToast() throws outside a Toaster', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<HookHarness />);
    }).toThrow(/Toaster/);
    spy.mockRestore();
  });

  // #171 — role implies politeness, so the explicit aria-live on each toast
  // was redundant and dropped; the live region is the persistent container.
  it('default toast renders with role="status" and no redundant aria-live', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'Saved' });
    });
    const t = listToasts()[0]!;
    expect(t.getAttribute('role')).toBe('status');
    expect(t.getAttribute('aria-live')).toBeNull();
    expect(t.textContent).toContain('Saved');
    // #206 — the toast's role IS the live region; the container must NOT also
    // be one, or screen readers double-announce. No nested live region.
    expect(document.body.querySelector('[aria-live]')).toBeNull();
    expect(t.closest('[aria-live]')).toBeNull();
  });

  it('foreground type uses role="alert" with no redundant aria-live', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'Error', type: 'foreground' });
    });
    const t = listToasts()[0]!;
    expect(t.getAttribute('role')).toBe('alert');
    expect(t.getAttribute('aria-live')).toBeNull();
  });

  it('multiple toasts queue in order', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'a' });
      toastFn!({ title: 'b' });
      toastFn!({ title: 'c' });
    });
    const titles = listToasts().map((t) => t.textContent);
    expect(titles[0]).toContain('a');
    expect(titles[1]).toContain('b');
    expect(titles[2]).toContain('c');
  });
});

describe('Toaster — auto-dismiss', () => {
  it('removes a toast after `duration` ms (default 5000)', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'auto' });
    });
    expect(listToasts().length).toBe(1);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(listToasts().length).toBe(0);
  });

  it('honours explicit `duration` per toast', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'short', duration: 1000 });
    });
    expect(listToasts().length).toBe(1);
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(listToasts().length).toBe(1);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(listToasts().length).toBe(0);
  });

  it('Infinity duration keeps the toast indefinitely', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'sticky', duration: Infinity });
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(listToasts().length).toBe(1);
  });

  it('defaultDuration prop changes the default for all toasts', () => {
    render(
      <Toaster defaultDuration={2000}>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'a' });
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(listToasts().length).toBe(0);
  });
});

describe('Toaster — manual dismiss', () => {
  it('dismiss(id) removes the matching toast', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    let id = '';
    act(() => {
      id = toastFn!({ title: 'a' });
      toastFn!({ title: 'b' });
    });
    expect(listToasts().length).toBe(2);
    act(() => {
      dismissFn!(id);
    });
    expect(listToasts().length).toBe(1);
    expect(listToasts()[0]!.textContent).toContain('b');
  });

  it('default Close button removes the toast', () => {
    render(
      <Toaster>
        <HookHarness />
      </Toaster>,
    );
    act(() => {
      toastFn!({ title: 'closable' });
    });
    const close = document.body.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]')!;
    act(() => {
      close.click();
    });
    expect(listToasts().length).toBe(0);
  });
});
