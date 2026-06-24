/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Box, type BoxProps } from './Box.js';
import { registerMotionDriver } from './_animation/index.js';
import { waapiDriver } from './_animation/waapi.js';
import { useExitPresence } from './_animation/presence-context.js';
import { _resetStyleCacheForTesting } from './style-cache.js';
import { _resetDevWarningsForTesting } from './_dev-warnings.js';

interface RecordedAnimation {
  readonly keyframes: unknown;
  readonly options: KeyframeAnimationOptions | number | undefined;
  cancel: () => void;
  finish: () => void;
  readonly finished: Promise<void>;
}

const EXIT: NonNullable<BoxProps['exitStyle']> = { opacity: 0 };
// Asymmetric: the exit carries its OWN transition (350ms) — different from the
// base (200ms) — so the off-thread exit must run on 350, not 200.
const EXIT_ASYM: NonNullable<BoxProps['exitStyle']> = {
  opacity: 0,
  transition: 'opacity 350ms ease-in',
};

let recorded: RecordedAnimation[] = [];
let cancelled = 0;
let container: HTMLElement;
let root: Root;

function render(node: ReactElement | null): void {
  act(() => {
    root.render(node);
  });
}

function Overlay({
  open,
  exit = EXIT,
}: {
  open: boolean;
  exit?: NonNullable<BoxProps['exitStyle']>;
}): ReactElement | null {
  const { shouldRender, ExitBoundary } = useExitPresence(open, 400);
  if (!shouldRender) return null;
  return (
    <ExitBoundary>
      <Box exitStyle={exit} transition="opacity 200ms ease" data-testid="surface">
        x
      </Box>
    </ExitBoundary>
  );
}

// jsdom doesn't expand the `transition` shorthand into `transitionDuration`, so
// stub getComputedStyle to read the first time token off the element's inline
// `transition` — the same value a real browser resolves (incl. the temporary
// exit-transition override the WAAPI driver applies before reading).
function stubComputedTransition(el: Element): CSSStyleDeclaration {
  const t = (el as HTMLElement).style?.transition ?? '';
  const duration = /(-?[\d.]+m?s)/.exec(t)?.[1] ?? '';
  const parts = t.trim().split(/\s+/);
  const timing = parts.length >= 3 ? parts[2]! : 'ease';
  return { transitionDuration: duration, transitionTimingFunction: timing } as CSSStyleDeclaration;
}

beforeEach(() => {
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  recorded = [];
  cancelled = 0;
  vi.stubGlobal('getComputedStyle', stubComputedTransition);
  (Element.prototype as unknown as { animate: unknown }).animate = function (
    keyframes: unknown,
    options: KeyframeAnimationOptions | number | undefined,
  ): RecordedAnimation {
    let resolveFinished!: () => void;
    let rejectFinished!: () => void;
    const finished = new Promise<void>((resolve, reject) => {
      resolveFinished = resolve;
      rejectFinished = () => reject(new DOMException('cancelled', 'AbortError'));
    });
    finished.catch(() => {});
    const anim: RecordedAnimation = {
      keyframes,
      options,
      cancel: (): void => {
        cancelled += 1;
        rejectFinished();
      },
      finish: (): void => resolveFinished(),
      finished,
    };
    recorded.push(anim);
    return anim;
  };
  registerMotionDriver(waapiDriver);
});

afterEach(() => {
  registerMotionDriver(null);
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  delete (Element.prototype as unknown as { animate?: unknown }).animate;
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Box exit under a presence boundary + WAAPI (off-thread, interruptible)', () => {
  it('plays the exit off-thread and unmounts when it finishes', async () => {
    render(<Overlay open />);
    expect(container.querySelector('[data-testid="surface"]')).not.toBeNull();
    // No exit animation while open.
    expect(recorded).toHaveLength(0);

    // Close → the boundary holds the surface mounted (exiting) and the driver
    // drives the leave off the main thread.
    render(<Overlay open={false} />);
    expect(container.querySelector('[data-testid="surface"]')).not.toBeNull();
    expect(recorded).toHaveLength(1);
    expect(recorded[0]!.keyframes).toEqual([{}, { opacity: 0 }]);
    expect(recorded[0]!.options).toMatchObject({ fill: 'forwards' });

    // The exit finishing settles the boundary → unmount.
    await act(async () => {
      recorded[0]!.finish();
      await Promise.resolve();
    });
    expect(container.querySelector('[data-testid="surface"]')).toBeNull();
  });

  it('interrupted exit (re-opened mid-leave) cancels and keeps the surface mounted', async () => {
    render(<Overlay open />);
    render(<Overlay open={false} />);
    expect(recorded).toHaveLength(1);

    // Re-open before the exit finishes → cancel, no unmount.
    render(<Overlay open />);
    expect(cancelled).toBe(1);
    await act(async () => {
      await Promise.resolve();
    });
    expect(container.querySelector('[data-testid="surface"]')).not.toBeNull();
  });

  it('runs the off-thread exit on the exitStyle transition (asymmetric duration)', () => {
    render(<Overlay open exit={EXIT_ASYM} />);
    render(<Overlay open={false} exit={EXIT_ASYM} />);
    expect(recorded).toHaveLength(1);
    // The exit uses its own 350ms duration, not the base 200ms.
    expect((recorded[0]!.options as KeyframeAnimationOptions).duration).toBe(350);
  });
});
