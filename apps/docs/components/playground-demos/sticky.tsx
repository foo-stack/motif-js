import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { ScrollView, Sticky } from 'usemotif';

<ScrollView h={240}>
  <Sticky top={0}>
    <SectionHeader />
  </Sticky>
  {rows}
</ScrollView>`;
}

function preview() {
  return (
    <div
      style={{
        width: 200,
        height: 160,
        overflow: 'auto',
        border: '1px solid var(--colors-line-base)',
        borderRadius: 8,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: '#1D4ED8',
          color: '#FBF7F2',
          fontFamily: 'var(--font-families-mono)',
          fontSize: 11,
          padding: '8px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Pinned header
      </div>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key -- positional
          key={i}
          style={{
            padding: '10px 12px',
            fontFamily: 'var(--font-families-sans)',
            fontSize: 13,
            color: 'var(--colors-fg-muted)',
            borderBottom: '1px solid var(--colors-line-faint)',
          }}
        >
          Row {i + 1}
        </div>
      ))}
    </div>
  );
}

export const stickyDemo: PlaygroundDemo = { label: 'Sticky', code, preview };
