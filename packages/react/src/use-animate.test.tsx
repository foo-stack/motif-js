/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useAnimate } from './use-animate.js';

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
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

/**
 * jsdom doesn't ship a working Web Animations API. Stub
 * `Element.animate` to return a controllable handle that records the
 * call shape and resolves `finished` when we tell it to. Tests assert
 * on the recorded call shape and use `resolve()` to step the sequence.
 */
interface FakeAnimation {
  keyframes: Keyframe;
  options: KeyframeAnimationOptions;
  finished: Promise<void>;
  resolveFinished: () => void;
  rejectFinished: () => void;
  cancel: () => void;
  pause: () => void;
  play: () => void;
  listeners: Map<string, () => void>;
  addEventListener: (event: string, cb: () => void) => void;
}

let recorded: FakeAnimation[] = [];

beforeEach(() => {
  recorded = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Element.prototype as any).animate = function (
    keyframes: Keyframe,
    options: KeyframeAnimationOptions,
  ): FakeAnimation {
    let resolveFinished!: () => void;
    let rejectFinished!: () => void;
    const finished = new Promise<void>((res, rej) => {
      resolveFinished = res;
      rejectFinished = rej;
    });
    const listeners = new Map<string, () => void>();
    const anim: FakeAnimation = {
      keyframes,
      options,
      finished,
      resolveFinished: () => {
        resolveFinished();
        listeners.get('finish')?.();
      },
      rejectFinished: () => {
        rejectFinished();
        listeners.get('cancel')?.();
      },
      cancel: () => {
        anim.rejectFinished();
      },
      pause: () => undefined,
      play: () => undefined,
      listeners,
      addEventListener: (event, cb) => {
        listeners.set(event, cb);
      },
    };
    recorded.push(anim);
    return anim;
  };
});

describe('useAnimate', () => {
  it('returns a scope ref and an animate function', () => {
    let scope: { current: HTMLElement | null } | undefined;
    let animateFn: unknown;
    function Probe(): null {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return null;
    }
    render(<Probe />);
    expect(scope).toBeDefined();
    expect(scope!.current).toBeNull();
    expect(typeof animateFn).toBe('function');
  });

  it('animates the scope ref target with passed keyframes and options', () => {
    let scope!: { current: HTMLElement | null };
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} data-testid="scope" />;
    }
    render(<Probe />);
    expect(scope.current).not.toBeNull();

    act(() => {
      animateFn(scope, { opacity: 0.5 }, { duration: 0.4, easing: 'linear' });
    });

    expect(recorded.length).toBe(1);
    expect(recorded[0]!.keyframes).toEqual({ opacity: 0.5 });
    expect(recorded[0]!.options.duration).toBe(400);
    expect(recorded[0]!.options.easing).toBe('linear');
    expect(recorded[0]!.options.fill).toBe('forwards');
  });

  it('resolves selector targets to every match inside the scope', () => {
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      animateFn = a;
      return (
        <div ref={s as React.Ref<HTMLDivElement>}>
          <span className="row" />
          <span className="row" />
          <span className="row" />
        </div>
      );
    }
    render(<Probe />);

    act(() => {
      animateFn('.row', { opacity: 0 });
    });

    expect(recorded.length).toBe(3);
    for (const a of recorded) {
      expect(a.keyframes).toEqual({ opacity: 0 });
    }
  });

  it('applies default duration / easing when not specified', () => {
    let scope!: { current: HTMLElement | null };
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} />;
    }
    render(<Probe />);

    act(() => {
      animateFn(scope, { opacity: 1 });
    });

    expect(recorded[0]!.options.duration).toBe(300);
    expect(recorded[0]!.options.easing).toBe('ease-in-out');
    expect(recorded[0]!.options.delay).toBe(0);
  });

  it('returns controls whose finished promise resolves when the animation finishes', async () => {
    let scope!: { current: HTMLElement | null };
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} />;
    }
    render(<Probe />);

    let settled = false;
    let controls!: ReturnType<typeof animateFn>;
    act(() => {
      controls = animateFn(scope, { opacity: 1 });
    });
    controls.finished.then(() => {
      settled = true;
    });
    expect(settled).toBe(false);

    await act(async () => {
      recorded[0]!.resolveFinished();
      await controls.finished;
    });
    expect(settled).toBe(true);
  });

  // #205 - finished must REJECT when an animation is cancelled, per the
  // documented AnimationControls.finished contract; consumers try/catch to
  // detect a cancelled sequence.
  it('rejects the finished promise when an animation is cancelled', async () => {
    let scope!: { current: HTMLElement | null };
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} />;
    }
    render(<Probe />);

    let controls!: ReturnType<typeof animateFn>;
    act(() => {
      controls = animateFn(scope, { opacity: 1 });
    });

    let rejected = false;
    const guard = controls.finished.catch(() => {
      rejected = true;
    });
    act(() => {
      controls.cancel();
    });
    await guard;
    expect(rejected).toBe(true);
  });

  it('returns immediately-resolved controls when no targets match', async () => {
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} />;
    }
    render(<Probe />);

    const controls = animateFn('.nope', { opacity: 0 });
    await controls.finished;
    expect(recorded.length).toBe(0);
  });

  it('cancels in-flight animations on unmount', () => {
    let scope!: { current: HTMLElement | null };
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} />;
    }
    render(<Probe />);

    act(() => {
      animateFn(scope, { opacity: 0 }, { duration: 1 });
    });

    const cancelSpy = vi.spyOn(recorded[0]!, 'cancel');
    act(() => root.unmount());
    expect(cancelSpy).toHaveBeenCalled();

    // Re-create root for the afterEach unmount path.
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  it('exposes cancel / pause / play on the controls handle', () => {
    let scope!: { current: HTMLElement | null };
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): ReactNode {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return <div ref={s as React.Ref<HTMLDivElement>} />;
    }
    render(<Probe />);

    let controls!: ReturnType<typeof animateFn>;
    act(() => {
      controls = animateFn(scope, { opacity: 0 });
    });
    const pauseSpy = vi.spyOn(recorded[0]!, 'pause');
    const playSpy = vi.spyOn(recorded[0]!, 'play');
    controls.pause();
    controls.play();
    expect(pauseSpy).toHaveBeenCalled();
    expect(playSpy).toHaveBeenCalled();
  });
});
