import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'color', id: 'bg', label: 'bg', defaultValue: '#1D4ED8' },
  { kind: 'range', id: 'px', label: 'px', defaultValue: 16, min: 8, max: 32 },
];

function code(state: ControlState): string {
  return `import { Pressable } from 'usemotif';

<Pressable
  onPress={() => save()}
  bg="${String(state.bg)}"
  color="$colors.fg.onAccent"
  px={${Number(state.px)}}
  py={10}
  borderRadius={8}
  _hover={{ opacity: 0.9 }}
  _active={{ opacity: 0.8 }}
>
  Save
</Pressable>`;
}

function preview(state: ControlState) {
  return (
    <button
      type="button"
      style={{
        background: String(state.bg),
        color: '#FBF7F2',
        paddingLeft: Number(state.px),
        paddingRight: Number(state.px),
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 8,
        border: '1px solid transparent',
        fontFamily: 'var(--font-families-sans)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      Save
    </button>
  );
}

export const pressableDemo: PlaygroundDemo = {
  label: 'Pressable',
  code,
  preview,
  controls,
};
