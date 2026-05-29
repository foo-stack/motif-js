import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HoverCard } from './HoverCard.js';

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

// React delegates onMouseEnter/onFocus via the bubbling mouseover/focusin
// events — fire those (see Tooltip.test).
function fire(el: Element, type: 'mouseenter' | 'mouseleave'): void {
  const eventName = type === 'mouseenter' ? 'mouseover' : 'mouseout';
  act(() => {
    el.dispatchEvent(new MouseEvent(eventName, { bubbles: true, cancelable: true }));
  });
}

function open(): { trigger: HTMLElement } {
  render(
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <HoverCard.Trigger>
        <a href="/u/jane" data-testid="trigger">
          @jane
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content aria-label="Jane's profile">
        <a href="/u/jane/follow">Follow</a>
      </HoverCard.Content>
    </HoverCard.Root>,
  );
  const trigger = container.querySelector<HTMLElement>('[data-testid="trigger"]')!;
  fire(trigger, 'mouseenter');
  act(() => vi.advanceTimersByTime(0));
  return { trigger };
}

describe('HoverCard — trigger/content association', () => {
  it('trigger advertises the popup before opening', () => {
    render(
      <HoverCard.Root>
        <HoverCard.Trigger>
          <a href="/x" data-testid="trigger">
            x
          </a>
        </HoverCard.Trigger>
        <HoverCard.Content>card</HoverCard.Content>
      </HoverCard.Root>,
    );
    const trigger = container.querySelector('[data-testid="trigger"]')!;
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    // No dangling reference while closed.
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
  });

  it('wires aria-expanded + aria-controls to the content when open', () => {
    const { trigger } = open();
    const card = document.querySelector('[role="dialog"]')!;
    expect(card).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(card.id);
    expect(card.id).not.toBe('');
  });

  it('content is a labelled non-modal dialog', () => {
    open();
    const card = document.querySelector('[role="dialog"]')!;
    expect(card.getAttribute('aria-label')).toBe("Jane's profile");
  });
});
