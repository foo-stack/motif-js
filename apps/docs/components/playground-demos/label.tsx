import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { inputBox, labelText } from './_field.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'required', label: 'required', defaultValue: false },
];

function code(state: ControlState): string {
  return `import { Field, Label, Input } from 'usemotif';

<Field${state.required ? ' required' : ''}>
  <Label>Email</Label>
  <Input type="email" />
</Field>`;
}

function preview(state: ControlState) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelText()}>
        Email
        {state.required ? <span style={{ color: 'var(--colors-status-error)' }}> *</span> : null}
      </label>
      <input type="email" style={inputBox()} />
    </span>
  );
}

export const labelDemo: PlaygroundDemo = { label: 'Label', code, preview, controls };
