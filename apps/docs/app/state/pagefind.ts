'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Lazy-load Pagefind from the static index that lives at
 * `/pagefind/pagefind.js` after `pagefind --site build/client` runs.
 * Returns the resolved API once it's ready.
 *
 * In dev (no `pagefind/` directory yet) the import fails silently and
 * `api` stays `null` — the CmdK falls back to its empty-state copy.
 */

export interface PagefindResult {
  readonly id: string;
  readonly url: string;
  readonly meta: { readonly title?: string };
  readonly excerpt: string;
}

export interface PagefindSearchHit {
  readonly id: string;
  readonly score: number;
  readonly data: () => Promise<PagefindResult>;
}

interface PagefindApi {
  readonly search: (
    query: string,
  ) => Promise<{ readonly results: ReadonlyArray<PagefindSearchHit> }>;
}

interface PagefindWindow {
  readonly default?: PagefindApi;
  readonly search?: PagefindApi['search'];
}

let pendingLoad: Promise<PagefindApi | null> | null = null;

async function loadPagefind(): Promise<PagefindApi | null> {
  if (typeof window === 'undefined') return null;
  if (pendingLoad === null) {
    pendingLoad = (async () => {
      try {
        // The path is relative to the deployed site root. The index
        // is emitted to /pagefind/ by `pagefind --site build/client`.
        // The dynamic-import expression is built from a runtime
        // string so neither Vite nor TypeScript tries to resolve it
        // at build time — the file does not exist until pagefind has
        // run on the static output.
        const url = '/pagefind/pagefind.js';
        const mod = (await import(/* @vite-ignore */ url)) as PagefindWindow;
        if (mod.default !== undefined) return mod.default;
        if (mod.search !== undefined) return { search: mod.search };
        return null;
      } catch {
        return null;
      }
    })();
  }
  return pendingLoad;
}

export interface UsePagefindResult {
  readonly ready: boolean;
  readonly hits: ReadonlyArray<PagefindResult>;
  readonly query: string;
  readonly setQuery: (next: string) => void;
}

/**
 * React-friendly wrapper. Loads pagefind on first call, exposes a
 * controlled `query` + the resolved hits. Each character change
 * supersedes the previous in-flight search via a ref guard.
 */
export function usePagefind(): UsePagefindResult {
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<ReadonlyArray<PagefindResult>>([]);
  const reqIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    void loadPagefind().then((api) => {
      if (!cancelled) setReady(api !== null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = ++reqIdRef.current;
    if (query.trim().length === 0) {
      setHits([]);
      return;
    }
    void (async () => {
      const api = await loadPagefind();
      if (api === null) return;
      const { results } = await api.search(query);
      const top = await Promise.all(results.slice(0, 8).map((r) => r.data()));
      // Drop in-flight responses that were superseded mid-fetch.
      if (id !== reqIdRef.current) return;
      setHits(top);
    })();
  }, [query]);

  return { ready, hits, query, setQuery };
}
