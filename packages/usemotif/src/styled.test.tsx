/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
import * as React from 'react';
import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { styled, type VariantProps } from './styled.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactElement): void {
  act(() => {
    root.render(node);
  });
}

/** Helper: read the inline style applied to the rendered host element.
 * Keys are returned in camelCase (matching the JS `style` API), so
 * `inlineStyle().fontWeight` works the same as the React DOM convention. */
function inlineStyle(): Record<string, string> {
  const el = container.firstElementChild as HTMLElement | null;
  if (el === null) throw new Error('No element rendered');
  const out: Record<string, string> = {};
  for (let i = 0; i < el.style.length; i++) {
    const kebab = el.style.item(i);
    const value = el.style.getPropertyValue(kebab);
    out[kebab] = value;
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

describe('styled() — base styles', () => {
  it('applies base style props on every render', () => {
    const SBox = styled('div', { base: { padding: 8, color: 'red' } });
    render(<SBox />);
    const style = inlineStyle();
    expect(style.padding).toBe('8px');
    expect(style.color).toBe('red');
  });

  it('renders the underlying element when Component is a string', () => {
    const SButton = styled('button', { base: { color: 'blue' } });
    render(<SButton />);
    expect(container.firstElementChild?.tagName).toBe('BUTTON');
  });

  it('caller-supplied style props override base values', () => {
    const SBox = styled('div', { base: { padding: 8 } });
    render(<SBox padding={16} />);
    expect(inlineStyle().padding).toBe('16px');
  });

  it('an explicit undefined prop does not erase the base value', () => {
    // Regression: `<SBox bg={cond ? 'red' : undefined} />` must keep the
    // base color when the ternary yields undefined, not wipe it.
    const SBox = styled('div', { base: { color: 'red' } });
    render(<SBox color={undefined} />);
    expect(inlineStyle().color).toBe('red');
  });

  it('passes through HTML attributes (aria, data, id) to the rendered element', () => {
    const SBox = styled('div', { base: { color: 'red' } });
    render(<SBox id="hero" aria-label="banner" data-testid="hb" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.id).toBe('hero');
    expect(el.getAttribute('aria-label')).toBe('banner');
    expect(el.getAttribute('data-testid')).toBe('hb');
  });
});

describe('styled() — variants', () => {
  const SBox = styled('div', {
    variants: {
      size: {
        sm: { padding: 4 },
        md: { padding: 8 },
        lg: { padding: 16 },
      },
    },
  });

  it('selects the matching variant by string value', () => {
    render(<SBox size="md" />);
    expect(inlineStyle().padding).toBe('8px');
  });

  it('does nothing when no variant value is given and no default', () => {
    render(<SBox />);
    expect(inlineStyle().padding).toBeUndefined();
  });

  it('caller style props win over the resolved variant', () => {
    render(<SBox size="md" padding={32} />);
    expect(inlineStyle().padding).toBe('32px');
  });

  it('strips variant props from the rendered DOM (does not pass through as attrs)', () => {
    render(<SBox size="md" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('size')).toBeNull();
  });
});

describe('styled() — boolean variants', () => {
  const SBox = styled('div', {
    variants: {
      active: {
        true: { color: 'red' },
        false: { color: 'gray' },
      },
    },
  });

  it('accepts native boolean true', () => {
    render(<SBox active />);
    expect(inlineStyle().color).toBe('red');
  });

  it('accepts native boolean false', () => {
    render(<SBox active={false} />);
    expect(inlineStyle().color).toBe('gray');
  });
});

describe('styled() — defaultVariants', () => {
  const SBox = styled('div', {
    variants: {
      size: { sm: { padding: 4 }, md: { padding: 8 } },
    },
    defaultVariants: { size: 'md' },
  });

  it('falls back to the default when prop is omitted', () => {
    render(<SBox />);
    expect(inlineStyle().padding).toBe('8px');
  });

  it('caller-provided value overrides the default', () => {
    render(<SBox size="sm" />);
    expect(inlineStyle().padding).toBe('4px');
  });

  // #258 — an explicit `undefined` variant value must fall through to the
  // default, not clobber it (which dropped the default's styles entirely).
  // At runtime this arises from `size={cond ? 'sm' : undefined}`; the loose
  // cast just lets the test pass the explicit `undefined` past
  // exactOptionalPropertyTypes.
  it('explicit undefined variant prop falls back to the default', () => {
    const Loose = SBox as React.FC<{ size?: 'sm' | 'md' | undefined }>;
    render(<Loose size={undefined} />);
    expect(inlineStyle().padding).toBe('8px');
  });
});

describe('styled() — compoundVariants', () => {
  const SBtn = styled('button', {
    base: { fontWeight: 600 },
    variants: {
      intent: {
        primary: { color: 'blue' },
        danger: { color: 'red' },
      },
      size: {
        sm: { padding: 4 },
        lg: { padding: 16 },
      },
    },
    compoundVariants: [
      { intent: 'primary', size: 'lg', css: { fontWeight: 800 } },
      { intent: 'danger', size: 'lg', css: { opacity: 0.9 } },
    ],
  });

  it('applies compound styles when all matchers match', () => {
    render(<SBtn intent="primary" size="lg" />);
    expect(inlineStyle().fontWeight).toBe('800');
  });

  it('does not apply when matchers diverge', () => {
    render(<SBtn intent="primary" size="sm" />);
    // Base fontWeight wins because compound did not match.
    expect(inlineStyle().fontWeight).toBe('600');
  });

  it('multiple compound entries work independently', () => {
    render(<SBtn intent="danger" size="lg" />);
    const style = inlineStyle();
    expect(style.opacity).toBe('0.9');
    expect(style.fontWeight).toBe('600');
  });
});

describe("styled() — '...'-fallback variants", () => {
  it('matches an explicit value first', () => {
    const SBox = styled('div', {
      variants: {
        size: { sm: { padding: 4 } },
        '...size': (_val: string) => ({ padding: 99 }),
      },
    });
    render(<SBox size="sm" />);
    expect(inlineStyle().padding).toBe('4px');
  });

  it('falls back to the function for non-enumerated values', () => {
    const SBox = styled('div', {
      variants: {
        size: { sm: { padding: 4 } },
        '...size': (val: number) => ({ padding: val }),
      },
    });
    // 24 isn't in the explicit record — fallback fn runs.
    render(<SBox size={24 as unknown as 'sm'} />);
    expect(inlineStyle().padding).toBe('24px');
  });

  it('works with a fallback-only variant (no explicit record)', () => {
    const SBox = styled('div', {
      variants: {
        '...gap': (val: number) => ({ gap: val }),
      },
    });
    render(<SBox gap={12 as unknown as never} />);
    expect(inlineStyle().gap).toBe('12px');
  });

  it('compound variants do not match against fallback-supplied values', () => {
    const SBtn = styled('button', {
      base: { color: 'black' },
      variants: {
        size: { sm: { padding: 4 } },
        '...size': (val: number) => ({ padding: val }),
      },
      compoundVariants: [{ size: 'sm', css: { color: 'red' } }],
    });
    // Caller passes a number that matches via fallback — compound
    // looking for 'sm' should NOT fire.
    render(<SBtn size={20 as unknown as 'sm'} />);
    expect(inlineStyle().color).toBe('black');
  });
});

describe('styled() — composing on existing components', () => {
  it('forwards merged style props to a custom React component', () => {
    function Inner(props: { padding?: number; color?: string }): ReactElement {
      return <div style={{ padding: props.padding, color: props.color }} data-inner="1" />;
    }
    const SInner = styled(Inner, { base: { padding: 12, color: 'green' } });
    render(<SInner />);
    const div = container.querySelector('[data-inner="1"]') as HTMLElement;
    expect(div.style.padding).toBe('12px');
    expect(div.style.color).toBe('green');
  });
});

describe('styled() — displayName', () => {
  it('uses styled.<tag> for string components', () => {
    const SBox = styled('div', { base: { padding: 4 } });
    expect((SBox as { displayName?: string }).displayName).toBe('styled.div');
  });

  it('wraps the inner displayName for component-typed components', () => {
    function Inner(): ReactElement {
      return <div />;
    }
    Inner.displayName = 'Inner';
    const SInner = styled(Inner, { base: { padding: 4 } });
    expect((SInner as { displayName?: string }).displayName).toBe('styled(Inner)');
  });

  it('falls back to function name when displayName is missing', () => {
    function Anonymous(): ReactElement {
      return <div />;
    }
    const SInner = styled(Anonymous, { base: {} });
    expect((SInner as { displayName?: string }).displayName).toBe('styled(Anonymous)');
  });
});

describe('styled() — type inference', () => {
  it('derives an explicit variant prop as a key union', () => {
    const SBox = styled('div', {
      variants: {
        size: { sm: { padding: 4 }, md: { padding: 8 }, lg: { padding: 16 } },
      },
    });
    type Props = React.ComponentProps<typeof SBox>;
    expectTypeOf<Props['size']>().toEqualTypeOf<'sm' | 'md' | 'lg' | undefined>();
  });

  it('derives a boolean variant as native boolean', () => {
    const SBox = styled('div', {
      variants: { active: { true: { color: 'red' }, false: { color: 'gray' } } },
    });
    type Props = React.ComponentProps<typeof SBox>;
    expectTypeOf<Props['active']>().toEqualTypeOf<boolean | undefined>();
  });

  it('derives a fallback-fn variant as the function arg type', () => {
    const SBox = styled('div', {
      variants: { '...size': (val: number) => ({ padding: val }) },
    });
    type Props = React.ComponentProps<typeof SBox>;
    expectTypeOf<Props['size']>().toEqualTypeOf<number | undefined>();
  });

  it('mixes explicit + fallback into a single union prop', () => {
    const SBox = styled('div', {
      variants: {
        size: { sm: { padding: 4 } },
        '...size': (val: number) => ({ padding: val }),
      },
    });
    type Props = React.ComponentProps<typeof SBox>;
    expectTypeOf<Props['size']>().toEqualTypeOf<'sm' | number | undefined>();
  });

  it('VariantProps<V> exposes the same prop union for downstream re-use', () => {
    const config = {
      variants: { size: { sm: { padding: 4 }, md: { padding: 8 } } },
    } as const;
    type V = typeof config.variants;
    expectTypeOf<VariantProps<V>['size']>().toEqualTypeOf<'sm' | 'md' | undefined>();
  });
});
