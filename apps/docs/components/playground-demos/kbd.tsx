import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Kbd } from 'usemotif';

<Text>
  Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.
</Text>`;
}

function key(label: string) {
  return (
    <kbd
      style={{
        fontFamily: 'var(--font-families-mono)',
        fontSize: 12,
        background: 'var(--colors-surface-raised)',
        color: 'var(--colors-fg-default)',
        border: '1px solid var(--colors-line-base)',
        borderRadius: 4,
        padding: '2px 6px',
      }}
    >
      {label}
    </kbd>
  );
}

function preview() {
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: 15,
        color: 'var(--colors-fg-default)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      Press {key('⌘')} {key('K')} to search.
    </span>
  );
}

export const kbdDemo: PlaygroundDemo = { label: 'Kbd', code, preview };
