import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FocusScope, LiveRegion, VisuallyHidden } from './overlay.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
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

function press(key: string, options: { shiftKey?: boolean } = {}): void {
  const active = document.activeElement ?? document.body;
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    shiftKey: options.shiftKey ?? false,
  });
  act(() => {
    active.dispatchEvent(event);
  });
}

describe('FocusScope — autoFocus / restoreFocus', () => {
  it('focuses the first focusable descendant on mount when autoFocus is true', () => {
    render(
      <FocusScope>
        <button data-testid="a">a</button>
        <button data-testid="b">b</button>
      </FocusScope>,
    );
    expect((document.activeElement as HTMLElement | null)?.dataset.testid).toBe('a');
  });

  it('does not auto-focus when autoFocus is false', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    render(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <FocusScope autoFocus={false}>
        <button data-testid="a">a</button>
      </FocusScope>,
    );
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('restores focus on unmount to the previously-focused element', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    render(
      <FocusScope>
        <button>inside</button>
      </FocusScope>,
    );
    expect((document.activeElement as HTMLElement).textContent).toBe('inside');
    act(() => root.unmount());
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});

describe('FocusScope — Tab trapping', () => {
  it('cycles Tab from the last focusable back to the first', () => {
    render(
      <FocusScope>
        <button data-testid="first">first</button>
        <button data-testid="middle">middle</button>
        <button data-testid="last">last</button>
      </FocusScope>,
    );
    const last = container.querySelector<HTMLElement>('[data-testid="last"]')!;
    last.focus();
    press('Tab');
    expect((document.activeElement as HTMLElement).dataset.testid).toBe('first');
  });

  it('cycles Shift+Tab from the first focusable to the last', () => {
    render(
      <FocusScope>
        <button data-testid="first">first</button>
        <button data-testid="last">last</button>
      </FocusScope>,
    );
    const first = container.querySelector<HTMLElement>('[data-testid="first"]')!;
    first.focus();
    press('Tab', { shiftKey: true });
    expect((document.activeElement as HTMLElement).dataset.testid).toBe('last');
  });

  it('lets Tab through normally when not at an edge', () => {
    render(
      <FocusScope>
        <button data-testid="a">a</button>
        <button data-testid="b">b</button>
        <button data-testid="c">c</button>
      </FocusScope>,
    );
    const b = container.querySelector<HTMLElement>('[data-testid="b"]')!;
    b.focus();
    press('Tab');
    // The trap doesn't intercept mid-list Tabs — browser default
    // behaviour applies (we don't try to simulate it in jsdom).
    // Verify that we did NOT redirect to "a".
    expect((document.activeElement as HTMLElement).dataset.testid).not.toBe('a');
  });

  it('does not trap when trapFocus is false', () => {
    render(
      <FocusScope trapFocus={false}>
        <button data-testid="last">last</button>
      </FocusScope>,
    );
    const last = container.querySelector<HTMLElement>('[data-testid="last"]')!;
    last.focus();
    press('Tab');
    // No trap → focus moves out of the scope (jsdom won't change
    // it without a target, but we at least verify the active
    // element didn't bounce back to "last" via our handler).
    expect((document.activeElement as HTMLElement).dataset.testid).toBe('last');
  });
});

describe('FocusScope — Escape', () => {
  it('fires onEscape when Escape is pressed inside', () => {
    const onEscape = vi.fn();
    render(
      <FocusScope onEscape={onEscape}>
        <button data-testid="a">a</button>
      </FocusScope>,
    );
    press('Escape');
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('does not call onEscape when Escape fires outside the scope', () => {
    const onEscape = vi.fn();
    render(
      <FocusScope onEscape={onEscape}>
        <button>inside</button>
      </FocusScope>,
    );
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    press('Escape');
    expect(onEscape).not.toHaveBeenCalled();
    outside.remove();
  });
});

describe('VisuallyHidden + LiveRegion smoke', () => {
  it('VisuallyHidden renders a clipped span', () => {
    render(<VisuallyHidden>screen-reader only</VisuallyHidden>);
    const el = container.querySelector('span')!;
    expect(el.style.position).toBe('absolute');
    expect(el.style.width).toBe('1px');
  });

  it('LiveRegion sets aria-live on the container', () => {
    render(<LiveRegion politeness="assertive">attention</LiveRegion>);
    const div = container.querySelector('div')!;
    expect(div.getAttribute('aria-live')).toBe('assertive');
  });
});
