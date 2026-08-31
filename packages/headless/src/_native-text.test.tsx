/** @vitest-environment jsdom */
/**
 * #222 - the default option / empty-state / toast / nav renderers used
 * to drop raw strings straight into a `Pressable` / `View`, which throws
 * RN's "Text strings must be rendered within a <Text> component"
 * invariant on a real device (the jsdom mock doesn't enforce it, which
 * is why it shipped). These tests assert the strings now land inside a
 * `Text` host - i.e. they are wrapped, not raw children.
 *
 * Runs against the `react-native` mock (aliased in vitest.config.ts):
 * View/Pressable render as `<div>`, Text as `<span data-motif-host="Text">`.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, isValidElement, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Text } from 'react-native';
import { nativeText } from './_native-text.js';
import { Combobox, MultiSelect } from './combobox.native.js';
import { CommandPalette } from './CommandPalette.native.js';
import { Toast } from './Toast.native.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

/** textContent of every `Text` host currently rendered. */
function textHostContents(): string[] {
  return Array.from(container.querySelectorAll('[data-motif-host="Text"]')).map(
    (el) => el.textContent ?? '',
  );
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
});

describe('nativeText', () => {
  it('wraps a bare string in a Text element', () => {
    const out = nativeText('hello');
    expect(isValidElement(out)).toBe(true);
    expect((out as ReactElement).type).toBe(Text);
  });

  it('wraps a bare number in a Text element', () => {
    const out = nativeText(42);
    expect(isValidElement(out)).toBe(true);
    expect((out as ReactElement).type).toBe(Text);
  });

  it('passes a consumer-supplied element through untouched (no double-wrap)', () => {
    const el = <Text>already wrapped</Text>;
    expect(nativeText(el)).toBe(el);
  });

  it('passes undefined / null through as nothing', () => {
    expect(nativeText(undefined)).toBeUndefined();
    expect(nativeText(null)).toBeNull();
  });
});

describe('Combobox default renderers (#222)', () => {
  it('wraps default option labels in a Text host', () => {
    render(
      <Combobox.Root
        options={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
        defaultOpen
      >
        <Combobox.List />
      </Combobox.Root>,
    );
    const texts = textHostContents();
    expect(texts).toContain('Apple');
    expect(texts).toContain('Banana');
  });

  it('wraps the default empty message in a Text host', () => {
    render(
      <Combobox.Root options={[]} defaultOpen>
        <Combobox.List />
      </Combobox.Root>,
    );
    expect(textHostContents()).toContain('No options');
  });
});

describe('MultiSelect default renderers (#222)', () => {
  it('wraps default option labels in a Text host', () => {
    render(
      <MultiSelect.Root
        options={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
        defaultOpen
      >
        <MultiSelect.List />
      </MultiSelect.Root>,
    );
    const texts = textHostContents();
    expect(texts).toContain('Apple');
    expect(texts).toContain('Banana');
  });

  it('renders the default empty message (previously discarded) in a Text host', () => {
    render(
      <MultiSelect.Root options={[]} defaultOpen>
        <MultiSelect.List />
      </MultiSelect.Root>,
    );
    // The string empty branch used to render an empty <View/> and drop
    // the message entirely; it must now show through a Text host.
    expect(textHostContents()).toContain('No options');
  });
});

describe('CommandPalette default empty state (#222)', () => {
  it('wraps the default "No matches" in a Text host', () => {
    render(
      <CommandPalette.Root commands={[]}>
        <CommandPalette.List renderItem={() => null} />
      </CommandPalette.Root>,
    );
    expect(textHostContents()).toContain('No matches');
  });
});

describe('Toast default renderer (#222)', () => {
  it('wraps string title and description in Text hosts', () => {
    render(<Toast item={{ id: '1', title: 'Saved!', description: 'Your changes are live' }} />);
    const texts = textHostContents();
    expect(texts).toContain('Saved!');
    expect(texts).toContain('Your changes are live');
  });
});
