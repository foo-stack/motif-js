import type { ReactNode } from 'react';
import { AlertOctagon, AlertTriangle, Info, Lightbulb } from '@motif-js/icons';

export type CalloutKind = 'info' | 'tip' | 'warning' | 'danger' | 'note';

export interface CalloutProps {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}

const ICONS = {
  info: Info,
  note: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
  danger: AlertOctagon,
} as const;

const DEFAULT_TITLES = {
  info: 'Note',
  note: 'Note',
  tip: 'Tip',
  warning: 'Heads up',
  danger: 'Caution',
} as const;

/**
 * Bordered callout block. Hairline left edge in the variant color,
 * faint tinted background, glyph + optional title. Style lives in
 * `site.css` (`.callout`, `.callout--*`).
 */
export function Callout({ kind = 'info', title, children }: CalloutProps) {
  const Icon = ICONS[kind];
  const resolvedTitle = title ?? DEFAULT_TITLES[kind];
  return (
    <aside className={`callout callout--${kind}`}>
      <div className="callout__icon">
        <Icon />
      </div>
      <div>
        <div className="callout__title">{resolvedTitle}</div>
        <div className="callout__body">{children}</div>
      </div>
    </aside>
  );
}
