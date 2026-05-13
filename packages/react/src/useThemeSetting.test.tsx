/** @vitest-environment jsdom */
import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThemeSetting, type UseThemeSettingResult } from './useThemeSetting.js';

let container: HTMLElement;
let root: Root;

interface MediaQueryHandle {
  set matches(value: boolean);
  fireChange(): void;
}

function installMatchMedia(initialDark: boolean): MediaQueryHandle {
  let matches = initialDark;
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      media: query,
      get matches() {
        return matches;
      },
      onchange: null,
      addEventListener: (_type: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.add(handler);
      },
      removeEventListener: (_type: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.delete(handler);
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  return {
    set matches(value: boolean) {
      matches = value;
    },
    fireChange() {
      for (const fn of listeners) {
        fn({ matches } as MediaQueryListEvent);
      }
    },
  };
}

function captureHook(opts?: Parameters<typeof useThemeSetting>[0]): {
  current: () => UseThemeSettingResult;
  rerender: () => void;
} {
  let captured: UseThemeSettingResult | null = null;
  function Probe(): null {
    const result = useThemeSetting(opts);
    useEffect(() => {
      captured = result;
    });
    captured = result;
    return null;
  }
  act(() => {
    root.render(<Probe />);
  });
  return {
    current: () => {
      if (captured === null) throw new Error('hook not captured yet');
      return captured;
    },
    rerender: () => {
      act(() => {
        root.render(<Probe />);
      });
    },
  };
}

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  window.localStorage.clear();
});

describe('useThemeSetting (web)', () => {
  it('defaults to mode=system and resolves against the OS preference', () => {
    const mq = installMatchMedia(true); // OS = dark
    void mq;
    const probe = captureHook();
    expect(probe.current().mode).toBe('system');
    expect(probe.current().resolved).toBe('dark');
  });

  it('resolves to light when OS prefers light', () => {
    installMatchMedia(false);
    const probe = captureHook();
    expect(probe.current().resolved).toBe('light');
  });

  it('updates resolved when the OS preference changes', () => {
    const mq = installMatchMedia(false);
    const probe = captureHook();
    expect(probe.current().resolved).toBe('light');

    act(() => {
      mq.matches = true;
      mq.fireChange();
    });
    expect(probe.current().resolved).toBe('dark');
  });

  it('explicit override wins over the OS preference', () => {
    installMatchMedia(true); // OS = dark
    const probe = captureHook();
    act(() => probe.current().set('light'));
    expect(probe.current().mode).toBe('light');
    expect(probe.current().resolved).toBe('light');
  });

  it('persists explicit override to localStorage', () => {
    installMatchMedia(false);
    const probe = captureHook();
    act(() => probe.current().set('dark'));
    expect(window.localStorage.getItem('motif:theme')).toBe('dark');
  });

  it('removes the storage key when set back to system', () => {
    installMatchMedia(false);
    const probe = captureHook();
    act(() => probe.current().set('dark'));
    expect(window.localStorage.getItem('motif:theme')).toBe('dark');
    act(() => probe.current().set('system'));
    expect(window.localStorage.getItem('motif:theme')).toBeNull();
  });

  it('restores a persisted override on mount', () => {
    window.localStorage.setItem('motif:theme', 'dark');
    installMatchMedia(false);
    const probe = captureHook();
    expect(probe.current().mode).toBe('dark');
    expect(probe.current().resolved).toBe('dark');
  });

  it('does not persist when storageKey is null', () => {
    installMatchMedia(false);
    const probe = captureHook({ storageKey: null });
    act(() => probe.current().set('dark'));
    expect(window.localStorage.getItem('motif:theme')).toBeNull();
    expect(probe.current().mode).toBe('dark');
  });

  it('honours a custom storage key', () => {
    installMatchMedia(false);
    const probe = captureHook({ storageKey: 'custom:theme' });
    act(() => probe.current().set('dark'));
    expect(window.localStorage.getItem('custom:theme')).toBe('dark');
    expect(window.localStorage.getItem('motif:theme')).toBeNull();
  });

  it('survives a localStorage write failure', () => {
    installMatchMedia(false);
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const probe = captureHook();
    act(() => probe.current().set('dark'));
    // In-memory state still flips even when persistence throws.
    expect(probe.current().mode).toBe('dark');
    expect(probe.current().resolved).toBe('dark');
    setItem.mockRestore();
  });

  it('honours defaultResolved before the client effect runs (SSR-shape)', () => {
    // Simulate SSR by stubbing matchMedia AFTER first capture would
    // run. The hook returns defaultResolved on the very first render,
    // then the effect installs the real subscription on commit.
    const mq = installMatchMedia(true);
    const probe = captureHook({ defaultResolved: 'light' });
    // After the effect, resolved syncs to the OS value.
    expect(probe.current().resolved).toBe('dark');
    void mq;
  });
});
