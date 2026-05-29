import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Calendar, DatePicker, TimeInput } from './datetime.js';

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

const JUNE_15_2024 = new Date(2024, 5, 15); // Saturday

describe('Calendar — render shape', () => {
  it('renders role="grid" with month label aria-label', () => {
    render(<Calendar defaultValue={JUNE_15_2024} locale="en-US" />);
    const grid = container.querySelector('[role="grid"]')!;
    expect(grid.getAttribute('aria-label')).toMatch(/June.*2024/);
  });

  it('renders 7 columnheaders + 42 gridcells (6 weeks × 7 days)', () => {
    render(<Calendar defaultValue={JUNE_15_2024} locale="en-US" />);
    expect(container.querySelectorAll('[role="columnheader"]').length).toBe(7);
    expect(container.querySelectorAll('[role="gridcell"]').length).toBe(42);
  });

  it('ships built-in layout so the month is a 7-column grid, not a vertical line', () => {
    render(<Calendar defaultValue={JUNE_15_2024} locale="en-US" />);
    // Rows lay their cells out horizontally instead of stacking — this is
    // the core "not a vertical line" guard.
    const rows = container.querySelectorAll<HTMLElement>('[role="row"]');
    expect(rows.length).toBe(7);
    for (const row of rows) {
      expect(row.style.display).toBe('flex');
    }
    // Cells carry the equal-column style (`flex: 1 1 0; min-width: 0`).
    // jsdom's cssstyle doesn't round-trip the `flex` shorthand, so assert
    // the min-width longhand to confirm the cell style object applied.
    for (const cell of container.querySelectorAll<HTMLElement>(
      '[role="gridcell"], [role="columnheader"]',
    )) {
      expect(cell.style.minWidth).toMatch(/^0(px)?$/);
    }
  });

  it('forwards the grid `style` prop to the role="grid" container', () => {
    render(<Calendar defaultValue={JUNE_15_2024} style={{ gap: '4px' }} />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    expect(grid.style.gap).toBe('4px');
  });

  it('selected day carries aria-selected="true"', () => {
    render(<Calendar defaultValue={JUNE_15_2024} />);
    const selected = container.querySelector('[aria-selected="true"]')!;
    expect(selected.textContent).toBe('15');
  });

  it('focused day has tabIndex=0; others tabIndex=-1', () => {
    render(<Calendar defaultValue={JUNE_15_2024} />);
    const focused = Array.from(container.querySelectorAll('[role="gridcell"]')).filter(
      (el) => el.getAttribute('tabindex') === '0',
    );
    expect(focused.length).toBe(1);
    expect(focused[0]!.textContent).toBe('15');
  });

  it('weekStartsOn changes the first column', () => {
    render(<Calendar defaultValue={JUNE_15_2024} weekStartsOn={1} locale="en-US" />);
    // With weekStartsOn=1 (Monday), the first cell of June 2024 is May 27
    // (a Monday).
    const first = container.querySelector('[role="gridcell"]')!;
    expect(first.textContent).toBe('27');
  });
});

describe('Calendar — click selection', () => {
  it('clicking a cell sets aria-selected on it and clears the previous', () => {
    render(<Calendar defaultValue={JUNE_15_2024} />);
    const cells = container.querySelectorAll<HTMLElement>('[role="gridcell"]');
    const target = Array.from(cells).find((el) => el.textContent === '20')!;
    act(() => {
      target.click();
    });
    expect(target.getAttribute('aria-selected')).toBe('true');
    const oldSelected = Array.from(cells).find((el) => el.textContent === '15')!;
    expect(oldSelected.getAttribute('aria-selected')).toBe('false');
  });

  it('isDisabled gates click selection', () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        defaultValue={JUNE_15_2024}
        onValueChange={onValueChange}
        isDisabled={(d) => d.getDate() === 20}
      />,
    );
    const cells = container.querySelectorAll<HTMLElement>('[role="gridcell"]');
    const target = Array.from(cells).find((el) => el.textContent === '20')!;
    expect(target.getAttribute('aria-disabled')).toBe('true');
    act(() => {
      target.click();
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Calendar — keyboard navigation', () => {
  it('ArrowRight moves focus by 1 day', () => {
    render(<Calendar defaultValue={JUNE_15_2024} />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    press(grid, 'ArrowRight');
    const focused = Array.from(container.querySelectorAll('[role="gridcell"]')).find(
      (el) => el.getAttribute('tabindex') === '0',
    )!;
    expect(focused.textContent).toBe('16');
  });

  it('ArrowDown moves focus by 7 days (one row)', () => {
    render(<Calendar defaultValue={JUNE_15_2024} />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    press(grid, 'ArrowDown');
    const focused = Array.from(container.querySelectorAll('[role="gridcell"]')).find(
      (el) => el.getAttribute('tabindex') === '0',
    )!;
    expect(focused.textContent).toBe('22');
  });

  it('PageDown advances by one month', () => {
    render(<Calendar defaultValue={JUNE_15_2024} locale="en-US" />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    press(grid, 'PageDown');
    expect(grid.getAttribute('aria-label')).toMatch(/July.*2024/);
  });

  it('PageUp goes back one month', () => {
    render(<Calendar defaultValue={JUNE_15_2024} locale="en-US" />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    press(grid, 'PageUp');
    expect(grid.getAttribute('aria-label')).toMatch(/May.*2024/);
  });

  it('Enter on focused day selects it', () => {
    const onValueChange = vi.fn();
    render(<Calendar defaultValue={JUNE_15_2024} onValueChange={onValueChange} />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    press(grid, 'ArrowRight'); // focus → 16
    press(grid, 'Enter');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]![0]?.getDate()).toBe(16);
  });

  // Regression: the roving tabIndex never moved real DOM focus, so AT got
  // no announcement as the user navigated. With focus already on a cell,
  // an arrow key must move document.activeElement to the new cell.
  it('moves real DOM focus to the new cell when focus is in the grid', () => {
    render(<Calendar defaultValue={JUNE_15_2024} />);
    const focusedCell = Array.from(
      container.querySelectorAll<HTMLElement>('[role="gridcell"]'),
    ).find((el) => el.getAttribute('tabindex') === '0')!;
    act(() => focusedCell.focus());
    expect(document.activeElement?.textContent).toBe('15');
    press(focusedCell, 'ArrowRight');
    expect(document.activeElement?.textContent).toBe('16');
  });

  // Regression: Home/End used unnormalised getDay() math, so on a Sunday
  // with weekStartsOn=1 Home moved forward instead of back to the week
  // start. June 16 2024 is a Sunday; with a Monday week start its week
  // runs Mon Jun 10 → Sun Jun 16.
  it('Home/End respect weekStartsOn (Monday) for a focused Sunday', () => {
    const sunday = new Date(2024, 5, 16);
    render(<Calendar defaultValue={sunday} weekStartsOn={1} />);
    const grid = container.querySelector<HTMLElement>('[role="grid"]')!;
    const focusedDay = (): string =>
      Array.from(container.querySelectorAll('[role="gridcell"]')).find(
        (el) => el.getAttribute('tabindex') === '0',
      )!.textContent ?? '';
    press(grid, 'Home');
    expect(focusedDay()).toBe('10'); // back to Monday, not forward
    press(grid, 'End');
    expect(focusedDay()).toBe('16'); // Sunday is the last day of the week
  });
});

describe('DatePicker', () => {
  it('renders a default trigger button with placeholder', () => {
    render(<DatePicker placeholder="Pick a date" />);
    const trigger = container.querySelector('button')!;
    expect(trigger.textContent).toBe('Pick a date');
  });

  it('formats the value via Intl.DateTimeFormat', () => {
    render(<DatePicker value={JUNE_15_2024} locale="en-US" />);
    const trigger = container.querySelector('button')!;
    expect(trigger.textContent).toMatch(/Jun\.?(?:e)? 15, 2024/);
  });

  it('clicking trigger opens the calendar via the wrapping Popover', () => {
    render(<DatePicker defaultValue={JUNE_15_2024} />);
    expect(document.body.querySelector('[role="grid"]')).toBeNull();
    const trigger = container.querySelector('button')!;
    act(() => {
      trigger.click();
    });
    expect(document.body.querySelector('[role="grid"]')).not.toBeNull();
  });

  it('forwards `style` to the inner Calendar grid', () => {
    render(<DatePicker defaultValue={JUNE_15_2024} style={{ gap: '8px' }} />);
    act(() => {
      container.querySelector('button')!.click();
    });
    const grid = document.body.querySelector<HTMLElement>('[role="grid"]')!;
    expect(grid.style.gap).toBe('8px');
  });
});

describe('TimeInput', () => {
  it('renders <input type="time">', () => {
    render(<TimeInput />);
    const input = container.querySelector('input')!;
    expect(input.type).toBe('time');
  });

  it('precision="second" sets step=1', () => {
    render(<TimeInput precision="second" />);
    const input = container.querySelector<HTMLInputElement>('input')!;
    expect(input.step).toBe('1');
  });

  it('explicit step overrides precision', () => {
    render(<TimeInput precision="second" step={60} />);
    const input = container.querySelector<HTMLInputElement>('input')!;
    expect(input.step).toBe('60');
  });
});
