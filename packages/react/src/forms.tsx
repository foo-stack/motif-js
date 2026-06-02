'use client';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import { Box, type BoxProps } from './Box.js';
import { Pressable } from './Pressable.js';
import { Text, type TextProps } from './Text.js';

/**
 * Field context — links Label / Input / FieldHelp / FieldError so
 * screen readers announce them together. `<Field>` generates a
 * stable id and an `aria-describedby` token list; child primitives
 * subscribe via `useFieldContext()`.
 */
interface FieldContextValue {
  readonly fieldId: string;
  readonly helpId: string;
  readonly errorId: string;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
  /** Whether a FieldHelp is rendered, so the input's aria-describedby only
   * references the help id when it actually exists (a dangling IDREF is an
   * ARIA smell that trips automated a11y checks). The error id is gated on
   * `invalid` instead, since FieldError is shown for the invalid state. */
  readonly hasHelp: boolean;
}
const FieldContext = createContext<FieldContextValue | null>(null);
function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FieldProps extends BoxProps {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  children?: ReactNode;
}

export function Field({
  invalid = false,
  disabled = false,
  required = false,
  id,
  children,
  ...rest
}: FieldProps): ReactElement {
  const reactId = useId();
  const fieldId = id ?? reactId;

  // Detect a FieldHelp among the children at render time (SSR-safe — no
  // effect needed) so aria-describedby only references the help id when a
  // help node is actually present.
  let hasHelp = false;
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === FieldHelp) hasHelp = true;
  });

  return (
    <FieldContext.Provider
      value={{
        fieldId,
        helpId: `${fieldId}-help`,
        errorId: `${fieldId}-error`,
        invalid,
        disabled,
        required,
        hasHelp,
      }}
    >
      <Box display="flex" flexDirection="column" gap="$1.5" {...rest}>
        {children}
      </Box>
    </FieldContext.Provider>
  );
}

export interface LabelProps extends TextProps {
  htmlFor?: string;
}
export function Label({ htmlFor, children, ...rest }: LabelProps): ReactElement {
  const ctx = useFieldContext();
  const target = htmlFor ?? ctx?.fieldId;
  return (
    <Text
      as="label"
      fontSize="$sm"
      fontWeight="$semibold"
      color="$colors.text.default"
      {...(target !== undefined ? ({ htmlFor: target } as Record<string, string>) : {})}
      {...rest}
    >
      {children}
      {ctx?.required === true ? (
        <Text as="span" color="$colors.action.danger.bg" aria-hidden="true">
          {' *'}
        </Text>
      ) : null}
    </Text>
  );
}

export interface FieldHelpProps extends TextProps {}
export function FieldHelp({ children, ...rest }: FieldHelpProps): ReactElement {
  const ctx = useFieldContext();
  return (
    <Text
      fontSize="$sm"
      color="$colors.text.muted"
      {...(ctx !== null ? ({ id: ctx.helpId } as Record<string, string>) : {})}
      {...rest}
    >
      {children}
    </Text>
  );
}

export interface FieldErrorProps extends TextProps {}
export function FieldError({ children, ...rest }: FieldErrorProps): ReactElement {
  const ctx = useFieldContext();
  return (
    <Text
      role="alert"
      fontSize="$sm"
      color="$colors.action.danger.bg"
      {...(ctx !== null ? ({ id: ctx.errorId } as Record<string, string>) : {})}
      {...rest}
    >
      {children}
    </Text>
  );
}

export interface FieldsetProps extends Omit<BoxProps, 'as'> {
  legend?: ReactNode;
  children?: ReactNode;
}
export function Fieldset({ legend, children, ...rest }: FieldsetProps): ReactElement {
  return (
    <Box
      as="fieldset"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      borderRadius="$md"
      p="$4"
      {...rest}
    >
      {legend !== undefined && legend !== null ? (
        <Text as="legend" fontSize="$sm" fontWeight="$semibold" px="$1">
          {legend}
        </Text>
      ) : null}
      {children}
    </Box>
  );
}

/** Inline style for the bordered surface — kept simple so it
 * doesn't fight the schema. Token-driven theming through
 * `var(--colors-…)` references stays at the parent's level. */
function inputStyle(invalid: boolean, disabled: boolean): CSSProperties {
  return {
    width: '100%',
    paddingInline: 12,
    paddingBlock: 8,
    fontSize: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: invalid ? 'var(--colors-action-danger-bg)' : 'var(--colors-border-default)',
    borderRadius: 8,
    backgroundColor: 'var(--colors-surface-base)',
    color: 'var(--colors-text-default)',
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  };
}

function pickAriaProps(ctx: FieldContextValue | null): Record<string, string | undefined> {
  if (ctx === null) return {};
  const out: Record<string, string | undefined> = { id: ctx.fieldId };
  // Only describe the input by ids that actually resolve — the help id when
  // a FieldHelp is present, the error id when the field is invalid (which is
  // when a FieldError is shown). Avoids dangling IDREFs.
  const describedBy = [ctx.hasHelp ? ctx.helpId : null, ctx.invalid ? ctx.errorId : null]
    .filter(Boolean)
    .join(' ');
  if (describedBy.length > 0) out['aria-describedby'] = describedBy;
  if (ctx.invalid) out['aria-invalid'] = 'true';
  if (ctx.required) out['aria-required'] = 'true';
  return out;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  invalid?: boolean;
}
export const Input = forwardRef(function Input(
  { invalid, disabled, type = 'text', style, ...rest }: InputProps,
  ref: Ref<HTMLInputElement>,
): ReactElement {
  const ctx = useFieldContext();
  const isInvalid = invalid ?? ctx?.invalid ?? false;
  const isDisabled = disabled ?? ctx?.disabled ?? false;
  return (
    <input
      ref={ref}
      type={type}
      style={{ ...inputStyle(isInvalid, isDisabled), ...style }}
      {...pickAriaProps(ctx)}
      {...(isDisabled ? { disabled: true } : {})}
      {...rest}
    />
  );
});

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  invalid?: boolean;
  rows?: number;
}
export const TextArea = forwardRef(function TextArea(
  { invalid, disabled, rows = 3, style, ...rest }: TextAreaProps,
  ref: Ref<HTMLTextAreaElement>,
): ReactElement {
  const ctx = useFieldContext();
  const isInvalid = invalid ?? ctx?.invalid ?? false;
  const isDisabled = disabled ?? ctx?.disabled ?? false;
  return (
    <textarea
      ref={ref}
      rows={rows}
      style={{ ...inputStyle(isInvalid, isDisabled), resize: 'vertical', ...style }}
      {...pickAriaProps(ctx)}
      {...(isDisabled ? { disabled: true } : {})}
      {...rest}
    />
  );
});

export interface NumberInputProps extends Omit<InputProps, 'type'> {}
export const NumberInput = forwardRef(function NumberInput(
  props: NumberInputProps,
  ref: Ref<HTMLInputElement>,
): ReactElement {
  return <Input ref={ref} type="number" inputMode="numeric" {...props} />;
});

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /** Show the eye-toggle to switch between obscured and plain text.
   * Defaults to true. */
  togglable?: boolean;
}
export const PasswordInput = forwardRef(function PasswordInput(
  { togglable = true, ...rest }: PasswordInputProps,
  ref: Ref<HTMLInputElement>,
): ReactElement {
  const [visible, setVisible] = useState(false);
  if (!togglable) {
    return <Input ref={ref} type="password" {...rest} />;
  }
  return (
    <Box display="inline-flex" alignItems="center" position="relative" w="$full">
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        style={{ paddingRight: 40 }}
        {...rest}
      />
      <Pressable
        onPress={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        px="$3"
        bg="transparent"
        borderWidth={0}
        cursor="pointer"
        color="$colors.text.muted"
        {...({ type: 'button' } as Record<string, string>)}
      >
        {visible ? '🙈' : '👁'}
      </Pressable>
    </Box>
  );
});
