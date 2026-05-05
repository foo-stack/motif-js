import { useEffect, useState } from 'react';
import { GitHub, Monogram } from './icons.js';
import { SearchTrigger } from './SearchTrigger.js';
import { ThemeToggle } from './ThemeToggle.js';
import { VersionPill } from './VersionPill.js';

const SPACER_STYLE = { width: 8 };

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <div className="lockup__wrap">
          <a className="lockup" href="/">
            <Monogram className="lockup__mark" />
            <span className="lockup__name">Motif</span>
          </a>
          <VersionPill />
        </div>

        <div className="nav__center">
          <SearchTrigger />
        </div>

        <div className="nav__right">
          <a className="nav-link" href="/getting-started/introduction">
            Docs
          </a>
          <a className="nav-link" href="/guides/design-system">
            Guides
          </a>
          <a className="nav-link" href="/reference/styled">
            API
          </a>
          <a className="nav-link" href="/recipes/buttons">
            Recipes
          </a>
          <span style={SPACER_STYLE} />
          <ThemeToggle />
          <a
            className="icon-btn"
            href="https://github.com/foo-stack/motif-js"
            title="GitHub"
            aria-label="GitHub repository"
          >
            <GitHub />
          </a>
        </div>
      </div>
    </nav>
  );
}
