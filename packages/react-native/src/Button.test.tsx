import type { Theme } from '@usemotif/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Box } from './Box.js';
import { Button } from './Button.js';
import { Text } from './Text.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      action: {
        primary: { bg: '#3b82f6', fg: '#ffffff', hover: '#2563eb' },
        danger: { bg: '#ef4444', fg: '#ffffff', hover: '#dc2626' },
        success: { bg: '#16a34a', fg: '#ffffff', hover: '#15803d' },
      },
      gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 900: '#111827' },
    },
    space: { 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 4: 16, 5: 20, 6: 24 },
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
    radii: { sm: 4, md: 8, lg: 12 },
    fontWeights: { semibold: 600 },
    sizes: { full: '100%' },
  },
};

/** Same theme with the `gray` scale removed — a hand-authored theme is
 * not obliged to define one (only `@usemotif/tokens` guarantees it). */
const themeNoGray: Theme = {
  name: 'no-gray',
  tokens: {
    ...theme.tokens,
    colors: {
      action: {
        primary: { bg: '#3b82f6', fg: '#ffffff', hover: '#2563eb' },
        danger: { bg: '#ef4444', fg: '#ffffff', hover: '#dc2626' },
        success: { bg: '#16a34a', fg: '#ffffff', hover: '#15803d' },
      },
    },
  },
};

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

function pressable(): HTMLElement {
  const el = container.querySelector('[data-motif-host="Pressable"]');
  if (el === null) throw new Error('No Pressable found');
  return el as HTMLElement;
}

/** The label `<Text>` host the native Button wraps a string/number
 * child in. Throws if absent — its absence is itself a regression. */
function labelNode(): HTMLElement {
  const el = container.querySelector('[data-motif-host="Text"]');
  if (el === null) throw new Error('No label Text found');
  return el as HTMLElement;
}

function styleOn(el: HTMLElement): Record<string, unknown> {
  const raw = el.getAttribute('data-motif-style');
  if (raw === null) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) {
    return parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
  }
  return parsed as Record<string, unknown>;
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

describe('native Button — variant matrix', () => {
  it('solid + primary applies primary bg to the Pressable + fg to the label', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button>X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#3b82f6');
    // The label foreground lives on the label Text, not the Pressable.
    expect(styleOn(labelNode()).color).toBe('#ffffff');
  });

  it('outline + primary makes background transparent', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button variant="outline">X</Button>
      </ThemeProvider>,
    );
    const style = styleOn(pressable());
    expect(style.backgroundColor).toBe('transparent');
    expect(style.borderColor).toBe('#3b82f6');
    expect(styleOn(labelNode()).color).toBe('#3b82f6');
  });

  it('ghost has transparent background and transparent border', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button variant="ghost">X</Button>
      </ThemeProvider>,
    );
    const style = styleOn(pressable());
    expect(style.backgroundColor).toBe('transparent');
    expect(style.borderColor).toBe('transparent');
  });

  it('intent=danger swaps to action.danger.bg', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button intent="danger">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#ef4444');
  });

  it('intent=neutral resolves to the theme gray scale', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button intent="neutral">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#e5e7eb');
  });

  it('size=xl puts box tokens on the Pressable and fontSize on the label', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button size="xl">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).paddingInline).toBe(24);
    // fontSize is a text style — it belongs on the label Text.
    expect(styleOn(labelNode()).fontSize).toBe(20);
  });
});

describe('native Button — disabled / loading / fullWidth', () => {
  it('fullWidth sets width to the $full token (100%)', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button fullWidth>X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).width).toBe('100%');
  });

  it('loading sets accessibilityState.busy', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button loading>X</Button>
      </ThemeProvider>,
    );
    const stateRaw = pressable().getAttribute('data-motif-prop-accessibilityState');
    if (stateRaw !== null) {
      const parsed = JSON.parse(stateRaw) as { busy?: boolean; disabled?: boolean };
      expect(parsed.busy).toBe(true);
      expect(parsed.disabled).toBe(true);
    }
  });
});

// Regression tests for issue #22 — native Button text labels.
describe('native Button — label rendering (#22)', () => {
  it('wraps a string child in a <Text> host so it never renders bare in the Pressable', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button>Save</Button>
      </ThemeProvider>,
    );
    const label = labelNode();
    expect(label.textContent).toBe('Save');
    // The text must be inside the Text host, not a direct text node of
    // the Pressable — RN throws "Text strings must be rendered within a
    // <Text> component" otherwise.
    expect(label.parentElement?.getAttribute('data-motif-host')).toBe('Pressable');
  });

  it('wraps a numeric child in a <Text> host', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button>{42}</Button>
      </ThemeProvider>,
    );
    expect(labelNode().textContent).toBe('42');
  });

  it('passes element children through without wrapping them in <Text>', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button>
          <Box>elemental</Box>
        </Button>
      </ThemeProvider>,
    );
    // An element child is the caller's responsibility — no label Text
    // host is synthesised around it.
    expect(container.querySelector('[data-motif-host="Text"]')).toBeNull();
    expect(container.textContent).toContain('elemental');
  });

  it('uses loadingLabel as the wrapped label while loading', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button loading loadingLabel="Saving…">
          Save
        </Button>
      </ThemeProvider>,
    );
    expect(labelNode().textContent).toBe('Saving…');
  });

  it('applies label text styles to the <Text>, not the Pressable', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button size="lg">Save</Button>
      </ThemeProvider>,
    );
    const labelStyle = styleOn(labelNode());
    expect(labelStyle.color).toBe('#ffffff'); // primary fg
    expect(labelStyle.fontSize).toBe(18); // $lg
    expect(labelStyle.fontWeight).toBe(600); // $semibold

    // …and those text styles are NOT left on the Pressable (a View
    // drops them silently — keeping them there is dead weight).
    const pressStyle = styleOn(pressable());
    expect(pressStyle.color).toBeUndefined();
    expect(pressStyle.fontSize).toBeUndefined();
    expect(pressStyle.fontWeight).toBeUndefined();
  });

  it('label text styles do not collide with an explicit <Text> child', () => {
    // Element children pass through, so a caller can fully control the
    // label — the Button must not wrap or restyle it.
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button>
          <Text color="#abcdef">custom</Text>
        </Button>
      </ThemeProvider>,
    );
    const texts = container.querySelectorAll('[data-motif-host="Text"]');
    expect(texts.length).toBe(1);
    expect(styleOn(texts[0] as HTMLElement).color).toBe('#abcdef');
  });
});

// Regression tests for issue #22 bug 3 — gray-scale fallback.
describe('native Button — neutral intent without a gray scale (#22)', () => {
  it('falls back to a literal grey when the theme defines no gray scale', () => {
    render(
      <ThemeProvider themes={[themeNoGray]} active="no-gray">
        <Button intent="neutral">X</Button>
      </ThemeProvider>,
    );
    const bg = styleOn(pressable()).backgroundColor;
    // Never an unresolved `$colors.gray.*` token string.
    expect(typeof bg).toBe('string');
    expect(bg as string).not.toMatch(/^\$/);
    expect(bg).toBe('#e5e7eb');
  });

  it('neutral label foreground also resolves without a gray scale', () => {
    render(
      <ThemeProvider themes={[themeNoGray]} active="no-gray">
        <Button intent="neutral">X</Button>
      </ThemeProvider>,
    );
    const color = styleOn(labelNode()).color;
    expect(color as string).not.toMatch(/^\$/);
    expect(color).toBe('#111827');
  });

  it('still prefers the theme gray scale when one is defined', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button intent="neutral">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#e5e7eb');
  });

  it('non-neutral intents are unaffected by a missing gray scale', () => {
    render(
      <ThemeProvider themes={[themeNoGray]} active="no-gray">
        <Button intent="danger">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#ef4444');
  });
});

describe('native Button — loading indicator', () => {
  function dotBackgrounds(): unknown[] {
    return Array.from(container.querySelectorAll('[data-motif-host="View"]'))
      .map((el) => styleOn(el as HTMLElement).backgroundColor)
      .filter((bg) => bg !== undefined);
  }

  // Regression: the default dots used bg="currentColor", which RN can't
  // resolve — the spinner rendered invisible. They must use the resolved
  // label foreground.
  it('default loading dots use the resolved label color, never currentColor', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button loading>Saving</Button>
      </ThemeProvider>,
    );
    const backgrounds = dotBackgrounds();
    expect(backgrounds).not.toContain('currentColor');
    // solid + primary → label fg is #ffffff, so the dots fill with it.
    expect(backgrounds).toContain('#ffffff');
  });
});
