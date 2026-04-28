'use client';

import { Portal } from '@motif-js/react-web';
import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useClickOutside, useFloatingPosition, type Placement } from './positioning.js';

/**
 * Form-input behavioral family — Combobox, Select, MultiSelect,
 * Search, CommandPalette.
 *
 * All share the listbox + option ARIA pattern (`role="combobox"`
 * on the input or button, `role="listbox"` on the popup, `role="option"`
 * on each item) and the standard keyboard navigation (ArrowDown /
 * ArrowUp to move highlight, Home / End to jump, Enter to select,
 * Escape to close).
 *
 * v0 ships Combobox + Select + Search; MultiSelect + CommandPalette
 * are documented thin wrappers / stubs intended for a v1.x patch
 * (multi-selection state shape + section labels need their own
 * design rounds).
 */

// ─────────── Combobox ─────────────────────────────────────────────

export interface ComboboxOption<T = string> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
}

interface ComboboxContextValue<T = string> {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly value: T | undefined;
  readonly setValue: (next: T | undefined) => void;
  readonly inputValue: string;
  readonly setInputValue: (next: string) => void;
  readonly options: ReadonlyArray<ComboboxOption<T>>;
  readonly highlightedIndex: number;
  readonly setHighlightedIndex: (i: number) => void;
  readonly listboxId: string;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
}
const ComboboxContext = createContext<ComboboxContextValue<unknown> | null>(null);
function useComboboxContext<T>(component: string): ComboboxContextValue<T> {
  const ctx = useContext(ComboboxContext);
  if (ctx === null) throw new Error(`${component} must be inside <Combobox.Root>.`);
  return ctx as ComboboxContextValue<T>;
}

export interface ComboboxRootProps<T = string> {
  options: ReadonlyArray<ComboboxOption<T>>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (next: T | undefined) => void;
  inputValue?: string;
  onInputValueChange?: (next: string) => void;
  /** Custom filter. Defaults to case-insensitive substring match
   * against `option.label`. */
  filter?: (option: ComboboxOption<T>, input: string) => boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
function ComboboxRoot<T>({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  inputValue: controlledInput,
  onInputValueChange,
  filter,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: ComboboxRootProps<T>): ReactElement {
  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : openUncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setOpenUncontrolled(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const [valueUncontrolled, setValueUncontrolled] = useState<T | undefined>(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : valueUncontrolled;
  const setValue = useCallback(
    (next: T | undefined) => {
      if (!isValueControlled) setValueUncontrolled(next);
      onValueChange?.(next);
    },
    [isValueControlled, onValueChange],
  );

  const [inputUncontrolled, setInputUncontrolled] = useState('');
  const isInputControlled = controlledInput !== undefined;
  const inputValue = isInputControlled ? controlledInput : inputUncontrolled;
  const setInputValue = useCallback(
    (next: string) => {
      if (!isInputControlled) setInputUncontrolled(next);
      onInputValueChange?.(next);
    },
    [isInputControlled, onInputValueChange],
  );

  const filtered = useMemo(() => {
    const fn = filter ?? defaultFilter;
    return options.filter((o) => fn(o, inputValue));
  }, [options, inputValue, filter]);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const reactId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <ComboboxContext.Provider
      value={
        {
          open,
          setOpen,
          value: value as unknown,
          setValue: setValue as (next: unknown) => void,
          inputValue,
          setInputValue,
          options: filtered as ReadonlyArray<ComboboxOption<unknown>>,
          highlightedIndex,
          setHighlightedIndex,
          listboxId: `${reactId}-listbox`,
          inputRef,
        } satisfies ComboboxContextValue<unknown>
      }
    >
      {children}
    </ComboboxContext.Provider>
  );
}

function defaultFilter<T>(option: ComboboxOption<T>, input: string): boolean {
  if (input.length === 0) return true;
  return option.label.toLowerCase().includes(input.toLowerCase());
}

interface ComboboxInputChildProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  role?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-activedescendant'?: string;
  'aria-autocomplete'?: 'list' | 'inline' | 'both' | 'none';
  ref?: React.Ref<HTMLInputElement>;
}
function ComboboxInput<T>({
  children,
  placeholder,
}: {
  children?: ReactElement<ComboboxInputChildProps>;
  placeholder?: string;
}): ReactElement {
  const ctx = useComboboxContext<T>('Combobox.Input');
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    const max = ctx.options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!ctx.open) ctx.setOpen(true);
        ctx.setHighlightedIndex(Math.min(max, ctx.highlightedIndex + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        ctx.setHighlightedIndex(Math.max(0, ctx.highlightedIndex - 1));
        break;
      case 'Home':
        e.preventDefault();
        ctx.setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        ctx.setHighlightedIndex(max);
        break;
      case 'Enter':
        if (ctx.highlightedIndex >= 0 && ctx.highlightedIndex <= max) {
          e.preventDefault();
          const opt = ctx.options[ctx.highlightedIndex]!;
          if (opt.disabled !== true) {
            ctx.setValue(opt.value);
            ctx.setInputValue(opt.label);
            ctx.setOpen(false);
          }
        }
        break;
      case 'Escape':
        if (ctx.open) {
          e.preventDefault();
          ctx.setOpen(false);
        }
        break;
    }
  };

  const sharedProps = {
    ref: ctx.inputRef as React.Ref<HTMLInputElement>,
    role: 'combobox',
    'aria-expanded': ctx.open,
    'aria-controls': ctx.listboxId,
    'aria-autocomplete': 'list' as const,
    ...(ctx.highlightedIndex >= 0 && ctx.options[ctx.highlightedIndex] !== undefined
      ? { 'aria-activedescendant': `${ctx.listboxId}-option-${ctx.highlightedIndex}` }
      : {}),
    value: ctx.inputValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctx.setInputValue(e.target.value);
      if (!ctx.open) ctx.setOpen(true);
    },
    onFocus: () => ctx.setOpen(true),
    onKeyDown,
  };

  if (children !== undefined && isValidElement(children)) {
    return cloneElement(children, sharedProps);
  }
  return <input type="text" placeholder={placeholder} {...sharedProps} />;
}

function ComboboxList<T>({
  placement = 'bottom',
  offset = 4,
  style,
  renderOption,
  emptyMessage = 'No options',
}: {
  placement?: Placement;
  offset?: number;
  style?: CSSProperties;
  /** Override how each option renders. */
  renderOption?: (
    option: ComboboxOption<T>,
    info: {
      highlighted: boolean;
      selected: boolean;
      index: number;
    },
  ) => ReactNode;
  emptyMessage?: ReactNode;
}): ReactElement | null {
  const ctx = useComboboxContext<T>('Combobox.List');
  const { position, floatingRef } = useFloatingPosition(
    ctx.inputRef as unknown as React.RefObject<HTMLElement | null>,
    ctx.open,
    placement,
    offset,
  );
  useClickOutside(ctx.open, floatingRef, () => ctx.setOpen(false));
  if (!ctx.open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef}
        id={ctx.listboxId}
        role="listbox"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          zIndex: 1000,
          ...style,
        }}
      >
        {ctx.options.length === 0 ? (
          <div role="option" aria-disabled="true" aria-selected="false">
            {emptyMessage}
          </div>
        ) : (
          ctx.options.map((opt, i) => {
            const optionId = `${ctx.listboxId}-option-${i}`;
            const highlighted = ctx.highlightedIndex === i;
            const selected = ctx.value === opt.value;
            const handleClick = (): void => {
              if (opt.disabled === true) return;
              ctx.setValue(opt.value);
              ctx.setInputValue(opt.label);
              ctx.setOpen(false);
            };
            return (
              <div
                key={optionId}
                id={optionId}
                role="option"
                aria-selected={selected}
                aria-disabled={opt.disabled || undefined}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleClick();
                }}
                onMouseEnter={() => ctx.setHighlightedIndex(i)}
              >
                {renderOption !== undefined
                  ? renderOption(opt, { highlighted, selected, index: i })
                  : opt.label}
              </div>
            );
          })
        )}
      </div>
    </Portal>
  );
}

export const Combobox = { Root: ComboboxRoot, Input: ComboboxInput, List: ComboboxList };

// ─────────── Select ───────────────────────────────────────────────

/**
 * Select — button-triggered listbox. Composition is a thin wrapper
 * over Combobox: instead of a typeable input, a Trigger button
 * displays the current value and opens the list. Filtering /
 * type-ahead is intentionally NOT a feature here — for that, use
 * Combobox.
 */
export interface SelectRootProps<T = string> extends Omit<
  ComboboxRootProps<T>,
  'inputValue' | 'onInputValueChange' | 'filter'
> {
  /** Placeholder rendered when no value is selected. */
  placeholder?: string;
}
function SelectRoot<T>(props: SelectRootProps<T>): ReactElement {
  return <Combobox.Root {...props} />;
}

interface SelectTriggerChildProps {
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  'aria-haspopup'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  ref?: React.Ref<HTMLElement>;
}
function SelectTrigger<T>({
  children,
}: {
  children: ReactElement<SelectTriggerChildProps>;
}): ReactElement {
  const ctx = useComboboxContext<T>('Select.Trigger');
  if (!isValidElement(children)) throw new Error('Select.Trigger expects a single element.');
  const childOnClick = children.props.onClick;
  const childOnKeyDown = children.props.onKeyDown;
  return cloneElement(children, {
    ref: ctx.inputRef as unknown as React.Ref<HTMLElement>,
    'aria-haspopup': 'listbox',
    'aria-expanded': ctx.open,
    'aria-controls': ctx.listboxId,
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      childOnKeyDown?.(e);
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!ctx.open) ctx.setOpen(true);
      }
    },
  });
}

export const Select = { Root: SelectRoot, Trigger: SelectTrigger, List: ComboboxList };

// ─────────── Search ───────────────────────────────────────────────

/**
 * Search — Combobox tuned for free-text input. Same prop surface;
 * the only difference is `aria-autocomplete="list"` is fixed (no
 * inline autocomplete) and a `role="search"` wrapper is rendered
 * around the trigger / list.
 */
export const Search = {
  Root: <T,>({ children, ...rest }: ComboboxRootProps<T>): ReactElement => (
    <div role="search">
      <Combobox.Root {...rest}>{children}</Combobox.Root>
    </div>
  ),
  Input: ComboboxInput,
  List: ComboboxList,
};

// ─────────── MultiSelect (v0 stub) ────────────────────────────────

/**
 * MultiSelect — placeholder. v0 doesn't ship a real implementation
 * because the multi-selection state shape (chips inside the input,
 * remove handlers, max-selection limits, "select all") needs its
 * own design round. The compose-time API will mirror Combobox with
 * a `value: T[]` shape; track this for a v1.x patch.
 */
export function MultiSelect(): ReactElement {
  throw new Error(
    'MultiSelect is not yet implemented; track this in @motif-js v1.x. ' +
      'Use <Combobox> with a custom filter + chip layer in the meantime.',
  );
}

// ─────────── CommandPalette (v0 stub) ─────────────────────────────

/**
 * CommandPalette — placeholder. v0 doesn't ship a real
 * implementation because command-palette UX needs section labels,
 * keyboard shortcuts visualisation, recent commands, fuzzy search,
 * and Cmd+K activation — each of those needs its own design round.
 * Track for a v1.x patch.
 */
export function CommandPalette(): ReactElement {
  throw new Error(
    'CommandPalette is not yet implemented; track this in @motif-js v1.x. ' +
      'Compose <Combobox> + <Dialog> + a fuzzy-match library for the meantime.',
  );
}
