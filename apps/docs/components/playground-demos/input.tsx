import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { inputBox } from './_field.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'invalid', label: 'invalid', defaultValue: false },
];

function code(state: ControlState): string {
  return `import { Input } from 'usemotif';

<Input
  type="email"
  placeholder="you@example.com"${state.invalid ? '\n  invalid' : ''}
/>`;
}

function preview(state: ControlState) {
  return (
    <input type="email" placeholder="you@example.com" style={inputBox(Boolean(state.invalid))} />
  );
}

export const inputDemo: PlaygroundDemo = { label: 'Input', code, preview, controls };
