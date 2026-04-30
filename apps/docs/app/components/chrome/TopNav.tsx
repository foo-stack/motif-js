'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Github, Menu, Moon, Search, Sliders, Sun } from '@motif-js/icons';
import { Link as RRLink, useLocation } from 'react-router';
import { Lockup } from './Lockup';
import type { ThemeMode } from '../../state/theme';

const VERSION = '1.1.2';

interface NavLinkDef {
  readonly label: string;
  readonly to: string;
  readonly matchPrefix?: string;
  readonly external?: boolean;
}

const NAV_LINKS: ReadonlyArray<NavLinkDef> = [
  { label: 'Docs', to: '/docs/introduction', matchPrefix: '/docs' },
  { label: 'API', to: '/api/box', matchPrefix: '/api' },
  { label: 'Examples', to: '/examples', matchPrefix: '/examples' },
  { label: 'Blog', to: '/blog', matchPrefix: '/blog' },
];

export interface TopNavProps {
  mode: ThemeMode;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenSidebar: () => void;
  onOpenTweaks: () => void;
}

export function TopNav({
  mode,
  onToggleTheme,
  onOpenSearch,
  onOpenSidebar,
  onOpenTweaks,
}: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const versionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (versionRef.current !== null && target !== null && !versionRef.current.contains(target)) {
        setVersionOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <nav className={'nav' + (scrolled ? ' nav--scrolled' : '')}>
      <div className="nav__inner">
        <div className="lockup__wrap" ref={versionRef}>
          <Lockup />
          <button
            type="button"
            className="version-pill"
            onClick={() => setVersionOpen((v) => !v)}
            aria-expanded={versionOpen}
            aria-haspopup="menu"
          >
            v{VERSION} <ChevronDown />
          </button>
          {versionOpen && (
            <div
              className="version-menu"
              style={{ left: 'auto', right: 0, marginRight: 0 }}
              role="menu"
            >
              <button type="button" className="version-menu__item" role="menuitem">
                <span className="version-menu__item-version">v1.1.2</span>
                <span>Latest</span>
                <span className="version-menu__item-tag version-menu__item-tag--current">
                  current
                </span>
              </button>
              <button type="button" className="version-menu__item" role="menuitem">
                <span className="version-menu__item-version">v1.0.0</span>
                <span>Previous</span>
                <span className="version-menu__item-tag">stable</span>
              </button>
              <button type="button" className="version-menu__item" role="menuitem">
                <span className="version-menu__item-version">canary</span>
                <span>Pre-release</span>
                <span className="version-menu__item-tag version-menu__item-tag--canary">
                  canary
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="nav__center">
          <button
            type="button"
            className="nav-search"
            onClick={onOpenSearch}
            aria-label="Open search"
          >
            <Search className="nav-search__icon" />
            <span className="nav-search__placeholder">Search the docs</span>
            <span className="nav-search__kbd">
              <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </span>
          </button>
        </div>

        <div className="nav__right">
          {NAV_LINKS.map((link) => {
            const active =
              link.matchPrefix !== undefined && location.pathname.startsWith(link.matchPrefix);
            return (
              <RRLink
                key={link.to}
                to={link.to}
                className={'nav-link' + (active ? ' nav-link--active' : '')}
              >
                {link.label}
              </RRLink>
            );
          })}
          <span style={{ width: 8 }} />
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenTweaks}
            title="Tweaks"
            aria-label="Open tweaks"
          >
            <Sliders />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            title="Toggle theme"
            aria-label={`Switch to ${mode === 'ink' ? 'light' : 'dark'} theme`}
          >
            {mode === 'ink' ? <Sun /> : <Moon />}
          </button>
          <a
            href="https://github.com/foo-stack/motif-js"
            className="icon-btn"
            title="GitHub"
            aria-label="Motif on GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github />
          </a>
          <button
            type="button"
            className="icon-btn mobile-toggle"
            onClick={onOpenSidebar}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  );
}
