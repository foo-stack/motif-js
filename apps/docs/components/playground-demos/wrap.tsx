import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'gap', label: 'gap', defaultValue: 8, min: 0, max: 20 },
];

const TAGS = ['ui', 'design', 'tokens', 'theme', 'native', 'web', 'flex', 'grid'];

function code(state: ControlState): string {
  return `import { Wrap } from 'usemotif';

<Wrap gap={${Number(state.gap)}}>
  <Tag>ui</Tag>
  <Tag>design</Tag>
  <Tag>tokens</Tag>
  <Tag>theme</Tag>
</Wrap>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: Number(state.gap),
        width: 220,
      }}
    >
      {TAGS.map((tag) => (
        <span
          key={tag}
          style={{
            padding: '4px 10px',
            border: '1px solid var(--colors-line-base)',
            borderRadius: 999,
            fontFamily: 'var(--font-families-mono)',
            fontSize: 11,
            color: 'var(--colors-fg-muted)',
            background: 'var(--colors-surface-paper)',
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export const wrapDemo: PlaygroundDemo = { label: 'Wrap', code, preview, controls };
