import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { buttonStyle } from './_button.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'variant',
    label: 'variant',
    defaultValue: 'solid',
    options: ['solid', 'outline', 'ghost'],
  },
  {
    kind: 'select',
    id: 'intent',
    label: 'intent',
    defaultValue: 'primary',
    options: ['primary', 'danger', 'success', 'neutral'],
  },
  {
    kind: 'select',
    id: 'size',
    label: 'size',
    defaultValue: 'md',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
];

function code(state: ControlState): string {
  return `import { Button } from 'usemotif';

<Button
  variant="${String(state.variant)}"
  intent="${String(state.intent)}"
  size="${String(state.size)}"
  onPress={() => save()}
>
  Save changes
</Button>`;
}

function preview(state: ControlState) {
  return (
    <button
      type="button"
      style={buttonStyle(String(state.variant), String(state.intent), String(state.size))}
    >
      Save changes
    </button>
  );
}

export const buttonDemo: PlaygroundDemo = { label: 'Button', code, preview, controls };
