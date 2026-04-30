import type { ReactNode } from 'react';
import { Clock, FilePen, Globe } from '@motif-js/icons';

export interface ArticleHeaderMetaItem {
  readonly icon?: ReactNode;
  readonly label: string;
  readonly href?: string;
}

export interface ArticleHeaderProps {
  /** Eyebrow string — section + read-time, etc. */
  eyebrow?: string;
  /** The h1. */
  title: string;
  /** Optional supporting paragraph beneath the title. */
  lede?: string;
  /** Optional row beneath the lede — clock / edit-on-github / platform. */
  meta?: ReadonlyArray<ArticleHeaderMetaItem>;
}

/**
 * Article header — eyebrow + h1 + lede + optional meta row. Used at
 * the top of every Tier-1 docs page. Style is in `site.css`
 * (`.article__head`, `.eyebrow`, `.article h1`, `.article__lede`,
 * `.article__meta`).
 */
export function ArticleHeader({ eyebrow, title, lede, meta }: ArticleHeaderProps) {
  return (
    <header className="article__head">
      {eyebrow !== undefined ? (
        <span className="eyebrow">
          <span className="eyebrow__dot" />
          {eyebrow}
        </span>
      ) : null}
      <h1>{title}</h1>
      {lede !== undefined ? <p className="article__lede">{lede}</p> : null}
      {meta !== undefined && meta.length > 0 ? (
        <div className="article__meta">
          {meta.map((item) =>
            item.href !== undefined ? (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.icon}
                {item.label}
              </a>
            ) : (
              <span key={item.label}>
                {item.icon}
                {item.label}
              </span>
            ),
          )}
        </div>
      ) : null}
    </header>
  );
}

/** Standalone eyebrow (also used outside ArticleHeader). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="eyebrow__dot" />
      {children}
    </span>
  );
}

/** Convenience: the most common meta-row icons. */
export const articleMetaIcons = {
  clock: <Clock />,
  edit: <FilePen />,
  platform: <Globe />,
} as const;
