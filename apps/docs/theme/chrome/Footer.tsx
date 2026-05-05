import { Monogram } from './icons.js';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a className="lockup" href="/">
            <Monogram className="lockup__mark" />
            <span className="lockup__name">Motif</span>
          </a>
          <p>
            Cross-platform React styling for web, native, and desktop. Warm, editorial, ergonomic.
          </p>
        </div>

        <div className="footer__col">
          <span className="footer__col-title">Resources</span>
          <ul>
            <li>
              <a href="/getting-started/introduction">Getting started</a>
            </li>
            <li>
              <a href="/concepts/tokens">Concepts</a>
            </li>
            <li>
              <a href="/reference/motif">API reference</a>
            </li>
            <li>
              <a href="/recipes/buttons">Recipes</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <span className="footer__col-title">Community</span>
          <ul>
            <li>
              <a href="https://github.com/foo-stack/motif-js">GitHub</a>
            </li>
            <li>
              <a href="https://github.com/foo-stack/motif-js/discussions">Discussions</a>
            </li>
            <li>
              <a href="https://github.com/foo-stack/motif-js/issues">Issues</a>
            </li>
            <li>
              <a href="/changelog">Changelog</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <span className="footer__col-title">Sitemap</span>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/guides/design-system">Guides</a>
            </li>
            <li>
              <a href="/recipes/buttons">Recipes</a>
            </li>
            <li>
              <a href="/changelog">Changelog</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <span>MIT licensed</span>
        <span>© {new Date().getFullYear()} motif-js</span>
      </div>
    </footer>
  );
}
