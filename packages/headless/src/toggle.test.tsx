import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Checkbox, Radio, RadioGroup, Switch } from './toggle.js';

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

describe('Switch', () => {
  it('renders an input[type=checkbox] with role="switch"', () => {
    render(<Switch />);
    const el = container.querySelector('input')!;
    expect(el.type).toBe('checkbox');
    expect(el.getAttribute('role')).toBe('switch');
  });

  it('honours invalid → aria-invalid', () => {
    render(<Switch invalid />);
    const el = container.querySelector('input')!;
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('forwards checked + onChange', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} />);
    const el = container.querySelector('input')!;
    expect(el.checked).toBe(false);
    act(() => {
      el.click();
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Checkbox', () => {
  it('renders an input[type=checkbox] without role override', () => {
    render(<Checkbox />);
    const el = container.querySelector('input')!;
    expect(el.type).toBe('checkbox');
    expect(el.getAttribute('role')).toBeNull();
  });

  it('indeterminate sets the DOM property AND aria-checked="mixed"', () => {
    render(<Checkbox indeterminate />);
    const el = container.querySelector<HTMLInputElement>('input')!;
    expect(el.indeterminate).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('mixed');
  });

  it('clearing indeterminate flips the DOM property back', () => {
    function Wrapper(): React.ReactElement {
      const [ind, setInd] = useState(true);
      return (
        <>
          <Checkbox indeterminate={ind} />
          <button data-testid="toggle" onClick={() => setInd(false)} />
        </>
      );
    }
    render(<Wrapper />);
    const el = container.querySelector<HTMLInputElement>('input')!;
    expect(el.indeterminate).toBe(true);
    act(() => {
      container.querySelector<HTMLButtonElement>('[data-testid="toggle"]')!.click();
    });
    expect(el.indeterminate).toBe(false);
    expect(el.getAttribute('aria-checked')).toBeNull();
  });

  it('invalid → aria-invalid', () => {
    render(<Checkbox invalid />);
    expect(container.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('RadioGroup + Radio', () => {
  it('renders role="radiogroup" + child radios share the group name', () => {
    render(
      <RadioGroup defaultValue="a" aria-label="choose">
        <Radio value="a" />
        <Radio value="b" />
      </RadioGroup>,
    );
    const group = container.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute('aria-label')).toBe('choose');
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(inputs.length).toBe(2);
    // Same group name → inputs are mutually exclusive.
    expect(inputs[0]!.name).toBe(inputs[1]!.name);
  });

  it('selecting one radio deselects the others (uncontrolled)', () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" data-testid="ra" />
        <Radio value="b" data-testid="rb" />
      </RadioGroup>,
    );
    const a = container.querySelector<HTMLInputElement>('[data-testid="ra"]')!;
    const b = container.querySelector<HTMLInputElement>('[data-testid="rb"]')!;
    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
    act(() => {
      b.click();
    });
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
  });

  it('controlled mode: external onValueChange fires; value persists from the prop', () => {
    const onValueChange = vi.fn();
    function Wrapper(): React.ReactElement {
      return (
        <RadioGroup value="a" onValueChange={onValueChange}>
          <Radio value="a" data-testid="ra" />
          <Radio value="b" data-testid="rb" />
        </RadioGroup>
      );
    }
    render(<Wrapper />);
    const b = container.querySelector<HTMLInputElement>('[data-testid="rb"]')!;
    act(() => {
      b.click();
    });
    expect(onValueChange).toHaveBeenCalledWith('b');
    // Value didn't actually change (controlled, no parent state) - `a`
    // is still the source of truth.
    expect(container.querySelector<HTMLInputElement>('[data-testid="ra"]')!.checked).toBe(true);
  });

  it('throws when Radio is used outside a RadioGroup', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<Radio value="a" />);
    }).toThrow(/RadioGroup/);
    spy.mockRestore();
  });

  it('explicit `name` prop overrides the generated one', () => {
    render(
      <RadioGroup name="custom-group" defaultValue="a">
        <Radio value="a" />
      </RadioGroup>,
    );
    expect(container.querySelector<HTMLInputElement>('input')!.name).toBe('custom-group');
  });
});
