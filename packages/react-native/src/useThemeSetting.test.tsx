/** @vitest-environment jsdom */
import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __setColorScheme } from './__test-setup__/react-native-mock.js';
import {
  useThemeSetting,
  type SyncStorage,
  type UseThemeSettingResult,
} from './useThemeSetting.js';

let container: HTMLElement;
let root: Root;

function captureHook(opts?: Parameters<typeof useThemeSetting>[0]): {
  current: () => UseThemeSettingResult;
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
  };
}

function makeStorage(): SyncStorage & { _store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    _store: store,
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
  };
}

beforeEach(() => {
  __setColorScheme('light');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  __setColorScheme('light');
});

describe('useThemeSetting (native)', () => {
  it('defaults to mode=system and resolves to the OS color scheme', () => {
    __setColorScheme('dark');
    const probe = captureHook();
    expect(probe.current().mode).toBe('system');
    expect(probe.current().resolved).toBe('dark');
  });

  it('resolves to light when the OS reports light', () => {
    __setColorScheme('light');
    const probe = captureHook();
    expect(probe.current().resolved).toBe('light');
  });

  it('falls back to defaultResolved when the OS reports null', () => {
    __setColorScheme(null);
    const probe = captureHook({ defaultResolved: 'dark' });
    expect(probe.current().resolved).toBe('dark');
  });

  it('updates resolved when Appearance.addChangeListener fires', () => {
    __setColorScheme('light');
    const probe = captureHook();
    expect(probe.current().resolved).toBe('light');
    act(() => {
      __setColorScheme('dark');
    });
    expect(probe.current().resolved).toBe('dark');
  });

  it('explicit override wins over the OS preference', () => {
    __setColorScheme('dark');
    const probe = captureHook();
    act(() => probe.current().set('light'));
    expect(probe.current().mode).toBe('light');
    expect(probe.current().resolved).toBe('light');
  });

  it('persists override to a synchronous storage shim', () => {
    const storage = makeStorage();
    const probe = captureHook({ storage });
    act(() => probe.current().set('dark'));
    expect(storage._store.get('motif:theme')).toBe('dark');
  });

  it('removes the storage key when set back to system', () => {
    const storage = makeStorage();
    const probe = captureHook({ storage });
    act(() => probe.current().set('dark'));
    act(() => probe.current().set('system'));
    expect(storage._store.has('motif:theme')).toBe(false);
  });

  it('restores a persisted override on mount', () => {
    const storage = makeStorage();
    storage._store.set('motif:theme', 'dark');
    __setColorScheme('light');
    const probe = captureHook({ storage });
    expect(probe.current().mode).toBe('dark');
    expect(probe.current().resolved).toBe('dark');
  });

  it('honours a custom storage key', () => {
    const storage = makeStorage();
    const probe = captureHook({ storage, storageKey: 'app:colorMode' });
    act(() => probe.current().set('dark'));
    expect(storage._store.get('app:colorMode')).toBe('dark');
  });

  it('survives a storage failure (no storage shim)', () => {
    const probe = captureHook();
    act(() => probe.current().set('dark'));
    expect(probe.current().mode).toBe('dark');
    expect(probe.current().resolved).toBe('dark');
  });

  it('survives a storage write throw', () => {
    const storage: SyncStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {},
    };
    const setItemSpy = vi.spyOn(storage, 'setItem');
    const probe = captureHook({ storage });
    act(() => probe.current().set('dark'));
    expect(setItemSpy).toHaveBeenCalled();
    // In-memory mode still flips.
    expect(probe.current().mode).toBe('dark');
  });

  // Regression: an async-primed adapter (createAsyncStorageAdapter) reads
  // its cache after construction and exposes `whenReady`. The hook used to
  // read storage only once at mount, so the persisted mode was silently
  // ignored. It must re-read once priming resolves.
  function makeAsyncAdapter(persisted?: string): SyncStorage & {
    whenReady: Promise<void>;
    prime: () => void;
  } {
    const store = new Map<string, string>();
    let resolveReady!: () => void;
    const whenReady = new Promise<void>((r) => {
      resolveReady = r;
    });
    return {
      whenReady,
      prime: () => {
        if (persisted !== undefined) store.set('motif:theme', persisted);
        resolveReady();
      },
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => {
        store.set(k, v);
      },
      removeItem: (k) => {
        store.delete(k);
      },
    };
  }

  it('adopts the persisted mode once an async adapter primes (whenReady)', async () => {
    const adapter = makeAsyncAdapter('dark');
    const probe = captureHook({ storage: adapter });
    // Cache empty before priming → falls back to system.
    expect(probe.current().mode).toBe('system');
    await act(async () => {
      adapter.prime();
      await adapter.whenReady;
    });
    expect(probe.current().mode).toBe('dark');
  });

  it('does not override an explicit choice made before the adapter primes', async () => {
    const adapter = makeAsyncAdapter('dark');
    const probe = captureHook({ storage: adapter });
    act(() => probe.current().set('light'));
    await act(async () => {
      adapter.prime();
      await adapter.whenReady;
    });
    expect(probe.current().mode).toBe('light');
  });
});
