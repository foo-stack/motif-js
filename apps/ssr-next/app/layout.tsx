import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@motif-js/react';
import { darkTheme, lightTheme } from '@motif-js/tokens';
import { MotifStyleRegistry } from './motif-style-registry';

export const metadata: Metadata = {
  title: 'motif-js × Next.js App Router',
  description:
    'End-to-end SSR demo for motif-js: collector + RSC + hydration in Next.js App Router.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <MotifStyleRegistry>
          <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
            {children}
          </ThemeProvider>
        </MotifStyleRegistry>
      </body>
    </html>
  );
}
