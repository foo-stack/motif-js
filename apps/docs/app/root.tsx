// Pulls the build-time-extracted Motif CSS into the bundle.
// `@motif-js/compiler-swc` resolves this to a virtual module
// containing the aggregated atomic styles from every JSX file the
// plugin transformed. Without this import, styles fall back to
// runtime injection.
import 'virtual:motif-extract.css';

// Brand stylesheets — colors / type tokens + site-level layout and
// component CSS, ported verbatim from the canonical design package
// at `~/Downloads/Motif Documentation/`. Motif primitives stay the
// authoring surface for in-page demos (Sandbox, etc.); the chrome
// is plain HTML + className because the design relies on grid
// templates, font-variation-settings, and clamp() that are outside
// Motif's typed style-prop surface.
import './styles/colors-and-type.css';
import './styles/site.css';

// Shiki theme switching + structural code-block typography (kept
// from Phase 2; per-token color CSS variables resolve against
// `[data-theme]` here).
import './styles/code.css';

import { useCallback, useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider } from '@motif-js/react';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { mdxComponents } from './components/MdxComponents';
import { TopNav } from './components/chrome/TopNav';
import { Footer } from './components/chrome/Footer';
import { CmdK } from './components/chrome/CmdK';
import { SidebarSheet } from './components/chrome/Sidebar';
import { TweaksPanel } from './components/chrome/TweaksPanel';
import { useThemeMode } from './state/theme';
import { TweaksContext, useTweaks } from './state/tweaks';
import { accentThemes, inkTheme, paperTheme } from './theme/motif';

const THEMES = [paperTheme, inkTheme, ...accentThemes];

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { title: 'Motif — A styling library for React, on every platform' },
  {
    name: 'description',
    content:
      'Cross-platform React styling library. Write your styles once, render them on web and native.',
  },
];

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;500;700&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="paper">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ChromeShell>{children}</ChromeShell>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function ChromeShell({ children }: { children: React.ReactNode }) {
  const { mode, setMode, toggle } = useThemeMode();
  const tweaks = useTweaks();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const openTweaks = useCallback(() => setTweaksOpen(true), []);

  // ⌘K / Ctrl+K to open search; Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeName = tweaks.state.accent === 'terracotta' ? mode : `${mode}_${tweaks.state.accent}`;

  return (
    <ThemeProvider themes={THEMES} active={activeName}>
      <TweaksContext.Provider value={tweaks.state}>
        <MDXProvider components={mdxComponents}>
          <TopNav
            mode={mode}
            onToggleTheme={toggle}
            onOpenSearch={openSearch}
            onOpenSidebar={openSidebar}
            onOpenTweaks={openTweaks}
          />
          {children}
          <Footer />
          <CmdK open={searchOpen} onOpenChange={setSearchOpen} />
          <SidebarSheet open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <TweaksPanel
            open={tweaksOpen}
            onOpenChange={setTweaksOpen}
            themeMode={mode}
            setThemeMode={setMode}
            tweaks={tweaks}
          />
        </MDXProvider>
      </TweaksContext.Provider>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <main style={{ padding: '4rem', fontFamily: 'system-ui' }}>
      <h1>Error</h1>
      <p>Something didn't work. Try again, or open an issue.</p>
    </main>
  );
}
