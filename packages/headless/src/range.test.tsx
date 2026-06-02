import { act, createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Progress, RangeSlider, RatingInput, Slider } from './range.js';

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

function press(el: HTMLElement, key: string): void {
  act(() => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });
}

describe('Slider', () => {
  it('renders role=slider with aria-valuenow / min / max', () => {
    render(<Slider defaultValue={30} min={0} max={100} aria-label="vol" />);
    const el = container.querySelector('[role="slider"]')!;
    expect(el.getAttribute('aria-valuenow')).toBe('30');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-label')).toBe('vol');
  });

  it('ArrowRight increments by step; ArrowLeft decrements', () => {
    render(<Slider defaultValue={50} step={5} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('55');
    press(el, 'ArrowLeft');
    press(el, 'ArrowLeft');
    expect(el.getAttribute('aria-valuenow')).toBe('45');
  });

  it('Home / End jump to min / max', () => {
    render(<Slider defaultValue={50} min={10} max={90} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'Home');
    expect(el.getAttribute('aria-valuenow')).toBe('10');
    press(el, 'End');
    expect(el.getAttribute('aria-valuenow')).toBe('90');
  });

  it('PageUp / PageDown move by 10 steps', () => {
    render(<Slider defaultValue={50} step={1} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'PageUp');
    expect(el.getAttribute('aria-valuenow')).toBe('60');
    press(el, 'PageDown');
    press(el, 'PageDown');
    expect(el.getAttribute('aria-valuenow')).toBe('40');
  });

  it('clamps to min / max', () => {
    render(<Slider defaultValue={5} min={0} max={10} step={5} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'ArrowRight');
    press(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('10');
    press(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('10');
  });

  it('disabled: tabIndex -1 + aria-disabled, no keyboard updates', () => {
    const onValueChange = vi.fn();
    render(<Slider defaultValue={50} disabled onValueChange={onValueChange} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    press(el, 'ArrowRight');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('orientation=vertical sets aria-orientation', () => {
    render(<Slider defaultValue={50} orientation="vertical" />);
    const el = container.querySelector('[role="slider"]')!;
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('controlled mode: value comes from prop; onValueChange fires but parent state controls', () => {
    const onValueChange = vi.fn();
    render(<Slider value={20} onValueChange={onValueChange} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    expect(el.getAttribute('aria-valuenow')).toBe('20');
    press(el, 'ArrowRight');
    expect(onValueChange).toHaveBeenCalledWith(21);
    // Still 20 — controlled, no parent state.
    expect(el.getAttribute('aria-valuenow')).toBe('20');
  });

  // Regression: pointermove/pointerup were attached on pointerdown and only
  // removed on pointerup — never on pointercancel, and never on unmount. A
  // touch cancel (or a Slider that unmounts mid-drag) leaked the move
  // listener and kept calling onValueChange.
  describe('pointer drag teardown', () => {
    function prepTrack(): HTMLElement {
      const track = container.querySelector<HTMLElement>('[role="slider"]')!;
      track.setPointerCapture = () => {};
      track.releasePointerCapture = () => {};
      track.getBoundingClientRect = () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 10,
          right: 100,
          bottom: 10,
          x: 0,
          y: 0,
        }) as DOMRect;
      return track;
    }
    function fire(track: HTMLElement, type: string, clientX: number): void {
      act(() => {
        track.dispatchEvent(new MouseEvent(type, { clientX, clientY: 5, bubbles: true }));
      });
    }

    it('stops updating after pointercancel', () => {
      const onValueChange = vi.fn();
      render(<Slider value={20} min={0} max={100} onValueChange={onValueChange} />);
      const track = prepTrack();
      fire(track, 'pointerdown', 30);
      fire(track, 'pointermove', 40); // drag updates while pressed
      expect(onValueChange).toHaveBeenCalled();
      onValueChange.mockClear();
      fire(track, 'pointercancel', 0); // touch cancel must tear down
      fire(track, 'pointermove', 90); // no listener → no update
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('removes the move listener on unmount (no update after unmount)', () => {
      const onValueChange = vi.fn();
      render(<Slider value={20} min={0} max={100} onValueChange={onValueChange} />);
      const track = prepTrack();
      fire(track, 'pointerdown', 30);
      onValueChange.mockClear();
      act(() => root.unmount());
      fire(track, 'pointermove', 90); // listener should be gone
      expect(onValueChange).not.toHaveBeenCalled();
      // Re-create the root so the shared afterEach unmount is a no-op-safe call.
      root = createRoot(container);
    });
  });
});

describe('RangeSlider', () => {
  it('renders two slider thumbs with split min/max', () => {
    render(<RangeSlider defaultValue={[20, 80]} min={0} max={100} />);
    const thumbs = container.querySelectorAll('[role="slider"]');
    expect(thumbs.length).toBe(2);
    // Lower thumb's max is the upper thumb's value.
    expect(thumbs[0]!.getAttribute('aria-valuenow')).toBe('20');
    expect(thumbs[0]!.getAttribute('aria-valuemax')).toBe('80');
    // Upper thumb's min is the lower thumb's value.
    expect(thumbs[1]!.getAttribute('aria-valuenow')).toBe('80');
    expect(thumbs[1]!.getAttribute('aria-valuemin')).toBe('20');
  });

  it('lower thumb increments without crossing the upper thumb', () => {
    render(<RangeSlider defaultValue={[20, 30]} step={5} />);
    const thumbs = container.querySelectorAll<HTMLElement>('[role="slider"]');
    press(thumbs[0]!, 'ArrowRight');
    expect(thumbs[0]!.getAttribute('aria-valuenow')).toBe('25');
  });

  // #167 — when thumbs sit together, pushing one past the other must not
  // swap their identities (the old code sorted the pair, so moving thumb 0
  // up landed the larger value at index 1 and corrupted per-thumb ARIA).
  it('lower thumb pushed up into the upper thumb does not swap identities', () => {
    render(<RangeSlider defaultValue={[50, 50]} step={1} />);
    const thumbs = container.querySelectorAll<HTMLElement>('[role="slider"]');
    press(thumbs[0]!, 'ArrowRight');
    // Thumb 0 is capped at thumb 1 and stays put; thumb 1 must NOT have
    // absorbed the move (would read 51 under the old sort-after behavior).
    expect(thumbs[0]!.getAttribute('aria-valuenow')).toBe('50');
    expect(thumbs[1]!.getAttribute('aria-valuenow')).toBe('50');
    expect(thumbs[0]!.getAttribute('aria-valuemax')).toBe('50');
  });

  it('upper thumb pushed down into the lower thumb does not swap identities', () => {
    render(<RangeSlider defaultValue={[50, 50]} step={1} />);
    const thumbs = container.querySelectorAll<HTMLElement>('[role="slider"]');
    press(thumbs[1]!, 'ArrowLeft');
    expect(thumbs[1]!.getAttribute('aria-valuenow')).toBe('50');
    expect(thumbs[0]!.getAttribute('aria-valuenow')).toBe('50');
    expect(thumbs[1]!.getAttribute('aria-valuemin')).toBe('50');
  });

  it('disabled: keyboard updates are no-ops', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} disabled onValueChange={onValueChange} />);
    const thumbs = container.querySelectorAll<HTMLElement>('[role="slider"]');
    press(thumbs[0]!, 'ArrowRight');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Progress', () => {
  it('determinate: aria-valuenow / valuemin / valuemax set', () => {
    render(<Progress value={42} max={100} aria-label="loading" />);
    const el = container.querySelector('[role="progressbar"]')!;
    expect(el.getAttribute('aria-valuenow')).toBe('42');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('indeterminate (value=null): aria-valuenow omitted', () => {
    render(<Progress value={null} aria-label="loading" />);
    const el = container.querySelector('[role="progressbar"]')!;
    expect(el.getAttribute('aria-valuenow')).toBeNull();
  });
});

describe('RatingInput', () => {
  function renderItem(info: { index: number; filled: boolean; half: boolean }): ReactElement {
    return createElement(
      'span',
      { 'data-testid': `star-${info.index}`, 'data-filled': info.filled, 'data-half': info.half },
      info.filled ? '★' : info.half ? '½' : '☆',
    );
  }

  it('renders count items + role=slider container', () => {
    render(<RatingInput defaultValue={3} count={5} renderItem={renderItem} />);
    const stars = container.querySelectorAll('[data-testid^="star-"]');
    expect(stars.length).toBe(5);
    expect(container.querySelector('[role="slider"]')).not.toBeNull();
  });

  it('value reflects in filled / half flags', () => {
    render(<RatingInput value={3} count={5} renderItem={renderItem} />);
    expect(container.querySelector('[data-testid="star-0"]')!.getAttribute('data-filled')).toBe(
      'true',
    );
    expect(container.querySelector('[data-testid="star-2"]')!.getAttribute('data-filled')).toBe(
      'true',
    );
    expect(container.querySelector('[data-testid="star-3"]')!.getAttribute('data-filled')).toBe(
      'false',
    );
  });

  it('allowHalf: value=2.5 marks star index 2 as half', () => {
    render(<RatingInput value={2.5} count={5} allowHalf renderItem={renderItem} />);
    expect(container.querySelector('[data-testid="star-2"]')!.getAttribute('data-half')).toBe(
      'true',
    );
  });

  it('ArrowRight increments by 1 (default step)', () => {
    render(<RatingInput defaultValue={2} count={5} renderItem={renderItem} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('3');
  });

  it('ArrowRight increments by 0.5 with allowHalf', () => {
    render(<RatingInput defaultValue={2} count={5} allowHalf renderItem={renderItem} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('2.5');
  });

  it('Home/End jump to 0 / count', () => {
    render(<RatingInput defaultValue={3} count={5} renderItem={renderItem} />);
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'Home');
    expect(el.getAttribute('aria-valuenow')).toBe('0');
    press(el, 'End');
    expect(el.getAttribute('aria-valuenow')).toBe('5');
  });

  it('disabled: keyboard input is a no-op', () => {
    const onValueChange = vi.fn();
    render(
      <RatingInput
        defaultValue={2}
        count={5}
        disabled
        onValueChange={onValueChange}
        renderItem={renderItem}
      />,
    );
    const el = container.querySelector<HTMLElement>('[role="slider"]')!;
    press(el, 'ArrowRight');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
