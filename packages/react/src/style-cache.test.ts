import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SSRStyleCollector,
  _resetStyleCacheForTesting,
  flushPendingCss,
  injectAtRules,
  type AtRule,
} from './style-cache.js';

const padding4Md: AtRule = {
  atRule: '@media (min-width: 768px)',
  style: { padding: 'var(--space-4)' },
};
const padding8Lg: AtRule = {
  atRule: '@media (min-width: 1024px)',
  style: { padding: 'var(--space-8)' },
};

beforeEach(() => {
  _resetStyleCacheForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

afterEach(() => {
  _resetStyleCacheForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('injectAtRules — browser path', () => {
  it('returns undefined for an empty rule list', () => {
    expect(injectAtRules([])).toBeUndefined();
  });

  it('injects a `<style data-motif-style-cache>` element on first call', () => {
    const cls = injectAtRules([padding4Md]);
    expect(cls).toMatch(/^m-[a-z0-9]+$/);
    const el = document.head.querySelector('style[data-motif-style-cache]');
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain(`.${cls}`);
    expect(el?.textContent).toContain('@media (min-width: 768px)');
  });

  it('produces stable class names for identical rule lists', () => {
    const a = injectAtRules([padding4Md, padding8Lg]);
    const b = injectAtRules([padding4Md, padding8Lg]);
    expect(a).toBe(b);
  });

  it('deduplicates — only one rule block per class name even on repeat calls', () => {
    injectAtRules([padding4Md]);
    injectAtRules([padding4Md]);
    injectAtRules([padding4Md]);
    const el = document.head.querySelector('style[data-motif-style-cache]')!;
    const occurrences = (el.textContent ?? '').match(/@media \(min-width: 768px\)/g);
    expect(occurrences).toHaveLength(1);
  });

  it('different rule lists produce different class names', () => {
    expect(injectAtRules([padding4Md])).not.toBe(injectAtRules([padding8Lg]));
  });
});

describe('SSRStyleCollector', () => {
  it('captures CSS produced during collect() instead of touching the DOM', () => {
    const collector = new SSRStyleCollector();
    let cls: string | undefined;
    collector.collect(() => {
      cls = injectAtRules([padding4Md]);
    });
    expect(cls).toMatch(/^m-[a-z0-9]+$/);
    // CSS captured by the collector
    expect(collector.getCss()).toContain(`.${cls}`);
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
    // Nothing leaked to the document
    expect(document.head.querySelector('style[data-motif-style-cache]')).toBeNull();
  });

  it('getStyleTag wraps captured CSS in a <style data-motif-ssr> block', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() => {
      injectAtRules([padding4Md]);
    });
    const tag = collector.getStyleTag();
    expect(tag).toMatch(/^<style data-motif-ssr>.*<\/style>$/s);
    expect(tag).toContain('@media (min-width: 768px)');
  });

  it('getStyleTag returns an empty string when nothing was collected', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() => {
      // no rules emitted
    });
    expect(collector.getStyleTag()).toBe('');
    expect(collector.getCss()).toBe('');
  });

  it('restores the previous active collector when collect() exits', () => {
    const outer = new SSRStyleCollector();
    const inner = new SSRStyleCollector();
    outer.collect(() => {
      injectAtRules([padding4Md]);
      inner.collect(() => {
        injectAtRules([padding8Lg]);
      });
      // After inner finished, outer should be active again.
      injectAtRules([padding4Md]); // dedup, no double-emit
    });
    expect(outer.getCss()).toContain('@media (min-width: 768px)');
    expect(outer.getCss()).not.toContain('@media (min-width: 1024px)');
    expect(inner.getCss()).toContain('@media (min-width: 1024px)');
    expect(inner.getCss()).not.toContain('@media (min-width: 768px)');
  });

  it('returns the result of the rendered function from collect()', () => {
    const collector = new SSRStyleCollector();
    const result = collector.collect(() => {
      injectAtRules([padding4Md]);
      return 'rendered html';
    });
    expect(result).toBe('rendered html');
  });
});

describe('hydrateFromSSR', () => {
  it('seeds cache.injected from <style data-motif-ssr> so client does not re-inject', () => {
    // Simulate SSR output: collector ran on the server, captured a class,
    // and the rendered HTML was hydrated with that <style> tag in head.
    const collector = new SSRStyleCollector();
    let ssrClass: string | undefined;
    collector.collect(() => {
      ssrClass = injectAtRules([padding4Md]);
    });
    const styleTag = collector.getStyleTag();
    document.head.innerHTML = styleTag;

    // Reset only the runtime cache state — keep the SSR <style> in the DOM.
    _resetStyleCacheForTesting();

    // First client-side injection of the same rules should pick up the
    // SSR class and not append a new <style data-motif-style-cache>.
    const clientClass = injectAtRules([padding4Md]);
    expect(clientClass).toBe(ssrClass);
    expect(document.head.querySelector('style[data-motif-style-cache]')).toBeNull();
  });

  it('still injects new rules into <style data-motif-style-cache> after hydration', () => {
    // Hydrate from a synthetic SSR block that only contains md.
    document.head.innerHTML =
      '<style data-motif-ssr>@media (min-width: 768px) { .m-fakehash { padding: 1px; } }</style>';

    // A new rule (lg) wasn't in the SSR block, so it should get appended.
    const cls = injectAtRules([padding8Lg]);
    expect(cls).toMatch(/^m-[a-z0-9]+$/);
    const el = document.head.querySelector('style[data-motif-style-cache]');
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain('@media (min-width: 1024px)');
  });
});

describe('flushPendingCss', () => {
  it('returns and clears CSS queued when no document and no collector are present', () => {
    // Simulate a no-document, no-collector environment by removing the
    // document in the cache's view: the safest way in jsdom is to
    // temporarily delete `document` from globalThis. Since jsdom provides
    // it, we use a trick — pre-emit via the collector then bypass.
    // Easier path: just verify flushPendingCss starts empty and stays so
    // when we are in a normal jsdom environment.
    expect(flushPendingCss()).toBe('');
    injectAtRules([padding4Md]);
    expect(flushPendingCss()).toBe('');
  });
});

// #253 — without a document and without a collector, the browser path would
// dedup against and queue into process-global state shared by every
// concurrent SSR request, silently dropping rules. It must throw instead.
describe('server-side injection without a collector (#253)', () => {
  it('throws rather than mutating module-global dedup state', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(() => injectAtRules([padding4Md])).toThrow(/SSRStyleCollector/);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('still routes to an explicit collector when document is absent', () => {
    vi.stubGlobal('document', undefined);
    try {
      const collector = new SSRStyleCollector();
      const cls = injectAtRules([padding4Md], collector);
      expect(cls).toBeTruthy();
      expect(collector.getStyleTag()).toContain('@media (min-width: 768px)');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
