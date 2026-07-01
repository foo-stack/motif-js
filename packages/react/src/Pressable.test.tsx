import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { _resetStyleCacheForTesting } from './style-cache.js';
import { Pressable } from './Pressable.js';

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
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('Pressable — element + behavior', () => {
  it('renders as <button> by default', () => {
    render(<Pressable>Click me</Pressable>);
    const btn = container.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('Click me');
  });

  it('respects the `as` prop (e.g. as="a")', () => {
    render(<Pressable as="a">Link</Pressable>);
    const a = container.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.textContent).toBe('Link');
  });

  it('fires onPress when clicked', () => {
    const onPress = vi.fn();
    render(<Pressable onPress={onPress}>Go</Pressable>);
    const btn = container.querySelector('button')!;
    act(() => {
      btn.click();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('falls back to onClick when onPress is not provided', () => {
    const onClick = vi.fn();
    render(<Pressable onClick={onClick}>Go</Pressable>);
    const btn = container.querySelector('button')!;
    act(() => {
      btn.click();
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire the press handler when disabled', () => {
    const onPress = vi.fn();
    render(
      <Pressable onPress={onPress} disabled>
        Go
      </Pressable>,
    );
    const btn = container.querySelector('button')!;
    act(() => {
      btn.click();
    });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('preventDefaults the click on a disabled non-button surface (no anchor nav)', () => {
    // Regression: a disabled anchor surface must call preventDefault so the
    // browser's default navigation doesn't run even though the JS handler is
    // suppressed. <button disabled> blocks this natively; <a aria-disabled>
    // does not.
    render(
      <Pressable as="a" disabled>
        Go
      </Pressable>,
    );
    const a = container.querySelector('a')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      a.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not preventDefault when enabled', () => {
    render(
      <Pressable as="a" onPress={() => {}}>
        Go
      </Pressable>,
    );
    const a = container.querySelector('a')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      a.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
  });

  it('sets the native disabled attribute on a button', () => {
    render(<Pressable disabled>Go</Pressable>);
    const btn = container.querySelector('button')!;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });

  it('sets only aria-disabled on a non-button surface', () => {
    render(
      <Pressable as="div" disabled>
        Go
      </Pressable>,
    );
    const div = container.querySelector('div')!;
    expect(div.getAttribute('aria-disabled')).toBe('true');
    // div has no `disabled` attribute
    expect(div.hasAttribute('disabled')).toBe(false);
  });

  it('defaults cursor to pointer (not-allowed when disabled)', () => {
    render(<Pressable>Go</Pressable>);
    const btn = container.querySelector('button')!;
    expect(btn.style.cursor).toBe('pointer');

    act(() => {
      root.render(<Pressable disabled>Go</Pressable>);
    });
    expect(btn.style.cursor).toBe('not-allowed');
  });
});

describe('Pressable — button type (#313)', () => {
  it('defaults a native <button> to type="button" so it never submits a form', () => {
    render(<Pressable>Go</Pressable>);
    expect(container.querySelector('button')?.getAttribute('type')).toBe('button');
  });

  it('lets the caller opt into a submit button', () => {
    render(<Pressable type="submit">Save</Pressable>);
    expect(container.querySelector('button')?.getAttribute('type')).toBe('submit');
  });

  it('does not set a type on a non-button surface', () => {
    render(
      <Pressable as="a" href="#x">
        Link
      </Pressable>,
    );
    expect(container.querySelector('a')?.hasAttribute('type')).toBe(false);
  });

  it('does not submit an enclosing form when activated', () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Pressable>Toggle</Pressable>
      </form>,
    );
    act(() => {
      container.querySelector('button')?.click();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('Pressable — pseudo-state CSS', () => {
  it('emits :hover, :focus-visible, :active, and disabled selectors', () => {
    render(
      <Pressable
        _hover={{ opacity: 0.9 }}
        _focus={{ borderWidth: 2 }}
        _active={{ opacity: 0.8 }}
        _disabled={{ opacity: 0.5 }}
      >
        Go
      </Pressable>,
    );
    const styleEl = document.head.querySelector('style[data-motif-style-cache]')!;
    const css = styleEl.textContent ?? '';
    expect(css).toMatch(/:hover/);
    expect(css).toMatch(/:focus-visible/);
    expect(css).toMatch(/:active/);
    expect(css).toMatch(/:disabled/);
    expect(css).toMatch(/\[aria-disabled="true"\]/);
  });

  it('produces stable class names across re-renders with identical state styles', () => {
    render(<Pressable _hover={{ opacity: 0.9 }}>A</Pressable>);
    const a = container.querySelector('button')?.className;
    act(() => {
      root.render(<Pressable _hover={{ opacity: 0.9 }}>B</Pressable>);
    });
    const b = container.querySelector('button')?.className;
    expect(a).toBe(b);
  });

  it('does not inject any pseudo-rules when no state props are given', () => {
    render(<Pressable>Plain</Pressable>);
    const styleEl = document.head.querySelector('style[data-motif-style-cache]');
    // no rules emitted by Pressable itself; Box doesn't inject inline-only styles
    expect(styleEl?.textContent ?? '').toBe('');
  });
});
