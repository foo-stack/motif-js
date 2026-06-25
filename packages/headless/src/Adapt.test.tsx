import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { configureBreakpoints } from '@usemotif/react';
import { Dialog } from './Dialog.js';
import { Adapt } from './Adapt.js';
import { configureViewportBreakpoints } from './_breakpoint-config.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

function click(el: Element): void {
  act(() => {
    (el as HTMLElement).click();
  });
}

/** Set the jsdom viewport width before a render so the mount effect reads it. */
function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
}

/** The open dialog/drawer surface, or null when closed. */
function surface(): HTMLElement | null {
  return document.querySelector('[role="dialog"]');
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  setViewportWidth(1024);
});

const CONTENT = (
  <Adapt below="md">
    <Dialog.Title>Settings</Dialog.Title>
    <Dialog.Description>Body</Dialog.Description>
  </Adapt>
);

describe('Adapt — viewport-driven Dialog/Drawer swap', () => {
  it('renders a centered Dialog above the breakpoint (no fixed positioning)', () => {
    setViewportWidth(1024); // >= md (768)
    render(<Dialog.Root open>{CONTENT}</Dialog.Root>);
    const el = surface();
    expect(el).not.toBeNull();
    // Dialog.Content sets no inline position — the Overlay centers it.
    expect(el!.style.position).toBe('');
  });

  it('renders a bottom sheet below the breakpoint', () => {
    setViewportWidth(500); // < md
    render(<Dialog.Root open>{CONTENT}</Dialog.Root>);
    const el = surface();
    expect(el).not.toBeNull();
    // Drawer.Content (side="bottom" default) pins the surface to the bottom edge.
    expect(el!.style.position).toBe('fixed');
    expect(el!.style.bottom).toBe('0px');
    expect(el!.style.left).toBe('0px');
    expect(el!.style.right).toBe('0px');
  });

  it('honors the side prop when adapted', () => {
    setViewportWidth(500);
    render(
      <Dialog.Root open>
        <Adapt below="md" side="right">
          <Dialog.Title>Nav</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    const el = surface();
    expect(el!.style.position).toBe('fixed');
    expect(el!.style.right).toBe('0px');
    expect(el!.style.top).toBe('0px');
    expect(el!.style.bottom).toBe('0px');
  });

  it('shares the Dialog.Root open state across the swap (uncontrolled trigger)', () => {
    setViewportWidth(500);
    render(
      <Dialog.Root>
        <Dialog.Trigger>
          <button data-testid="trigger">Open</button>
        </Dialog.Trigger>
        <Adapt below="md">
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()).toBeNull();
    click(container.querySelector('[data-testid="trigger"]')!);
    const el = surface();
    expect(el).not.toBeNull();
    // Opened as a sheet, since the viewport is below the breakpoint.
    expect(el!.style.position).toBe('fixed');
  });

  it('defaults to adapting below md when no bound is given', () => {
    setViewportWidth(500);
    render(
      <Dialog.Root open>
        <Adapt>
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()!.style.position).toBe('fixed');
  });
});

describe('Adapt — configurable breakpoints', () => {
  afterEach(() => {
    configureBreakpoints({}); // restore the runtime defaults
    configureViewportBreakpoints({}); // clear the headless override
  });

  it('accepts an explicit pixel width as the bound', () => {
    setViewportWidth(780); // < 800 → adapt to a sheet
    render(
      <Dialog.Root open>
        <Adapt below={800}>
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()!.style.position).toBe('fixed');
  });

  it('does not adapt when the explicit pixel bound is not crossed', () => {
    setViewportWidth(820); // ≥ 800 → stays a centered dialog
    render(
      <Dialog.Root open>
        <Adapt below={800}>
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()!.style.position).toBe('');
  });

  it('respects the runtime breakpoint config (auto-synced via getBreakpoints)', () => {
    // 780 is ≥ the default md (768) — would NOT adapt by default. Move md to 800
    // on the runtime and the same `below="md"` now adapts at 780.
    configureBreakpoints({ md: 800 });
    setViewportWidth(780);
    render(
      <Dialog.Root open>
        <Adapt below="md">
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()!.style.position).toBe('fixed');
  });

  it('lets configureViewportBreakpoints override a name for the headless layer', () => {
    configureViewportBreakpoints({ md: 800 });
    setViewportWidth(780); // < 800 under the override → adapt
    render(
      <Dialog.Root open>
        <Adapt below="md">
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()!.style.position).toBe('fixed');
  });

  it('prefers a headless override over the runtime config', () => {
    configureBreakpoints({ md: 700 }); // runtime says md=700 (780 would not adapt)
    configureViewportBreakpoints({ md: 800 }); // headless override wins → 780 adapts
    setViewportWidth(780);
    render(
      <Dialog.Root open>
        <Adapt below="md">
          <Dialog.Title>Settings</Dialog.Title>
        </Adapt>
      </Dialog.Root>,
    );
    expect(surface()!.style.position).toBe('fixed');
  });
});
