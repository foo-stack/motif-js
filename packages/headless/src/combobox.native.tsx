import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native Combobox / Select / Search / MultiSelect — a real port
 * should swap the floating listbox for a bottom-sheet (RN Modal +
 * a list). Until that lands, the native variants null-render and
 * warn once.
 *
 * The exported types are kept identical to the web variants so
 * cross-platform code typechecks.
 */

export interface ComboboxOption<T = string> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
}
export interface ComboboxRootProps<T = string> {
  options: ReadonlyArray<ComboboxOption<T>>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (next: T | undefined) => void;
  inputValue?: string;
  onInputValueChange?: (next: string) => void;
  filter?: (option: ComboboxOption<T>, input: string) => boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
export interface SelectRootProps<T = string> extends Omit<
  ComboboxRootProps<T>,
  'inputValue' | 'onInputValueChange' | 'filter'
> {
  placeholder?: string;
}
export interface MultiSelectRootProps<T = string> {
  options: ReadonlyArray<ComboboxOption<T>>;
  value?: ReadonlyArray<T>;
  defaultValue?: ReadonlyArray<T>;
  onValueChange?: (next: ReadonlyArray<T>) => void;
  maxSelections?: number;
  enableSelectAll?: boolean;
  children?: ReactNode;
}

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(name);
    return null;
  };
}

export const Combobox = {
  Root: nullStub('Combobox.Root'),
  Input: nullStub('Combobox.Input'),
  List: nullStub('Combobox.List'),
};

export const Select = {
  Root: nullStub('Select.Root'),
  Trigger: nullStub('Select.Trigger'),
  List: nullStub('Select.List'),
};

export const Search = {
  Root: nullStub('Search.Root'),
  Input: nullStub('Search.Input'),
  List: nullStub('Search.List'),
};

export const MultiSelect = {
  Root: nullStub('MultiSelect.Root'),
  Input: nullStub('MultiSelect.Input'),
  Chips: nullStub('MultiSelect.Chips'),
  List: nullStub('MultiSelect.List'),
  SelectAll: nullStub('MultiSelect.SelectAll'),
};
