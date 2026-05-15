import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Toolbar } from 'usemotif/headless';

<Toolbar aria-label="Text formatting">
  <IconButton aria-label="Bold"><BoldIcon /></IconButton>
  <IconButton aria-label="Italic"><ItalicIcon /></IconButton>
  <IconButton aria-label="Underline"><UnderlineIcon /></IconButton>
</Toolbar>`;
}

function btn(label: string, active = false) {
  return (
    <span
      style={{
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 14,
        fontWeight: 700,
        background: active ? 'var(--colors-surface-muted)' : 'transparent',
        border: '1px solid var(--colors-line-base)',
      }}
    >
      {label}
    </span>
  );
}

function preview() {
  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        borderRadius: 8,
        border: '1px solid var(--colors-line-faint)',
      }}
    >
      {btn('B', true)}
      {btn('I')}
      {btn('U')}
    </div>
  );
}

export const toolbarDemo: PlaygroundDemo = { label: 'Toolbar', code, preview };
