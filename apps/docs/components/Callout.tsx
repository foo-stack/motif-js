import { styled } from '@motif-js/react';
import type { ReactNode } from 'react';
import { Danger, Info, Tip, Warn } from './icons.js';

type Variant = 'info' | 'warning' | 'tip' | 'danger';

const ICONS: Record<Variant, typeof Info> = {
  info: Info,
  warning: Warn,
  tip: Tip,
  danger: Danger,
};

const DEFAULT_TITLES: Record<Variant, string> = {
  info: 'Note',
  warning: 'Heads up',
  tip: 'Tip',
  danger: 'Caution',
};

// Variants drive only the things that change per-variant (border-left and the
// inherited `color` that the icon picks up via `currentColor`). Layout, base
// border, padding, and radius live in the `.callout` CSS class (see
// theme/article.css) — those props aren't in motif's style-prop schema, so
// declaring them here would leak them as HTML attributes.
const Wrapper = styled('aside', {
  base: {
    borderLeftColor: 'var(--accent)',
    color: 'var(--accent)',
  },
  variants: {
    variant: {
      info: { borderLeftColor: 'var(--info)', color: 'var(--info)' },
      warning: { borderLeftColor: 'var(--warning)', color: 'var(--warning)' },
      tip: { borderLeftColor: 'var(--success)', color: 'var(--success)' },
      danger: { borderLeftColor: 'var(--error)', color: 'var(--error)' },
    },
  },
  defaultVariants: { variant: 'info' },
});

export interface CalloutProps {
  children: ReactNode;
  title?: ReactNode;
  variant?: Variant;
}

export function Callout({ children, title, variant = 'info' }: CalloutProps) {
  const Icon = ICONS[variant];
  return (
    <Wrapper variant={variant} className="callout">
      <span className="callout__icon" aria-hidden="true">
        <Icon />
      </span>
      <div>
        <div className="callout__title">{title ?? DEFAULT_TITLES[variant]}</div>
        <div className="callout__body">{children}</div>
      </div>
    </Wrapper>
  );
}
