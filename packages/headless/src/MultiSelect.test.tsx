import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MultiSelect } from './combobox.js';

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

function press(key: string): void {
  const active = document.activeElement ?? document.body;
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  act(() => {
    active.dispatchEvent(event);
  });
}

const langs: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'go', label: 'Go' },
  { value: 'rs', label: 'Rust' },
  { value: 'py', label: 'Python', disabled: true },
];

function ChipDemo({
  initial = [],
  onChange,
  maxSelections,
  enableSelectAll,
}: {
  initial?: string[];
  onChange?: (next: readonly string[]) => void;
  maxSelections?: number;
  enableSelectAll?: boolean;
}): React.ReactElement {
  const [value, setValue] = useState<readonly string[]>(initial);
  return (
    <MultiSelect.Root
      options={langs}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      {...(maxSelections !== undefined ? { maxSelections } : {})}
      {...(enableSelectAll === true ? { enableSelectAll: true } : {})}
    >
      <MultiSelect.Chips
        renderChip={(opt, { remove }) => (
          <span data-testid="chip" data-value={opt.value}>
            {opt.label}
            <button data-testid={`remove-${opt.value}`} onClick={remove}>
              x
            </button>
          </span>
        )}
      />
      <MultiSelect.Input placeholder="Pick langs" />
      <MultiSelect.List />
      {enableSelectAll === true ? (
        <MultiSelect.SelectAll>
          <button data-testid="select-all">All</button>
        </MultiSelect.SelectAll>
      ) : null}
    </MultiSelect.Root>
  );
}

describe('MultiSelect — selection', () => {
  it('toggles a value into the selection on Enter', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo onChange={(v) => (captured = v)} />);
    const input = container.querySelector('input')! as HTMLInputElement;
    act(() => input.focus());
    press('ArrowDown');
    press('Enter');
    expect(captured).toEqual(['ts']);
  });

  it('toggles off when the selected value is selected again', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo initial={['ts']} onChange={(v) => (captured = v)} />);
    const input = container.querySelector('input')! as HTMLInputElement;
    act(() => input.focus());
    press('ArrowDown');
    press('Enter');
    expect(captured).toEqual([]);
  });

  it('skips disabled options on Enter', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo onChange={(v) => (captured = v)} />);
    const input = container.querySelector('input')! as HTMLInputElement;
    act(() => input.focus());
    // 5 options; index 4 is the disabled "Python".
    press('ArrowDown');
    press('ArrowDown');
    press('ArrowDown');
    press('ArrowDown');
    press('ArrowDown');
    press('Enter');
    expect(captured).toEqual([]);
  });

  it('sets aria-multiselectable on the listbox', () => {
    render(<ChipDemo />);
    const input = container.querySelector('input')! as HTMLInputElement;
    act(() => input.focus());
    const listbox = document.querySelector('[role="listbox"]')!;
    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('renders a chip per selected value', () => {
    render(<ChipDemo initial={['ts', 'go']} />);
    const chips = container.querySelectorAll('[data-testid="chip"]');
    expect(chips).toHaveLength(2);
    const values = Array.from(chips).map((c) => c.getAttribute('data-value'));
    expect(values).toEqual(['ts', 'go']);
  });

  it('removes a chip when its remove button is clicked', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo initial={['ts', 'go']} onChange={(v) => (captured = v)} />);
    const remove = container.querySelector('[data-testid="remove-ts"]')! as HTMLButtonElement;
    act(() => remove.click());
    expect(captured).toEqual(['go']);
  });

  it('Backspace at empty input pops the last chip', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo initial={['ts', 'go']} onChange={(v) => (captured = v)} />);
    const input = container.querySelector('input')! as HTMLInputElement;
    act(() => input.focus());
    press('Backspace');
    expect(captured).toEqual(['ts']);
  });

  it('respects maxSelections (further additions are no-ops)', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo onChange={(v) => (captured = v)} maxSelections={2} />);
    const input = container.querySelector('input')! as HTMLInputElement;
    act(() => input.focus());
    press('ArrowDown');
    press('Enter'); // ts
    press('ArrowDown');
    press('Enter'); // js
    press('ArrowDown');
    press('Enter'); // would be go but capped
    expect(captured).toEqual(['ts', 'js']);
  });
});

describe('MultiSelect — SelectAll', () => {
  it('throws when used without enableSelectAll', () => {
    // Suppress React's error console for this throw test.
    const consoleErr = console.error;
    console.error = () => {};
    expect(() =>
      render(
        <MultiSelect.Root options={langs}>
          <MultiSelect.SelectAll>
            <button>All</button>
          </MultiSelect.SelectAll>
        </MultiSelect.Root>,
      ),
    ).toThrow();
    console.error = consoleErr;
  });

  it('selects every non-disabled filtered option', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo enableSelectAll onChange={(v) => (captured = v)} />);
    const all = container.querySelector('[data-testid="select-all"]')! as HTMLButtonElement;
    act(() => all.click());
    expect(captured).toEqual(['ts', 'js', 'go', 'rs']);
  });

  it('toggles back to empty when everything filtered is already selected', () => {
    let captured: readonly string[] = [];
    render(
      <ChipDemo
        enableSelectAll
        initial={['ts', 'js', 'go', 'rs']}
        onChange={(v) => (captured = v)}
      />,
    );
    const all = container.querySelector('[data-testid="select-all"]')! as HTMLButtonElement;
    act(() => all.click());
    expect(captured).toEqual([]);
  });

  it('reports aria-checked=mixed when partial', () => {
    render(<ChipDemo enableSelectAll initial={['ts']} />);
    const all = container.querySelector('[data-testid="select-all"]')!;
    expect(all.getAttribute('aria-checked')).toBe('mixed');
  });

  it('respects maxSelections during select-all', () => {
    let captured: readonly string[] = [];
    render(<ChipDemo enableSelectAll maxSelections={2} onChange={(v) => (captured = v)} />);
    const all = container.querySelector('[data-testid="select-all"]')! as HTMLButtonElement;
    act(() => all.click());
    expect(captured).toHaveLength(2);
  });
});
