import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { helpText, inputBox, labelText } from './_field.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'invalid', label: 'invalid', defaultValue: false },
];

function code(state: ControlState): string {
  const invalid = Boolean(state.invalid);
  return `import { Field, Label, Input, FieldHelp, FieldError } from 'usemotif';

<Field${invalid ? ' invalid' : ''}>
  <Label>Email</Label>
  <Input type="email" />
  ${invalid ? '<FieldError>Enter a valid email.</FieldError>' : '<FieldHelp>We never share it.</FieldHelp>'}
</Field>`;
}

function preview(state: ControlState) {
  const invalid = Boolean(state.invalid);
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelText()}>Email</span>
      <input aria-label="Email" type="email" style={inputBox(invalid)} />
      <span style={helpText(invalid ? 'error' : 'muted')}>
        {invalid ? 'Enter a valid email.' : 'We never share it.'}
      </span>
    </span>
  );
}

export const fieldDemo: PlaygroundDemo = { label: 'Field', code, preview, controls };
