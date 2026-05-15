import type { PlaygroundDemo } from './index.js';
import { labelText } from './_field.js';

function code(): string {
  return `import { Fieldset, Field, Label, Input } from 'usemotif';

<Fieldset legend="Billing address">
  <Field>
    <Label>Street</Label>
    <Input />
  </Field>
  <Field>
    <Label>City</Label>
    <Input />
  </Field>
</Fieldset>`;
}

function row(label: string) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={labelText()}>{label}</span>
      <span
        style={{
          height: 30,
          borderRadius: 6,
          border: '1px solid var(--colors-line-base)',
          background: 'var(--colors-surface-paper)',
        }}
      />
    </span>
  );
}

function preview() {
  return (
    <fieldset
      style={{
        border: '1px solid var(--colors-line-base)',
        borderRadius: 8,
        padding: 14,
        width: 220,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <legend
        style={{
          fontFamily: 'var(--font-families-sans)',
          fontSize: 12,
          fontWeight: 600,
          padding: '0 4px',
          color: 'var(--colors-fg-strong)',
        }}
      >
        Billing address
      </legend>
      {row('Street')}
      {row('City')}
    </fieldset>
  );
}

export const fieldsetDemo: PlaygroundDemo = { label: 'Fieldset', code, preview };
