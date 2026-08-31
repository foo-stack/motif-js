/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { Box } from './Box.js';
import { _resetDevWarningsForTesting } from './_dev-warnings.js';
import { _resetStyleCacheForTesting } from './style-cache.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): HTMLElement {
  act(() => {
    root.render(node);
  });
  return container;
}

beforeEach(() => {
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('Box - transition prop', () => {
  it('lands a literal transition string on inline style', () => {
    render(<Box transition="opacity 200ms ease" data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    expect(el.style.transition).toBe('opacity 200ms ease');
  });

  it('renders an object form to a CSS string with defaults', () => {
    render(<Box transition={{ property: 'opacity' }} data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    expect(el.style.transition).toBe('opacity 200ms ease');
  });

  it('emits CSS-var references for $durations / $easings token refs', () => {
    render(
      <Box
        transition={{
          property: 'opacity',
          duration: '$durations.3',
          easing: '$easings.standard',
        }}
        data-testid="x"
      />,
    );
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    expect(el.style.transition).toContain('var(--durations-3)');
    expect(el.style.transition).toContain('var(--easings-standard)');
  });

  it('supports an array of transitions joined with `, `', () => {
    render(
      <Box
        transition={[
          { property: 'opacity', duration: '200ms' },
          { property: 'transform', duration: '300ms', easing: 'linear' },
        ]}
        data-testid="x"
      />,
    );
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    expect(el.style.transition).toBe('opacity 200ms ease, transform 300ms linear');
  });
});

describe('Box - exitStyle prop', () => {
  it('emits a CSS rule keyed on [data-motif-state="exiting"]', () => {
    render(<Box exitStyle={{ opacity: 0 }} transition="opacity 200ms ease" data-testid="x" />);
    const styleEl = document.head.querySelector('style[data-motif-style-cache]');
    expect(styleEl?.textContent ?? '').toContain('[data-motif-state="exiting"]');
    expect(styleEl?.textContent ?? '').toMatch(/opacity:\s*0/);
  });

  it('does not apply the exit declarations until the parent toggles the data attribute', () => {
    render(<Box exitStyle={{ opacity: 0 }} transition="opacity 200ms ease" data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    // Inline style.opacity is empty (the rule applies via attribute selector).
    expect(el.style.opacity).toBe('');
  });
});

describe('Box - enterStyle prop', () => {
  it('overlays enterStyle on the first paint and removes it after rAF', async () => {
    // Capture the rAF callback so we can flush manually.
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

    render(
      <Box
        enterStyle={{ opacity: 0 }}
        transition="opacity 200ms ease"
        bg="#3b82f6"
        data-testid="x"
      />,
    );
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    expect(el.style.opacity).toBe('0');
    expect(el.style.backgroundColor).toBe('rgb(59, 130, 246)');

    // Flush the queued rAF.
    expect(rafSpy).toHaveBeenCalled();
    const cb = rafSpy.mock.calls[0]![0] as FrameRequestCallback;
    act(() => {
      cb(performance.now());
    });

    expect(el.style.opacity).toBe('');
    expect(el.style.backgroundColor).toBe('rgb(59, 130, 246)');
    rafSpy.mockRestore();
  });

  it('only pays the runtime hook cost when enterStyle is set', () => {
    // Heuristic: render a Box with no motion props; assert no rAF call
    // fired (BoxWithEnter was not dispatched to).
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(<Box bg="#3b82f6" data-testid="x" />);
    expect(rafSpy).not.toHaveBeenCalled();
    rafSpy.mockRestore();
  });
});

describe('Box - motion-without-transition warning', () => {
  it('warns when enterStyle is set without transition', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Box enterStyle={{ opacity: 0 }} data-testid="x" />);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]![0]).toContain('enterStyle');
    expect(warnSpy.mock.calls[0]![0]).toContain('transition');
    warnSpy.mockRestore();
  });

  it('does not warn when transition is set', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Box enterStyle={{ opacity: 0 }} transition="opacity 200ms" data-testid="x" />);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
