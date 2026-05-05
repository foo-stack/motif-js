'use client';

import { useCallback, useState } from 'react';
import { ArrowRight, GitHub } from '../chrome/icons.js';
import { Box, Check, Code, Copy, Globe, Layers, Palette, Smartphone, Zap } from './icons.js';

interface CodeLine {
  readonly t: string;
  readonly hl?: boolean;
}

const samples: Record<string, readonly CodeLine[]> = {
  component: [
    { t: "import { styled } from '@motif-js/react';" },
    { t: '' },
    { t: "export const Button = styled('button', {", hl: true },
    { t: '  base: {', hl: true },
    { t: "    bg: '$colors.action.primary.bg',", hl: true },
    { t: "    color: '$colors.action.primary.fg',", hl: true },
    { t: "    paddingInline: '$space.4',", hl: true },
    { t: "    paddingBlock: '$space.2',", hl: true },
    { t: "    borderRadius: '$radii.md',", hl: true },
    { t: '  },', hl: true },
    { t: '});' },
    { t: '' },
    { t: '// Renders to atomic CSS on web,' },
    { t: '// to native style objects on iOS and Android.' },
  ],
  theme: [
    { t: "import { createTheme } from '@motif-js/react';" },
    { t: '' },
    { t: 'export const theme = createTheme({', hl: true },
    { t: "  name: 'light',", hl: true },
    { t: '  tokens: {', hl: true },
    { t: '    colors: {' },
    { t: "      paper: '#FBF7F2'," },
    { t: "      ink:   '#1C1917'," },
    { t: "      action: { primary: { bg: '#C2410C', fg: '#FBF7F2' } }," },
    { t: '    },' },
    { t: '    space: { 1: 4, 2: 8, 3: 12, 4: 16 },' },
    { t: '    radii: { sm: 4, md: 8, lg: 12 },' },
    { t: '  },' },
    { t: '});' },
  ],
  variants: [
    { t: "export const Button = styled('button', {" },
    {
      t: "  base: { paddingInline: '$space.3', paddingBlock: '$space.2', borderRadius: '$radii.md' },",
    },
    { t: '  variants: {', hl: true },
    { t: '    size: {', hl: true },
    { t: "      sm: { fontSize: 13, paddingInline: '$space.2' },", hl: true },
    { t: '      md: { fontSize: 14 },', hl: true },
    { t: "      lg: { fontSize: 16, paddingInline: '$space.5' },", hl: true },
    { t: '    },' },
    { t: '    intent: {' },
    {
      t: "      primary: { bg: '$colors.action.primary.bg', color: '$colors.action.primary.fg' },",
    },
    { t: "      ghost:   { bg: 'transparent' }," },
    { t: '    },' },
    { t: '  },' },
    { t: '});' },
  ],
};

const tabs = [
  { id: 'component', label: 'Component', Icon: Code },
  { id: 'theme', label: 'Theme', Icon: Palette },
  { id: 'variants', label: 'Variants', Icon: Layers },
] as const;

const INSTALL_CMD = 'npm i @motif-js/react';

export function Hero() {
  const [active, setActive] = useState<string>('component');
  const [copied, setCopied] = useState(false);
  const select = useCallback((id: string) => () => setActive(id), []);
  const onCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(INSTALL_CMD).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, []);

  const lines = samples[active] ?? samples.component!;

  return (
    <section className="hero">
      <div className="hero__grain" aria-hidden="true" />
      <div className="h2">
        <div className="hero__inner">
          <div>
            <span className="hero__eye">
              <span className="hero__eye-pill">v1.1.2</span>
              Now stable
            </span>
            <h1>
              Write your styles once. <em>Run them anywhere</em> React runs.
            </h1>
            <p className="hero__lede">
              motif-js is a cross-platform styling library for React. One source of truth for
              tokens, variants, and themes — compiled to atomic CSS on the web and platform style
              objects on iOS and Android.
            </p>
            <div className="hero__ctas">
              <a className="btn btn--primary" href="/getting-started/introduction">
                Get started <ArrowRight />
              </a>
              <button
                type="button"
                className="btn btn--copy-install"
                onClick={onCopy}
                title={copied ? 'Copied' : 'Copy install command'}
                aria-label="Copy install command"
              >
                <span className="npm-prefix">$</span>
                <span>{INSTALL_CMD}</span>
                <span className="copy-affordance">{copied ? <Check /> : <Copy />}</span>
              </button>
              <a
                className="btn btn--ghost"
                href="https://github.com/foo-stack/motif-js"
                rel="noreferrer"
              >
                <GitHub /> View on GitHub
              </a>
            </div>
            <div className="hero__meta">
              <span>
                <Box /> 12 KB gzipped
              </span>
              <span>
                <Zap /> Atomic CSS
              </span>
              <span>
                <Globe /> Web · iOS · Android
              </span>
              <span>
                <Check /> MIT licensed
              </span>
            </div>
          </div>

          <div className="hero__code">
            <div className="hero__code-tabs" role="tablist">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active === id}
                  className={`hero__code-tab${active === id ? ' hero__code-tab--active' : ''}`}
                  onClick={select(id)}
                >
                  <Icon /> {label}
                </button>
              ))}
            </div>
            <div className="hero__code-body">
              <pre>
                <code>
                  {lines.map((line, i) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key -- code lines are stable per tab
                      key={i}
                      className={`code-line${line.hl ? ' code-line--hl' : ''}`}
                    >
                      {line.t || ' '}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            <div className="hero__code-foot">
              <span>Renders to:</span>
              <span className="hero__code-foot-platform hero__code-foot-platform--active">
                <Globe /> Web
              </span>
              <span className="hero__code-foot-platform hero__code-foot-platform--active">
                <Smartphone /> iOS
              </span>
              <span className="hero__code-foot-platform hero__code-foot-platform--active">
                <Smartphone /> Android
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
