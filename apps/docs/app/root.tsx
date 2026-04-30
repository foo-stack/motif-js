// Pulls the build-time-extracted Motif CSS into the bundle.
// `@motif-js/compiler-swc` resolves this to a virtual module
// containing the aggregated atomic styles from every JSX file the
// plugin transformed. Without this import, styles fall back to
// runtime injection.
import 'virtual:motif-extract.css';

import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider } from '@motif-js/react';
import { MotifReset } from '@motif-js/reset';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { mdxComponents } from './components/MdxComponents';
import { inkTheme, paperTheme } from './theme/motif';

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
        <MotifReset />
        <ThemeProvider themes={[paperTheme, inkTheme]} active="paper">
          <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
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
