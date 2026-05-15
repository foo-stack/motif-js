import type { PlaygroundDemo } from './index.js';
import { helpText, inputBox, labelText } from './_field.js';

function code(): string {
  return `import { Field, Label, Input, FieldError } from 'usemotif';

<Field invalid>
  <Label>Email</Label>
  <Input type="email" />
  <FieldError>That email is already taken.</FieldError>
</Field>`;
}

function preview() {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelText()}>Email</span>
      <input aria-label="Email" type="email" style={inputBox(true)} />
      <span role="alert" style={helpText('error')}>
        That email is already taken.
      </span>
    </span>
  );
}

export const fieldErrorDemo: PlaygroundDemo = { label: 'FieldError', code, preview };
