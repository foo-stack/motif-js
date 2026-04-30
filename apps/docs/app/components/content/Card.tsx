import type { ReactNode } from 'react';
import { ArrowRight } from '@motif-js/icons';
import { Link as RRLink } from 'react-router';

export interface HomeCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  cta?: string;
  external?: boolean;
}

/**
 * Home-page navigation card. Lives inside `<div className="home__cards">`
 * which uses a 2-column grid with a 1px hairline gap (background
 * tint shows through). Style in `site.css` (`.home-card`).
 */
export function HomeCard({
  to,
  icon,
  title,
  description,
  cta = 'Learn more',
  external = false,
}: HomeCardProps) {
  const inner = (
    <>
      <div className="home-card__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="home-card__title">{title}</h3>
      <p className="home-card__desc">{description}</p>
      <span className="home-card__cta">
        {cta}
        <ArrowRight className="home-card__arrow" />
      </span>
    </>
  );
  if (external) {
    return (
      <a className="home-card" href={to} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <RRLink className="home-card" to={to}>
      {inner}
    </RRLink>
  );
}

/** Backwards-compatible plain card for MDX. Wraps content in a paper
 *  surface with a hairline border. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 8,
        background: 'var(--bg-paper)',
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

Card.Link = function CardLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <RRLink
      to={to}
      style={{
        display: 'block',
        border: '1px solid var(--line)',
        borderRadius: 8,
        background: 'var(--bg-paper)',
        padding: 20,
        color: 'inherit',
        textDecoration: 'none',
        transition: 'border-color 160ms var(--ease)',
      }}
    >
      {children}
    </RRLink>
  );
};
