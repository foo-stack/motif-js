/** @vitest-environment jsdom */
/**
 * Covers the two authoring-parity additions to `styled()`:
 *
 *   1. **Rich fallback variants** - a fallback function's optional second
 *      argument (`VariantContext`) gives it the active theme/tokens and the
 *      component's props, so it can compute from raw token values the way a
 *      Tamagui token-category spread variant does.
 *   2. **Styled context** - `createStyledContext` lets a parent's variant
 *      (e.g. a Button's `size`) flow to its sub-components without prop
 *      threading.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createTheme } from '@usemotif/core';
import { ThemeProvider } from './Theme.js';
import { styled } from './styled.js';
import { createStyledContext, type VariantContext } from './styled-context.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactElement): void {
  act(() => {
    root.render(node);
  });
}

/** Read inline style off the element matching `selector` (camelCase keys). */
function styleOf(selector: string): Record<string, string> {
  const el = container.querySelector(selector) as HTMLElement | null;
  if (el === null) throw new Error(`No element matched ${selector}`);
  const out: Record<string, string> = {};
  for (let i = 0; i < el.style.length; i++) {
    const kebab = el.style.item(i);
    const value = el.style.getPropertyValue(kebab);
    const camel = kebab.replaceAll(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = value;
  }
  return out;
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

describe('fallback variant context', () => {
  const theme = createTheme({ name: 'test', tokens: { space: { 1: 4, 2: 8, 3: 12 } } });

  it('reads raw token values off ctx.tokens', () => {
    const SBox = styled('div', {
      variants: {
        '...step': (val: 1 | 2 | 3, ctx: VariantContext) => ({
          padding: (ctx.tokens?.space?.[val] as number | undefined) ?? 0,
        }),
      },
    });
    render(
      createElement(
        ThemeProvider,
        { themes: [theme], active: 'test' },
        <SBox step={2} data-testid="box" />,
      ),
    );
    expect(styleOf('[data-testid="box"]').padding).toBe('8px');
  });

  it('branches on sibling props via ctx.props', () => {
    const SBox = styled('div', {
      variants: {
        dense: { true: {}, false: {} },
        '...scale': (val: number, ctx: VariantContext) => ({
          padding: val * (ctx.props.dense === true ? 1 : 2),
        }),
      },
    });
    render(<SBox scale={10} dense data-testid="a" />);
    expect(styleOf('[data-testid="a"]').padding).toBe('10px');
  });

  it('the same component without dense doubles the value', () => {
    const SBox = styled('div', {
      variants: {
        dense: { true: {}, false: {} },
        '...scale': (val: number, ctx: VariantContext) => ({
          padding: val * (ctx.props.dense === true ? 1 : 2),
        }),
      },
    });
    render(<SBox scale={10} data-testid="b" />);
    expect(styleOf('[data-testid="b"]').padding).toBe('20px');
  });

  it('degrades gracefully outside a ThemeProvider (ctx.tokens undefined)', () => {
    const SBox = styled('div', {
      variants: {
        '...step': (_val: number, ctx: VariantContext) => ({
          padding: ctx.tokens === undefined ? 1 : 99,
        }),
      },
    });
    render(<SBox step={5} data-testid="c" />);
    expect(styleOf('[data-testid="c"]').padding).toBe('1px');
  });

  it('does not pass the dense variant through to the DOM', () => {
    const SBox = styled('div', {
      variants: {
        dense: { true: {}, false: {} },
        '...scale': (val: number) => ({ padding: val }),
      },
    });
    render(<SBox scale={4} dense data-testid="d" />);
    const el = container.querySelector('[data-testid="d"]') as HTMLElement;
    expect(el.getAttribute('dense')).toBeNull();
    expect(el.getAttribute('scale')).toBeNull();
  });
});

describe('createStyledContext - variant propagation', () => {
  const ButtonContext = createStyledContext({ size: 'md' });

  const Frame = styled('div', {
    context: ButtonContext,
    variants: {
      size: { sm: { padding: 4 }, md: { padding: 8 }, lg: { padding: 16 } },
    },
    defaultVariants: { size: 'md' },
  });
  const Label = styled('span', {
    context: ButtonContext,
    variants: {
      size: { sm: { fontSize: 12 }, md: { fontSize: 14 }, lg: { fontSize: 18 } },
    },
  });

  it('a child inherits the parent-provided variant value', () => {
    render(
      <Frame size="lg" data-testid="frame">
        <Label data-testid="label">x</Label>
      </Frame>,
    );
    expect(styleOf('[data-testid="frame"]').padding).toBe('16px');
    // Label has no own default; it inherits size="lg" from the Frame.
    expect(styleOf('[data-testid="label"]').fontSize).toBe('18px');
  });

  it('an explicit prop on the child overrides the inherited value', () => {
    render(
      <Frame size="lg">
        <Label size="sm" data-testid="label">
          x
        </Label>
      </Frame>,
    );
    expect(styleOf('[data-testid="label"]').fontSize).toBe('12px');
  });

  it('a standalone child falls back to the context default', () => {
    render(<Label data-testid="label">x</Label>);
    // No Frame above → context default { size: 'md' } → fontSize 14.
    expect(styleOf('[data-testid="label"]').fontSize).toBe('14px');
  });

  it('does not leak the context key as a DOM attribute', () => {
    render(
      <Frame size="lg">
        <Label data-testid="label">x</Label>
      </Frame>,
    );
    const el = container.querySelector('[data-testid="label"]') as HTMLElement;
    expect(el.getAttribute('size')).toBeNull();
  });
});

describe('createStyledContext - own defaultVariants vs context default (#300)', () => {
  it('a standalone component keeps its OWN defaultVariants over the context default', () => {
    const Ctx = createStyledContext({ size: 'md' });
    const Solo = styled('div', {
      context: Ctx,
      variants: { size: { sm: { padding: 4 }, md: { padding: 8 }, lg: { padding: 16 } } },
      // Differs from the context default ('md'): with no provider mounted the
      // component's own default must win, not the context default.
      defaultVariants: { size: 'lg' },
    });
    render(<Solo data-testid="solo">x</Solo>);
    expect(styleOf('[data-testid="solo"]').padding).toBe('16px');
  });

  it('a mounted parent still overrides a child’s own default', () => {
    const Ctx = createStyledContext({ size: 'md' });
    const Frame = styled('div', {
      context: Ctx,
      variants: { size: { sm: { padding: 4 }, md: { padding: 8 }, lg: { padding: 16 } } },
    });
    const Child = styled('span', {
      context: Ctx,
      variants: { size: { sm: { fontSize: 12 }, md: { fontSize: 14 }, lg: { fontSize: 18 } } },
      defaultVariants: { size: 'sm' },
    });
    render(
      <Frame size="lg">
        <Child data-testid="child">x</Child>
      </Frame>,
    );
    // Parent explicitly provides lg → overrides the child's own 'sm' default.
    expect(styleOf('[data-testid="child"]').fontSize).toBe('18px');
  });
});

describe('compound variants - numeric value coercion (#308)', () => {
  it('matches a numeric variant value against a string compound key', () => {
    const Comp = styled('div', {
      variants: {
        weight: { '400': { opacity: 0.4 }, '700': { opacity: 0.7 } },
        tone: { soft: {}, bold: {} },
      },
      compoundVariants: [{ weight: '700', tone: 'bold', css: { padding: 9 } }],
    });
    // Caller passes the numeric 700; the explicit loop coerces it to '700' and
    // matches - the compound matcher must String()-coerce too, or it misses.
    render(
      <Comp weight={700 as unknown as '700'} tone="bold" data-testid="c">
        x
      </Comp>,
    );
    expect(styleOf('[data-testid="c"]').padding).toBe('9px');
  });
});

describe('createStyledContext - Button parity (Frame + Text + Icon share size)', () => {
  // The canonical Tamagui Button: one `size` flows to every sub-component via
  // context, and a token-category-style fallback maps the size onto concrete
  // values - expressed here entirely within Motif's style-prop model.
  const sizes = { sm: 28, md: 36, lg: 44 } as const;
  const ButtonContext = createStyledContext({ size: 'md' });

  const Frame = styled('button', {
    context: ButtonContext,
    base: { display: 'inline-flex', alignItems: 'center' },
    variants: {
      '...size': (val: keyof typeof sizes) => ({
        height: sizes[val],
        paddingInline: sizes[val] / 4,
      }),
    },
  });
  const Text = styled('span', {
    context: ButtonContext,
    variants: {
      '...size': (val: keyof typeof sizes) => ({ fontSize: sizes[val] / 2 }),
    },
  });

  it('size set on the Frame reaches the Text sub-component', () => {
    render(
      <Frame size="lg" data-testid="frame">
        <Text data-testid="text">Go</Text>
      </Frame>,
    );
    expect(styleOf('[data-testid="frame"]').height).toBe('44px');
    expect(styleOf('[data-testid="text"]').fontSize).toBe('22px');
  });

  it('switching the Frame size re-derives every sub-component', () => {
    render(
      <Frame size="sm" data-testid="frame">
        <Text data-testid="text">Go</Text>
      </Frame>,
    );
    expect(styleOf('[data-testid="frame"]').height).toBe('28px');
    expect(styleOf('[data-testid="text"]').fontSize).toBe('14px');
  });
});
