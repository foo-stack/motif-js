import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { VirtualList } from 'usemotif';

<VirtualList
  data={contacts}
  itemHeight={40}
  keyOf={(c) => c.id}
  renderItem={(c) => <ContactRow contact={c} />}
  h={320}
/>`;
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
      {Array.from({ length: 200 }, (_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key -- positional
          key={i}
          style={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 8,
            fontFamily: 'var(--font-families-sans)',
            fontSize: 13,
            color: 'var(--colors-fg-default)',
            borderBottom: '1px solid var(--colors-line-faint)',
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--colors-surface-muted)',
              flex: '0 0 auto',
            }}
          />
          Contact {i + 1}
        </div>
      ))}
    </div>
  );
}

export const virtualListDemo: PlaygroundDemo = {
  label: 'VirtualList - 200 rows',
  code,
  preview,
};
