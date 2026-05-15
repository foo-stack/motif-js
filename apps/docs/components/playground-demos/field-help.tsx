import type { PlaygroundDemo } from './index.js';
import { helpText, inputBox, labelText } from './_field.js';

function code(): string {
  return `import { Field, Label, Input, FieldHelp } from 'usemotif';

<Field>
  <Label>Username</Label>
  <Input />
  <FieldHelp>Letters, numbers, and dashes.</FieldHelp>
</Field>`;
}

function preview() {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelText()}>Username</span>
      <input aria-label="Username" style={inputBox()} />
      <span style={helpText()}>Letters, numbers, and dashes.</span>
    </span>
  );
}

export const fieldHelpDemo: PlaygroundDemo = { label: 'FieldHelp', code, preview };
