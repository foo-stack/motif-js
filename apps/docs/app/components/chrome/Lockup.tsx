import { Link as RRLink } from 'react-router';

const M_PATH = 'M10 50 L10 14 L18 14 L32 38 L46 14 L54 14 L54 50';

/**
 * Brand lockup — outlined "M" mark + Fraunces wordmark. The styling
 * lives in `site.css` (`.lockup`, `.lockup__mark`, `.lockup__name`).
 */
export function Lockup({ to = '/' }: { to?: string }) {
  return (
    <RRLink to={to} className="lockup" aria-label="Motif home">
      <svg className="lockup__mark" viewBox="0 0 64 64" fill="none">
        <path
          d={M_PATH}
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={32} cy={38} r={2.6} fill="currentColor" />
      </svg>
      <span className="lockup__name">Motif</span>
    </RRLink>
  );
}
