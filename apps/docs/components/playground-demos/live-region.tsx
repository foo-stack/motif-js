import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'politeness',
    label: 'politeness',
    defaultValue: 'polite',
    options: ['polite', 'assertive'],
  },
];

function code(state: ControlState): string {
  return `import { LiveRegion } from 'usemotif';

<LiveRegion politeness="${String(state.politeness)}">
  {status}
</LiveRegion>`;
}

function preview(state: ControlState) {
  const assertive = state.politeness === 'assertive';
  return (
    <div
      style={{
        width: 220,
        borderRadius: 8,
        border: `1px solid ${assertive ? 'var(--colors-status-error)' : 'var(--colors-line-base)'}`,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: assertive ? 'var(--colors-status-error)' : 'var(--colors-fg-faint)',
        }}
      >
        aria-live: {String(state.politeness)}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-families-sans)',
          fontSize: 14,
          color: 'var(--colors-fg-default)',
        }}
      >
        Changes saved.
      </span>
    </div>
  );
}

export const liveRegionDemo: PlaygroundDemo = {
  label: 'LiveRegion',
  code,
  preview,
  controls,
};
