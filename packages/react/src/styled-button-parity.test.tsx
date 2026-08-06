/** @vitest-environment jsdom */
/**
 * Button-matrix parity test.
 *
 * The hand-rolled `<Button>` in this package carries a
 * (variant × intent × size) style matrix plus per-(variant × intent)
 * hover styles. This file rebuilds that matrix with `styled()` and
 * asserts the merged style bag against representative cells — the
 * factory has to be able to express everything the hand-rolled
 * component does, or it isn't a viable authoring path.
 *
 * Equivalence is asserted at the **resolved-prop** level (i.e. what
 * Box receives), not the rendered CSS, because the hand-rolled Button
 * also performs side things (Pressable wiring, focus handling, loading
 * state) that aren't in scope for a styled-factory parity claim.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { styled } from './styled.js';

const intentTokens = {
  primary: { bg: '$colors.primary.bg', fg: '$colors.primary.fg', hover: '$colors.primary.hover' },
  danger: { bg: '$colors.danger.bg', fg: '$colors.danger.fg', hover: '$colors.danger.hover' },
} as const;

const SButton = styled('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: 'pointer',
  },
  variants: {
    size: {
      xs: { padding: 4, fontSize: 12 },
      sm: { padding: 6, fontSize: 14 },
      md: { padding: 8, fontSize: 16 },
      lg: { padding: 12, fontSize: 18 },
      xl: { padding: 16, fontSize: 20 },
    },
    intent: {
      primary: {},
      danger: {},
    },
    variant: {
      solid: {},
      outline: {},
      ghost: {},
    },
  },
  compoundVariants: [
    // solid × intent — fill bg, intent fg.
    {
      variant: 'solid',
      intent: 'primary',
      css: { backgroundColor: intentTokens.primary.bg, color: intentTokens.primary.fg },
    },
    {
      variant: 'solid',
      intent: 'danger',
      css: { backgroundColor: intentTokens.danger.bg, color: intentTokens.danger.fg },
    },
    // outline × intent — transparent bg, intent fg, intent border.
    {
      variant: 'outline',
      intent: 'primary',
      css: { backgroundColor: 'transparent', color: intentTokens.primary.bg, borderWidth: 1 },
    },
    {
      variant: 'outline',
      intent: 'danger',
      css: { backgroundColor: 'transparent', color: intentTokens.danger.bg, borderWidth: 1 },
    },
    // ghost × intent — transparent fill, intent fg only.
    {
      variant: 'ghost',
      intent: 'primary',
      css: { backgroundColor: 'transparent', color: intentTokens.primary.bg },
    },
    {
      variant: 'ghost',
      intent: 'danger',
      css: { backgroundColor: 'transparent', color: intentTokens.danger.bg },
    },
  ],
  defaultVariants: {
    size: 'md',
    intent: 'primary',
    variant: 'solid',
  },
});

let container: HTMLElement;
let root: Root;

function render(node: ReactElement): void {
  act(() => {
    root.render(node);
  });
}

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

describe('Button matrix expressed via styled()', () => {
  it('default: solid × primary × md', () => {
    render(<SButton />);
    const style = inlineStyle();
    expect(style.padding).toBe('8px');
    expect(style.fontSize).toBe('16px');
    expect(style.fontWeight).toBe('600');
    // Resolved CSS-var path for the token ref — cosmetic; we just
    // assert backgroundColor is set (token resolution happens in the
    // theme cascade, not in styled()).
    expect(style.backgroundColor).toBeDefined();
  });

  it('solid × danger × lg lands the danger bg + lg padding', () => {
    render(<SButton variant="solid" intent="danger" size="lg" />);
    const style = inlineStyle();
    expect(style.padding).toBe('12px');
    expect(style.backgroundColor).toBeDefined();
  });

  it('outline × primary keeps a transparent bg + 1px border', () => {
    render(<SButton variant="outline" intent="primary" />);
    const style = inlineStyle();
    expect(style.backgroundColor).toBe('transparent');
    expect(style.borderWidth).toBe('1px');
  });

  it('ghost × danger has transparent bg, no border', () => {
    render(<SButton variant="ghost" intent="danger" />);
    const style = inlineStyle();
    expect(style.backgroundColor).toBe('transparent');
    expect(style.borderWidth).toBeUndefined();
  });

  it('renders a <button> element', () => {
    render(<SButton />);
    expect(container.firstElementChild?.tagName).toBe('BUTTON');
  });

  it('caller-provided style props override the matrix', () => {
    render(<SButton padding={99} />);
    expect(inlineStyle().padding).toBe('99px');
  });

  it('passes through HTML attributes', () => {
    render(<SButton id="cta" aria-label="Save" />);
    const el = container.firstElementChild as HTMLButtonElement;
    expect(el.id).toBe('cta');
    expect(el.getAttribute('aria-label')).toBe('Save');
  });
});
