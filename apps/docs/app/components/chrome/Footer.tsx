import { Link as RRLink } from 'react-router';
import { Lockup } from './Lockup';

interface FooterColumn {
  readonly title: string;
  readonly links: ReadonlyArray<{
    readonly label: string;
    readonly to: string;
    readonly external?: boolean;
  }>;
}

const COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    title: 'Documentation',
    links: [
      { label: 'Introduction', to: '/docs/introduction' },
      { label: 'Installation', to: '/docs/installation' },
      { label: 'API reference', to: '/api/box' },
      { label: 'Examples', to: '/examples' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub ↗', to: 'https://github.com/foo-stack/motif-js', external: true },
      { label: 'Discord ↗', to: 'https://discord.gg/motif', external: true },
      { label: 'X / Twitter ↗', to: 'https://twitter.com/motifjs', external: true },
      { label: 'Bluesky ↗', to: 'https://bsky.app/profile/motif.dev', external: true },
    ],
  },
  {
    title: 'Project',
    links: [
      {
        label: 'Releases',
        to: 'https://github.com/foo-stack/motif-js/releases',
        external: true,
      },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Contribute', to: '/contribute' },
      {
        label: 'License',
        to: 'https://github.com/foo-stack/motif-js/blob/main/LICENSE',
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Lockup />
          <p>
            A styling library for React, on every platform. Open source, MIT-licensed, and made by
            people who care about the craft.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="footer__col">
            <span className="footer__col-title">{col.title}</span>
            <ul>
              {col.links.map((link) =>
                link.external === true ? (
                  <li key={link.label}>
                    <a href={link.to} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <RRLink to={link.to}>{link.label}</RRLink>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        <span>© 2026 Motif. Released under the MIT License.</span>
        <span>Built with Motif.</span>
      </div>
    </footer>
  );
}
