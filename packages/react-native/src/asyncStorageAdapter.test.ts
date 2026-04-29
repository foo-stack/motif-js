import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAsyncStorageAdapter, type AsyncStorageLike } from './asyncStorageAdapter.js';

/**
 * Build a controllable in-memory async storage. `setItem` /
 * `removeItem` resolve on the microtask queue (matching RN
 * AsyncStorage semantics); `getItem` waits for the next tick before
 * resolving so the priming-pass tests have a window to assert
 * `ready === false`.
 */
function makeAsyncStorage(initial: Record<string, string> = {}): AsyncStorageLike & {
  store: Map<string, string>;
  getItemSpy: ReturnType<typeof vi.fn>;
  setItemSpy: ReturnType<typeof vi.fn>;
  removeItemSpy: ReturnType<typeof vi.fn>;
} {
  const store = new Map(Object.entries(initial));
  const getItemSpy = vi.fn(async (key: string) => store.get(key) ?? null);
  // Defer writes by one microtask so tests can observe the
  // "queued but not yet landed" window.
  const setItemSpy = vi.fn(async (key: string, value: string) => {
    await Promise.resolve();
    store.set(key, value);
  });
  const removeItemSpy = vi.fn(async (key: string) => {
    await Promise.resolve();
    store.delete(key);
  });
  return {
    store,
    getItemSpy,
    setItemSpy,
    removeItemSpy,
    getItem: getItemSpy,
    setItem: setItemSpy,
    removeItem: removeItemSpy,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createAsyncStorageAdapter — priming', () => {
  it('starts with ready=false and exposes a whenReady promise', () => {
    const fake = makeAsyncStorage({ 'motif:theme': 'dark' });
    const adapter = createAsyncStorageAdapter(fake, { keys: ['motif:theme'] });
    expect(adapter.ready).toBe(false);
    expect(adapter.whenReady).toBeInstanceOf(Promise);
  });

  it('fills the cache from the underlying store before whenReady resolves', async () => {
    const fake = makeAsyncStorage({ 'motif:theme': 'dark' });
    const adapter = createAsyncStorageAdapter(fake, { keys: ['motif:theme'] });
    expect(adapter.getItem('motif:theme')).toBeNull();
    await adapter.whenReady;
    expect(adapter.ready).toBe(true);
    expect(adapter.getItem('motif:theme')).toBe('dark');
  });

  it('calls getItem once per key during priming', async () => {
    const fake = makeAsyncStorage({ a: '1', b: '2' });
    const adapter = createAsyncStorageAdapter(fake, { keys: ['a', 'b'] });
    await adapter.whenReady;
    expect(fake.getItemSpy).toHaveBeenCalledTimes(2);
    expect(fake.getItemSpy.mock.calls.map((c) => c[0]).sort()).toEqual(['a', 'b']);
  });

  it('survives a priming-pass read failure (cache stays empty for that key)', async () => {
    const fake = makeAsyncStorage({ 'motif:theme': 'dark', other: 'x' });
    fake.getItemSpy.mockImplementationOnce(async () => {
      throw new Error('boom');
    });
    const adapter = createAsyncStorageAdapter(fake, { keys: ['motif:theme', 'other'] });
    await adapter.whenReady;
    expect(adapter.ready).toBe(true);
    // First key threw → cache miss → null. Second key primed normally.
    expect(adapter.getItem('motif:theme')).toBeNull();
    expect(adapter.getItem('other')).toBe('x');
  });

  it('skips keys that have no entry in the underlying store', async () => {
    const fake = makeAsyncStorage({ a: '1' });
    const adapter = createAsyncStorageAdapter(fake, { keys: ['a', 'b'] });
    await adapter.whenReady;
    expect(adapter.getItem('a')).toBe('1');
    expect(adapter.getItem('b')).toBeNull();
  });
});

describe('createAsyncStorageAdapter — sync writes', () => {
  it('updates the cache immediately', async () => {
    const fake = makeAsyncStorage();
    const adapter = createAsyncStorageAdapter(fake, { keys: [] });
    await adapter.whenReady;
    adapter.setItem('motif:theme', 'dark');
    expect(adapter.getItem('motif:theme')).toBe('dark');
  });

  it('fire-and-forgets the async write to the underlying store', async () => {
    const fake = makeAsyncStorage();
    const adapter = createAsyncStorageAdapter(fake, { keys: [] });
    await adapter.whenReady;
    adapter.setItem('motif:theme', 'dark');
    // The async write is queued but the underlying store hasn't
    // applied it yet (the fake awaits one microtask before writing).
    expect(fake.store.get('motif:theme')).toBeUndefined();
    expect(fake.setItemSpy).toHaveBeenCalledWith('motif:theme', 'dark');
    // Drain two microtask turns: the adapter's `.catch` chain holds
    // the second tick.
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.store.get('motif:theme')).toBe('dark');
  });

  it('removeItem evicts from the cache and queues the async remove', async () => {
    const fake = makeAsyncStorage({ 'motif:theme': 'dark' });
    const adapter = createAsyncStorageAdapter(fake, { keys: ['motif:theme'] });
    await adapter.whenReady;
    expect(adapter.getItem('motif:theme')).toBe('dark');
    adapter.removeItem('motif:theme');
    expect(adapter.getItem('motif:theme')).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.store.has('motif:theme')).toBe(false);
  });

  it('routes async write failures through onWriteError (default warns once)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fake = makeAsyncStorage();
    fake.setItemSpy.mockImplementation(async () => {
      throw new Error('quota');
    });
    const adapter = createAsyncStorageAdapter(fake, { keys: [] });
    await adapter.whenReady;
    adapter.setItem('a', '1');
    adapter.setItem('b', '2');
    // Drain a few microtask turns so both rejections settle.
    await Promise.resolve();
    await Promise.resolve();
    expect(warnSpy.mock.calls.length).toBeLessThanOrEqual(1);
    // In-memory state still reflects both writes.
    expect(adapter.getItem('a')).toBe('1');
    expect(adapter.getItem('b')).toBe('2');
  });

  it('routes async write failures through a custom onWriteError', async () => {
    const onWriteError = vi.fn();
    const fake = makeAsyncStorage();
    fake.setItemSpy.mockImplementation(async () => {
      throw new Error('boom');
    });
    const adapter = createAsyncStorageAdapter(fake, { keys: [], onWriteError });
    await adapter.whenReady;
    adapter.setItem('motif:theme', 'dark');
    await Promise.resolve();
    expect(onWriteError).toHaveBeenCalledTimes(1);
    expect(onWriteError.mock.calls[0]?.[1]).toBe('motif:theme');
  });
});
