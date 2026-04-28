import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native date/time family — Calendar / DatePicker / TimeInput. The
 * platform-correct path is `@react-native-community/datetimepicker`
 * for the native iOS/Android pickers; until that integration lands,
 * the native variants null-render and warn once.
 */

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (next: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isDateDisabled?: (date: Date) => boolean;
  locale?: string;
  renderDay?: (info: {
    date: Date;
    isSelected: boolean;
    isOutside: boolean;
    isDisabled: boolean;
    isToday: boolean;
  }) => ReactNode;
}
export function Calendar(_props: CalendarProps): ReactElement | null {
  nativeStubWarn('Calendar');
  return null;
}

export interface DatePickerProps extends Omit<CalendarProps, 'renderDay'> {
  format?: (d: Date) => string;
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export function DatePicker(_props: DatePickerProps): ReactElement | null {
  nativeStubWarn('DatePicker');
  return null;
}

export interface TimeInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  step?: number;
  min?: string;
  max?: string;
}
export function TimeInput(_props: TimeInputProps): ReactElement | null {
  nativeStubWarn('TimeInput');
  return null;
}
