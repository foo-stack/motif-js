import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Check } from '../icons.js';

const LABEL = 'Save changes';

const controls: readonly ControlSpec[] = [
  { kind: 'color', id: 'color', label: 'bg', defaultValue: '#C2410C' },
  { kind: 'range', id: 'radius', label: 'radius', defaultValue: 6, min: 0, max: 20 },
  { kind: 'range', id: 'px', label: 'px', defaultValue: 20, min: 8, max: 40 },
];

function code(state: ControlState): string {
  const color = String(state.color);
  const radius = Number(state.radius);
  const px = Number(state.px);
  return `import { styled, Pressable } from 'usemotif';

export const Button = styled(Pressable, {
  base: {
    bg:           '${color}',
    color:        '$colors.action.primary.fg',
    px:           ${px},
    py:           12,
    borderRadius: ${radius},
    fontSize:     '$md',
    fontWeight:   500,
  },
});

<Button>${LABEL}</Button>`;
}

function preview(state: ControlState) {
  const color = String(state.color);
  const radius = Number(state.radius);
  const px = Number(state.px);
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: px,
        paddingRight: px,
        fontFamily: 'var(--font-families-sans)',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 1,
        color: 'var(--colors-fg-onAccent)',
        background: color,
        borderRadius: radius,
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'filter 120ms var(--easings-base)',
      }}
    >
      <Check width={14} height={14} />
      {LABEL}
    </button>
  );
}

export const heroDemo: PlaygroundDemo = { label: 'Live playground', code, preview, controls };
