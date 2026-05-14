import { resolveStyles, type StyleProps } from '@usemotif/core';
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  TextInput as RNTextInput,
  type KeyboardTypeOptions,
  type TextInputProps as RNTextInputProps,
  type TextStyle,
} from 'react-native';
import { Box, type BoxProps } from './Box.js';
import { Pressable } from './Pressable.js';
import { Text, type TextProps } from './Text.js';
import { useTheme } from './theme-context.js';

interface FieldContextValue {
  readonly fieldId: string;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
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
  return (
    <FieldContext.Provider value={{ fieldId, invalid, disabled, required }}>
      <Box gap="$1.5" {...rest}>
        {children}
      </Box>
    </FieldContext.Provider>
  );
}

export interface LabelProps extends TextProps {}
export function Label({ children, ...rest }: LabelProps): ReactElement {
  const ctx = useFieldContext();
  return (
    <Text fontSize="$sm" fontWeight="$semibold" color="$colors.text.default" {...rest}>
      {children}
      {ctx?.required === true ? <Text color="$colors.action.danger.bg">{' *'}</Text> : null}
    </Text>
  );
}

export interface FieldHelpProps extends TextProps {}
export function FieldHelp({ children, ...rest }: FieldHelpProps): ReactElement {
  return (
    <Text fontSize="$sm" color="$colors.text.muted" {...rest}>
      {children}
    </Text>
  );
}

export interface FieldErrorProps extends TextProps {}
export function FieldError({ children, ...rest }: FieldErrorProps): ReactElement {
  return (
    <Text
      accessibilityLiveRegion="polite"
      fontSize="$sm"
      color="$colors.action.danger.bg"
      {...rest}
    >
      {children}
    </Text>
  );
}

export interface FieldsetProps extends BoxProps {
  legend?: ReactNode;
  children?: ReactNode;
}
export function Fieldset({ legend, children, ...rest }: FieldsetProps): ReactElement {
  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      borderRadius="$md"
      p="$4"
      gap="$2"
      {...rest}
    >
      {legend !== undefined && legend !== null ? (
        <Text fontSize="$sm" fontWeight="$semibold">
          {legend}
        </Text>
      ) : null}
      {children}
    </Box>
  );
}

/**
 * Input — wraps RN's TextInput with motif's theme-resolved style
 * surface. Themed via the standard token references; the resolver
 * runs at render time (RN doesn't have CSS variables).
 */
export interface InputProps extends Omit<RNTextInputProps, 'editable' | 'style'> {
  invalid?: boolean;
  disabled?: boolean;
  /** Style override merged onto the resolved input surface. */
  style?: TextStyle | readonly TextStyle[];
}
export const Input = forwardRef(function Input(
  { invalid, disabled, style: userStyle, ...rest }: InputProps,
  ref: Ref<RNTextInput>,
): ReactElement {
  const ctx = useFieldContext();
  const isInvalid = invalid ?? ctx?.invalid ?? false;
  const isDisabled = disabled ?? ctx?.disabled ?? false;
  const theme = useTheme();
  const propsBag: StyleProps = {
    px: '$3',
    py: '$2',
    fontSize: '$md',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: isInvalid ? '$colors.action.danger.bg' : '$colors.border.default',
    borderRadius: '$md',
    bg: '$colors.surface.base',
    color: '$colors.text.default',
    opacity: isDisabled ? 0.6 : 1,
  };
  const { style: resolved } = resolveStyles(propsBag as Record<string, unknown>, theme);
  const finalStyle: TextStyle[] =
    userStyle === undefined
      ? [resolved as TextStyle]
      : Array.isArray(userStyle)
        ? [resolved as TextStyle, ...(userStyle as TextStyle[])]
        : [resolved as TextStyle, userStyle as TextStyle];
  return <RNTextInput ref={ref} editable={!isDisabled} style={finalStyle} {...rest} />;
});

export interface TextAreaProps extends Omit<InputProps, 'multiline' | 'numberOfLines'> {
  rows?: number;
}
export const TextArea = forwardRef(function TextArea(
  { rows = 3, style, ...rest }: TextAreaProps,
  ref: Ref<RNTextInput>,
): ReactElement {
  const taStyle: TextStyle = { minHeight: rows * 24, textAlignVertical: 'top' };
  const merged: TextStyle | readonly TextStyle[] =
    style === undefined
      ? taStyle
      : Array.isArray(style)
        ? [taStyle, ...(style as TextStyle[])]
        : [taStyle, style as TextStyle];
  return <Input ref={ref} multiline numberOfLines={rows} style={merged as TextStyle} {...rest} />;
});

export interface NumberInputProps extends Omit<InputProps, 'keyboardType'> {
  keyboardType?: KeyboardTypeOptions;
}
export const NumberInput = forwardRef(function NumberInput(
  { keyboardType = 'numeric', ...rest }: NumberInputProps,
  ref: Ref<RNTextInput>,
): ReactElement {
  return <Input ref={ref} keyboardType={keyboardType} {...rest} />;
});

export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry'> {
  togglable?: boolean;
}
export const PasswordInput = forwardRef(function PasswordInput(
  { togglable = true, ...rest }: PasswordInputProps,
  ref: Ref<RNTextInput>,
): ReactElement {
  const [visible, setVisible] = useState(false);
  if (!togglable) {
    return <Input ref={ref} secureTextEntry {...rest} />;
  }
  return (
    <Box flexDirection="row" alignItems="center">
      <Box flex={1}>
        <Input ref={ref} secureTextEntry={!visible} {...rest} />
      </Box>
      <Pressable
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => setVisible((v) => !v)}
        px="$3"
      >
        <Text>{visible ? '🙈' : '👁'}</Text>
      </Pressable>
    </Box>
  );
});
