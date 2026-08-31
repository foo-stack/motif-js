/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  PresenceContext,
  useExitTransitionNative,
  usePresence,
  type MotionPhase,
} from './presence-context.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  vi.useFakeTimers();
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  vi.useRealTimers();
});

/** Pull the current phase out of context for assertion. */
function PhaseProbe({ onPhase }: { onPhase: (phase: MotionPhase) => void }): ReactElement {
  const { phase } = usePresence();
  useEffect(() => {
    onPhase(phase);
  }, [onPhase, phase]);
  return <span data-testid="probe" data-phase={phase} />;
}

/** Simulate a child whose exit animation settles after `delayMs`. */
function FakeExitingChild({ delayMs }: { delayMs: number }): ReactElement {
  const presence = usePresence();
  const isExiting = presence.phase === 'exiting';
  useEffect(() => {
    if (!isExiting) return;
    const complete = presence.registerExit();
    const id = setTimeout(complete, delayMs);
    return () => clearTimeout(id);
  }, [isExiting, presence, delayMs]);
  return <span />;
}

interface HarnessProps {
  open: boolean;
  fallbackDurationMs?: number;
  onPhase: (phase: MotionPhase) => void;
  children?: ReactNode;
}

function Harness({ open, fallbackDurationMs, onPhase, children }: HarnessProps): ReactElement {
  const { shouldRender, phase, ExitBoundary } = useExitTransitionNative(open, fallbackDurationMs);
  useEffect(() => {
    onPhase(phase);
  }, [onPhase, phase]);
  if (!shouldRender) return <span data-testid="closed" />;
  return <ExitBoundary>{children ?? <PhaseProbe onPhase={onPhase} />}</ExitBoundary>;
}

describe('useExitTransitionNative — phase transitions', () => {
  it('starts in `open` when initialised with open=true', () => {
    const phases: MotionPhase[] = [];
    render(<Harness open onPhase={(p) => phases.push(p)} />);
    expect(phases.at(-1)).toBe('open');
  });

  it('starts in `closed` when initialised with open=false', () => {
    const phases: MotionPhase[] = [];
    render(<Harness open={false} onPhase={(p) => phases.push(p)} />);
    expect(phases.at(-1)).toBe('closed');
    expect(container.querySelector('[data-testid="closed"]')).not.toBeNull();
  });

  it('flips open=true → false through `exiting` and lands at `closed` via fallback timer', () => {
    const phases: MotionPhase[] = [];
    const { rerender } = renderRerender(<Harness open onPhase={(p) => phases.push(p)} />);
    rerender(<Harness open={false} onPhase={(p) => phases.push(p)} />);
    expect(phases).toContain('exiting');
    expect(phases.at(-1)).toBe('exiting');
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(phases.at(-1)).toBe('closed');
  });

  it('skips the exiting phase when fallbackDurationMs <= 0', () => {
    const phases: MotionPhase[] = [];
    const { rerender } = renderRerender(
      <Harness open fallbackDurationMs={0} onPhase={(p) => phases.push(p)} />,
    );
    rerender(<Harness open={false} fallbackDurationMs={0} onPhase={(p) => phases.push(p)} />);
    expect(phases).not.toContain('exiting');
    expect(phases.at(-1)).toBe('closed');
  });
});

describe('useExitTransitionNative — descendant signalling', () => {
  it('settles to closed as soon as the only registered exit signals', () => {
    const phases: MotionPhase[] = [];
    const { rerender } = renderRerender(
      <Harness open onPhase={(p) => phases.push(p)}>
        <FakeExitingChild delayMs={50} />
      </Harness>,
    );
    rerender(
      <Harness open={false} onPhase={(p) => phases.push(p)}>
        <FakeExitingChild delayMs={50} />
      </Harness>,
    );
    expect(phases.at(-1)).toBe('exiting');
    // Advance past the descendant's signal but before the fallback.
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(phases.at(-1)).toBe('closed');
  });

  it('waits for every registered exit before settling', () => {
    const phases: MotionPhase[] = [];
    const tree = (open: boolean) => (
      <Harness open={open} onPhase={(p) => phases.push(p)}>
        <FakeExitingChild delayMs={50} />
        <FakeExitingChild delayMs={150} />
      </Harness>
    );
    const { rerender } = renderRerender(tree(true));
    rerender(tree(false));
    act(() => {
      vi.advanceTimersByTime(60);
    });
    // First child signalled but second hasn't - still exiting.
    expect(phases.at(-1)).toBe('exiting');
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(phases.at(-1)).toBe('closed');
  });

  it('fallback timer wins when a descendant never signals', () => {
    const phases: MotionPhase[] = [];
    function StuckExit(): ReactElement {
      const presence = usePresence();
      useEffect(() => {
        if (presence.phase === 'exiting') {
          // Register but never signal - simulates a buggy driver.
          presence.registerExit();
        }
      }, [presence]);
      return <span />;
    }
    const tree = (open: boolean) => (
      <Harness open={open} onPhase={(p) => phases.push(p)}>
        <StuckExit />
      </Harness>
    );
    const { rerender } = renderRerender(tree(true));
    rerender(tree(false));
    expect(phases.at(-1)).toBe('exiting');
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(phases.at(-1)).toBe('closed');
  });
});

// #219 - the boundary used to get a new `ExitBoundary` identity on every
// phase flip, so React tore down + recreated the whole subtree the moment
// the close animation started: descendant state was wiped and children's
// entry animations replayed. The exit "worked" only by accident of that
// remount. The fix flows phase through the Provider value (a context
// update, re-rendering consumers in place), keeping identity stable.
describe('useExitTransitionNative — no remount on close (#219)', () => {
  it('keeps the subtree mounted across open → exiting (state survives, [] effect runs once)', () => {
    const mounts: number[] = [];
    let bump: (() => void) | undefined;
    function StatefulChild(): ReactElement {
      const [n, setN] = useState(0);
      bump = () => setN((x) => x + 1);
      // A mount-only effect: with the old remount bug this ran twice
      // (once per mount); with the fix it runs exactly once.
      useEffect(() => {
        mounts.push(1);
        return undefined;
      }, []);
      return <span data-testid="stateful" data-n={n} />;
    }
    const child = () => container.querySelector('[data-testid="stateful"]');

    const { rerender } = renderRerender(
      <Harness open fallbackDurationMs={5_000} onPhase={() => {}}>
        <StatefulChild />
      </Harness>,
    );
    // Mutate descendant state while open.
    act(() => {
      bump?.();
    });
    expect(child()?.getAttribute('data-n')).toBe('1');

    // Flip to exiting - held in that phase by the long fallback timer.
    rerender(
      <Harness open={false} fallbackDurationMs={5_000} onPhase={() => {}}>
        <StatefulChild />
      </Harness>,
    );

    // Subtree was NOT torn down: the mount effect ran exactly once and
    // the descendant's useState value survived the transition.
    expect(mounts).toHaveLength(1);
    expect(child()).not.toBeNull();
    expect(child()?.getAttribute('data-n')).toBe('1');
  });

  it('still settles to closed via descendant signal after the stable transition', () => {
    const phases: MotionPhase[] = [];
    const { rerender } = renderRerender(
      <Harness open onPhase={(p) => phases.push(p)}>
        <FakeExitingChild delayMs={50} />
      </Harness>,
    );
    rerender(
      <Harness open={false} onPhase={(p) => phases.push(p)}>
        <FakeExitingChild delayMs={50} />
      </Harness>,
    );
    expect(phases.at(-1)).toBe('exiting');
    act(() => {
      vi.advanceTimersByTime(60);
    });
    // The exit still completes without leaning on a remount to re-fire
    // the descendant's registration.
    expect(phases.at(-1)).toBe('closed');
  });
});

describe('usePresence — outside a boundary', () => {
  it('falls back to phase=open with a no-op registerExit', () => {
    const phases: MotionPhase[] = [];
    render(<PhaseProbe onPhase={(p) => phases.push(p)} />);
    expect(phases.at(-1)).toBe('open');
  });

  it('returns the same default value every call (no spurious context churn)', () => {
    let calls = 0;
    function Probe(): ReactElement {
      const presence = usePresence();
      useEffect(() => {
        calls++;
      }, [presence]);
      return <span />;
    }
    render(<Probe />);
    expect(calls).toBe(1);
    // Re-render with the same tree - presence identity stays stable.
    render(<Probe />);
    expect(calls).toBe(1);
  });
});

describe('PresenceContext — explicit Provider value', () => {
  it('exposes the value verbatim to descendants', () => {
    const phases: MotionPhase[] = [];
    const value = { phase: 'exiting' as const, registerExit: () => () => {} };
    render(
      <PresenceContext.Provider value={value}>
        <PhaseProbe onPhase={(p) => phases.push(p)} />
      </PresenceContext.Provider>,
    );
    expect(phases.at(-1)).toBe('exiting');
  });
});

/**
 * Tiny re-render harness - `createRoot.render` doesn't expose a
 * "rerender with different element" the way Testing Library does, so
 * we wrap the same root in a closure.
 */
function renderRerender(initial: ReactElement): { rerender: (next: ReactElement) => void } {
  render(initial);
  return {
    rerender(next) {
      act(() => {
        root.render(next);
      });
    },
  };
}
