import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Blockquote } from 'usemotif';

<Blockquote cite="— motif docs">
  Tokens describe the values; theming is how
  they switch.
</Blockquote>`;
}

function preview() {
  return (
    <blockquote
      style={{
        margin: 0,
        borderLeft: '4px solid var(--colors-line-base)',
        paddingLeft: 16,
        paddingTop: 4,
        paddingBottom: 4,
        maxWidth: 280,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-families-sans)',
          fontStyle: 'italic',
          fontSize: 15,
          color: 'var(--colors-fg-default)',
        }}
      >
        Tokens describe the values; theming is how they switch.
      </span>
      <span
        style={{
          display: 'block',
          marginTop: 6,
          fontFamily: 'var(--font-families-sans)',
          fontSize: 12,
          color: 'var(--colors-fg-muted)',
        }}
      >
        — motif docs
      </span>
    </blockquote>
  );
}

export const blockquoteDemo: PlaygroundDemo = { label: 'Blockquote', code, preview };
