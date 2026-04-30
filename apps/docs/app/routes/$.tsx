import { ArrowRight, Search } from '@motif-js/icons';
import { Link as RRLink } from 'react-router';

interface Suggestion {
  readonly label: string;
  readonly section: string;
  readonly to: string;
}

const SUGGESTIONS: ReadonlyArray<Suggestion> = [
  { label: 'Introduction', section: 'Getting started', to: '/docs/introduction' },
  { label: 'Installation', section: 'Getting started', to: '/docs/installation' },
  { label: 'Tokens', section: 'Concepts', to: '/docs/tokens' },
  { label: 'Box', section: 'API reference', to: '/api/box' },
];

export default function NotFound() {
  return (
    <div className="layout layout--centered">
      <div className="notfound">
        <h1 className="notfound__num">
          4<em>0</em>4
        </h1>
        <h2 className="notfound__title">This page does not exist.</h2>
        <p className="notfound__lede">
          It might have moved with a recent docs reorg, or you may have followed a link that has
          gone stale. Try one of the doors below — or search the docs.
        </p>
        <div className="notfound__actions">
          <RRLink to="/" className="btn btn--primary">
            Back home <ArrowRight />
          </RRLink>
          <RRLink to="/docs/introduction" className="btn btn--ghost">
            <Search /> Read the introduction
          </RRLink>
        </div>
        <div className="notfound__suggest">
          <div className="notfound__suggest-title">You might be looking for</div>
          <div className="notfound__suggest-list">
            {SUGGESTIONS.map((s) => (
              <RRLink key={s.to} to={s.to}>
                <span>{s.label}</span>
                <span>{s.section}</span>
              </RRLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
