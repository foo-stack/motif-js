import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip.js';

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

/**
 * React 19 delegates onMouseEnter / onMouseLeave / onFocus / onBlur
 * via the document-level `mouseover` / `mouseout` / `focusin` /
 * `focusout` events (the bubbling cousins of the non-bubbling
 * native pairs). Fire those instead.
 */
function fire(el: Element, type: 'mouseenter' | 'mouseleave' | 'focus' | 'blur'): void {
  const eventName =
    type === 'mouseenter'
      ? 'mouseover'
      : type === 'mouseleave'
        ? 'mouseout'
        : type === 'focus'
          ? 'focusin'
          : 'focusout';
  const Ctor = type.startsWith('mouse') ? MouseEvent : FocusEvent;
  act(() => {
    el.dispatchEvent(new Ctor(eventName, { bubbles: true, cancelable: true }));
  });
}

describe('Tooltip', () => {
  it('does not render content initially', () => {
    render(
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button data-testid="trigger">i</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('opens on mouseenter after openDelay', () => {
    render(
      <Tooltip.Root openDelay={200}>
        <Tooltip.Trigger>
          <button data-testid="trigger">i</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    fire(container.querySelector('[data-testid="trigger"]')!, 'mouseenter');
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    act(() => vi.advanceTimersByTime(200));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Hint');
  });

  // #168 — a role="tooltip" is not an interactive hover target: it must be
  // pointerEvents:none with no hover-keepalive, so it can't be parked open
  // by moving the cursor onto it.
  it('content is non-interactive (pointerEvents:none, no hover handlers)', () => {
    render(
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <button data-testid="trigger">i</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    fire(container.querySelector('[data-testid="trigger"]')!, 'mouseenter');
    act(() => vi.advanceTimersByTime(0));
    const tip = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tip).not.toBeNull();
    expect(tip.style.pointerEvents).toBe('none');
  });

  it('closes on mouseleave after closeDelay', () => {
    render(
      <Tooltip.Root openDelay={0} closeDelay={150}>
        <Tooltip.Trigger>
          <button data-testid="trigger">i</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    const trigger = container.querySelector('[data-testid="trigger"]')!;
    fire(trigger, 'mouseenter');
    act(() => vi.advanceTimersByTime(0));
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    fire(trigger, 'mouseleave');
    act(() => vi.advanceTimersByTime(150));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('opens on focus + closes on blur (keyboard parity)', () => {
    render(
      <Tooltip.Root openDelay={0} closeDelay={0}>
        <Tooltip.Trigger>
          <button data-testid="trigger">i</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    const trigger = container.querySelector('[data-testid="trigger"]')!;
    fire(trigger, 'focus');
    act(() => vi.advanceTimersByTime(0));
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    fire(trigger, 'blur');
    act(() => vi.advanceTimersByTime(0));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('Trigger gets aria-describedby pointing to the content id when open', () => {
    render(
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <button data-testid="trigger">i</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint</Tooltip.Content>
      </Tooltip.Root>,
    );
    const trigger = container.querySelector('[data-testid="trigger"]')!;
    fire(trigger, 'mouseenter');
    act(() => vi.advanceTimersByTime(0));
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).not.toBeNull();
    expect(document.getElementById(describedBy!)?.getAttribute('role')).toBe('tooltip');
  });
});
