import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Breadcrumb } from 'usemotif/headless';

<Breadcrumb separator="/">
  <a href="/">Home</a>
  <a href="/docs">Docs</a>
  <a href="/docs/headless">Headless</a>
</Breadcrumb>`;
}

function crumb(label: string, current = false) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        color: current ? 'var(--colors-fg-strong)' : 'var(--colors-accent-base)',
        fontWeight: current ? 600 : 400,
      }}
    >
      {label}
    </span>
  );
}

function preview() {
  return (
    <nav aria-label="Breadcrumb">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {crumb('Home')}
        <span style={{ color: 'var(--colors-fg-faint)' }}>/</span>
        {crumb('Docs')}
        <span style={{ color: 'var(--colors-fg-faint)' }}>/</span>
        {crumb('Headless', true)}
      </span>
    </nav>
  );
}

export const breadcrumbDemo: PlaygroundDemo = { label: 'Breadcrumb', code, preview };
