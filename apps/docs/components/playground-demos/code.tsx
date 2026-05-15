import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Code } from 'usemotif';

<Text>
  Resolve a token with <Code>$colors.surface.base</Code>.
</Text>`;
}

function preview() {
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: 15,
        color: 'var(--colors-fg-default)',
      }}
    >
      Resolve a token with{' '}
      <code
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 13,
          background: 'var(--colors-surface-muted)',
          borderRadius: 4,
          padding: '1px 5px',
        }}
      >
        $colors.surface.base
      </code>
      .
    </span>
  );
}

export const codeDemo: PlaygroundDemo = { label: 'Code', code, preview };
