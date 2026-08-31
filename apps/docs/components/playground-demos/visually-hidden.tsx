import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { VisuallyHidden, IconButton } from 'usemotif';

<IconButton>
  <SearchIcon />
  <VisuallyHidden>Search</VisuallyHidden>
</IconButton>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <button
        type="button"
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: '1px solid var(--colors-line-base)',
          background: 'var(--colors-surface-paper)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>
      <span
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--colors-fg-faint)',
        }}
      >
        "Search" - read aloud, not drawn
      </span>
    </div>
  );
}

export const visuallyHiddenDemo: PlaygroundDemo = {
  label: 'VisuallyHidden',
  code,
  preview,
};
