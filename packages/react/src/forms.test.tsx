import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Field,
  FieldError,
  FieldHelp,
  Fieldset,
  Input,
  Label,
  NumberInput,
  PasswordInput,
  TextArea,
} from './forms.js';

describe('forms (web)', () => {
  it('Input renders a typed input', () => {
    const html = renderToStaticMarkup(<Input type="email" placeholder="you@example.com" />);
    expect(html).toMatch(/<input[^>]*type="email"/);
    expect(html).toContain('placeholder="you@example.com"');
  });

  it('TextArea renders a <textarea> with rows', () => {
    const html = renderToStaticMarkup(<TextArea rows={5} />);
    expect(html).toMatch(/<textarea[^>]*rows="5"/);
  });

  it('NumberInput sets type=number and inputMode=numeric', () => {
    const html = renderToStaticMarkup(<NumberInput />);
    expect(html).toMatch(/type="number"/);
    expect(html).toMatch(/inputMode="numeric"/i);
  });

  it('PasswordInput defaults to obscured + togglable wrapper', () => {
    const html = renderToStaticMarkup(<PasswordInput />);
    expect(html).toMatch(/type="password"/);
    expect(html).toMatch(/aria-label="Show password"/);
  });

  it('PasswordInput togglable=false drops the toggle', () => {
    const html = renderToStaticMarkup(<PasswordInput togglable={false} />);
    expect(html).toMatch(/type="password"/);
    expect(html).not.toMatch(/aria-label="Show password"/);
  });

  it('Field wires Label htmlFor + Input id together', () => {
    const html = renderToStaticMarkup(
      <Field id="email-fld">
        <Label>Email</Label>
        <Input type="email" />
      </Field>,
    );
    expect(html).toContain('for="email-fld"');
    expect(html).toContain('id="email-fld"');
  });

  it('Field invalid → aria-invalid + danger border on the input', () => {
    const html = renderToStaticMarkup(
      <Field invalid id="x">
        <Input />
      </Field>,
    );
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('action-danger-bg');
  });

  it('Field required → Label gets a visual asterisk + aria-required on the input', () => {
    const html = renderToStaticMarkup(
      <Field required id="x">
        <Label>Email</Label>
        <Input />
      </Field>,
    );
    expect(html).toContain('aria-required="true"');
    expect(html).toContain('*');
  });

  it('FieldHelp + FieldError land in aria-describedby', () => {
    const html = renderToStaticMarkup(
      <Field id="x">
        <Input />
        <FieldHelp>helpful</FieldHelp>
        <FieldError>broken</FieldError>
      </Field>,
    );
    expect(html).toContain('aria-describedby="x-help x-error"');
    expect(html).toContain('id="x-help"');
    expect(html).toContain('id="x-error"');
  });

  it('Fieldset renders legend in a <legend>', () => {
    const html = renderToStaticMarkup(<Fieldset legend="Profile">x</Fieldset>);
    expect(html).toContain('<fieldset');
    expect(html).toContain('<legend');
    expect(html).toContain('Profile');
  });
});
