import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Theme as ThemeType } from '@usemotif/core';
import { FocusScope, Hide, LiveRegion, Overlay, Portal, Show, VisuallyHidden } from './overlay.js';
import { Theme, ThemeProvider } from './Theme.js';

const lightTheme: ThemeType = { name: 'light', tokens: { colors: { surface: { base: '#fff' } } } };
const darkTheme: ThemeType = { name: 'dark', tokens: { colors: { surface: { base: '#000' } } } };
const darkRed: ThemeType = { name: 'dark_red', tokens: { colors: { surface: { base: '#600' } } } };

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

  // #157 — restore is an unmount concern. A prop change while the scope is
  // still open must NOT run the restore and pull focus out of the live
  // scope back to the pre-open element.
  it('does not restore focus when a prop changes while still mounted', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    render(
      <FocusScope restoreFocus trapFocus>
        <button>inside</button>
      </FocusScope>,
    );
    expect((document.activeElement as HTMLElement).textContent).toBe('inside');
    // Toggle a wiring prop mid-lifecycle — must not trigger restore.
    render(
      <FocusScope restoreFocus trapFocus={false}>
        <button>inside</button>
      </FocusScope>,
    );
    expect(document.activeElement).not.toBe(trigger);
    expect((document.activeElement as HTMLElement).textContent).toBe('inside');
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

describe('FocusScope — programmatic focus capture', () => {
  it('recaptures focus when external code moves it outside (default)', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);
    render(
      <FocusScope>
        <button data-testid="inside">inside</button>
      </FocusScope>,
    );
    // Mounting auto-focuses "inside". Programmatically move focus
    // to the outside element.
    act(() => outside.focus());
    // Capture handler bounces focus back to the first focusable
    // inside the scope.
    expect((document.activeElement as HTMLElement).dataset.testid).toBe('inside');
    outside.remove();
  });

  it('respects captureFocus={false} — programmatic focus escapes the scope', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    render(
      <FocusScope captureFocus={false}>
        <button>inside</button>
      </FocusScope>,
    );
    act(() => outside.focus());
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('captureFocus follows trapFocus by default — false when trapFocus is false', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    render(
      <FocusScope trapFocus={false}>
        <button>inside</button>
      </FocusScope>,
    );
    act(() => outside.focus());
    // trapFocus=false → captureFocus defaults to false → focus stays outside.
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('removes the focusin listener on unmount', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    render(
      <FocusScope>
        <button>inside</button>
      </FocusScope>,
    );
    act(() => root.unmount());
    // After unmount, programmatic focus on the outside button must NOT
    // bounce back (the capture listener should be detached).
    act(() => outside.focus());
    expect(document.activeElement).toBe(outside);
    outside.remove();
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
    // Disable programmatic-focus capture so focus can actually live
    // outside the scope — that's the precondition this test checks.
    // With captureFocus on (the modal-style default), `outside.focus()`
    // would bounce focus back inside and the assertion couldn't be set up.
    const onEscape = vi.fn();
    render(
      <FocusScope captureFocus={false} onEscape={onEscape}>
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

describe('Portal — render target', () => {
  it('renders children outside the parent host into document.body by default', () => {
    render(
      <div data-testid="parent">
        <Portal>
          <span data-testid="portaled">hi</span>
        </Portal>
      </div>,
    );
    const parent = container.querySelector('[data-testid="parent"]')!;
    // Children land in body, not inside the parent.
    expect(parent.querySelector('[data-testid="portaled"]')).toBeNull();
    const portaled = document.body.querySelector('[data-testid="portaled"]');
    expect(portaled?.textContent).toBe('hi');
  });

  it('honours a custom `to` element', () => {
    const target = document.createElement('div');
    target.id = 'custom-target';
    document.body.appendChild(target);
    render(
      <Portal to={target}>
        <span data-testid="portaled">x</span>
      </Portal>,
    );
    expect(target.querySelector('[data-testid="portaled"]')?.textContent).toBe('x');
    target.remove();
  });

  it('does not add a wrapper when no theme is in scope', () => {
    render(
      <Portal>
        <span data-testid="portaled">x</span>
      </Portal>,
    );
    const portaled = document.body.querySelector('[data-testid="portaled"]')!;
    // Direct child of body — no theme wrapper interposed.
    expect((portaled.parentElement as HTMLElement).tagName).toBe('BODY');
  });

  it('stamps the active theme name on the portaled subtree so token vars resolve across the portal boundary', () => {
    render(
      <ThemeProvider themes={[lightTheme, darkTheme]} active="dark">
        <Portal>
          <span data-testid="portaled">x</span>
        </Portal>
      </ThemeProvider>,
    );
    const portaled = document.body.querySelector('[data-testid="portaled"]')!;
    const wrapper = portaled.closest('[data-theme]');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.getAttribute('data-theme')).toBe('dark');
  });

  it('carries the resolved nested-theme name across the portal', () => {
    render(
      <ThemeProvider themes={[lightTheme, darkTheme, darkRed]} active="dark">
        <Theme name="red">
          <Portal>
            <span data-testid="portaled">x</span>
          </Portal>
        </Theme>
      </ThemeProvider>,
    );
    const portaled = document.body.querySelector('[data-testid="portaled"]')!;
    expect(portaled.closest('[data-theme]')!.getAttribute('data-theme')).toBe('dark_red');
  });
});

describe('Overlay — scrim click', () => {
  it('fires onScrimClick when the scrim itself is clicked', () => {
    const onScrimClick = vi.fn();
    render(
      <Overlay onScrimClick={onScrimClick}>
        <button data-testid="inner">inner</button>
      </Overlay>,
    );
    // Overlay portals into body; find its scrim by inset:0 layout.
    const scrim = document.body.querySelector<HTMLElement>('[style*="position: fixed"]');
    expect(scrim).not.toBeNull();
    act(() => {
      scrim!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onScrimClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onScrimClick when an inner element is clicked', () => {
    const onScrimClick = vi.fn();
    render(
      <Overlay onScrimClick={onScrimClick}>
        <button data-testid="inner">inner</button>
      </Overlay>,
    );
    const inner = document.body.querySelector<HTMLElement>('[data-testid="inner"]');
    act(() => {
      inner!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onScrimClick).not.toHaveBeenCalled();
  });

  // #156 — a consumer onClick must NOT clobber the built-in scrim dismiss.
  it('composes a consumer onClick with the scrim dismiss', () => {
    const onScrimClick = vi.fn();
    const onClick = vi.fn();
    render(
      <Overlay onScrimClick={onScrimClick} onClick={onClick}>
        <button data-testid="inner">inner</button>
      </Overlay>,
    );
    const scrim = document.body.querySelector<HTMLElement>('[style*="position: fixed"]');
    act(() => {
      scrim!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onScrimClick).toHaveBeenCalledTimes(1);
  });
});

describe('Show / Hide — viewport visibility', () => {
  // jsdom doesn't fire window resize naturally — set window.innerWidth
  // directly and dispatch a resize to trigger the listener inside
  // useViewportMatch.
  function setViewport(width: number): void {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  it('Show above="md" renders children when viewport >= md', () => {
    setViewport(900);
    render(
      <Show above="md">
        <span data-testid="visible">visible</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="visible"]')).not.toBeNull();
  });

  it('Show above="md" hides children when viewport < md', () => {
    setViewport(500);
    render(
      <Show above="md">
        <span data-testid="visible">visible</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="visible"]')).toBeNull();
  });

  it('Hide above="md" is the inverse of Show', () => {
    setViewport(900);
    render(
      <Hide above="md">
        <span data-testid="hidden-above-md">x</span>
      </Hide>,
    );
    expect(container.querySelector('[data-testid="hidden-above-md"]')).toBeNull();
    setViewport(500);
    render(
      <Hide above="md">
        <span data-testid="hidden-above-md">x</span>
      </Hide>,
    );
    expect(container.querySelector('[data-testid="hidden-above-md"]')).not.toBeNull();
  });

  it('Show below="md" renders only when viewport < md', () => {
    setViewport(500);
    render(
      <Show below="md">
        <span data-testid="show-below">x</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="show-below"]')).not.toBeNull();
    setViewport(900);
    render(
      <Show below="md">
        <span data-testid="show-below">x</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="show-below"]')).toBeNull();
  });

  // Regression: useViewportMatch used a ref + a no-op "force" that never
  // scheduled a render, so an already-mounted Show/Hide ignored resize.
  // This asserts a resize alone (no re-render from the parent) updates it.
  it('reacts to a resize without the parent re-rendering', () => {
    setViewport(900);
    render(
      <Show above="md">
        <span data-testid="reactive">x</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="reactive"]')).not.toBeNull();
    // Shrink below md and fire resize only — do NOT call render() again.
    setViewport(500);
    expect(container.querySelector('[data-testid="reactive"]')).toBeNull();
    // And back up.
    setViewport(900);
    expect(container.querySelector('[data-testid="reactive"]')).not.toBeNull();
  });
});
