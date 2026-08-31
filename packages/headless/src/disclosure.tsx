'use client';

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { mergeRefs } from './_compose-refs.js';

// Stable empty selection for a controlled Accordion cleared to
// `value={undefined}` - keeps a constant identity across renders.
const EMPTY_ACCORDION_VALUE: readonly string[] = [];

/**
 * Disclosure family - Collapsible, Accordion, Tabs.
 *
 * Each follows a Trigger + Content shape. Collapsible is the
 * single-disclosure case; Accordion is many Collapsibles linked
 * via context (single- or multi-open); Tabs is a horizontal
 * sibling-tab pattern with arrow-key navigation and the standard
 * ARIA tabs/tab/tabpanel roles.
 */

// ─────────── Collapsible ──────────────────────────────────────────

interface CollapsibleContextValue {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly contentId: string;
  readonly triggerId: string;
}
const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);
function useCollapsibleContext(component: string): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext);
  if (ctx === null) throw new Error(`${component} must be inside <Collapsible.Root>.`);
  return ctx;
}

export interface CollapsibleRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
function CollapsibleRoot(props: CollapsibleRootProps): ReactElement {
  const { open: controlled, defaultOpen = false, onOpenChange, children } = props;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  // Prop-presence detection so `open={undefined}` stays controlled.
  const isControlled = 'open' in props;
  const open = (isControlled ? controlled : uncontrolled) ?? false;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );
  const id = useId();
  return (
    <CollapsibleContext.Provider
      value={{
        open,
        setOpen,
        contentId: `${id}-collapsible-content`,
        triggerId: `${id}-collapsible-trigger`,
      }}
    >
      {children}
    </CollapsibleContext.Provider>
  );
}

interface CollapsibleTriggerChildProps {
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  id?: string;
}
function CollapsibleTrigger({
  children,
}: {
  children: ReactElement<CollapsibleTriggerChildProps>;
}): ReactElement {
  const ctx = useCollapsibleContext('Collapsible.Trigger');
  if (!isValidElement(children)) throw new Error('Collapsible.Trigger expects a single element.');
  const childOnClick = children.props.onClick;
  return cloneElement(children, {
    id: ctx.triggerId,
    'aria-expanded': ctx.open,
    'aria-controls': ctx.contentId,
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
    },
  });
}

function CollapsibleContent({
  children,
  forceMount = false,
  style,
}: {
  children?: ReactNode;
  /** Render the content even when closed (callers can hide via CSS).
   * Useful for animation. */
  forceMount?: boolean;
  style?: CSSProperties;
}): ReactElement | null {
  const ctx = useCollapsibleContext('Collapsible.Content');
  if (!ctx.open && !forceMount) return null;
  return (
    <div
      id={ctx.contentId}
      role="region"
      aria-labelledby={ctx.triggerId}
      hidden={!ctx.open}
      style={style}
    >
      {children}
    </div>
  );
}

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
};

// ─────────── Accordion ────────────────────────────────────────────

interface AccordionContextValue {
  readonly type: 'single' | 'multiple';
  readonly value: readonly string[];
  readonly toggle: (id: string) => void;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);
function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (ctx === null) throw new Error(`${component} must be inside <Accordion.Root>.`);
  return ctx;
}

export interface AccordionRootProps {
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  children?: ReactNode;
}
function AccordionRoot(props: AccordionRootProps): ReactElement {
  const { type = 'single', value: controlled, defaultValue = [], onValueChange, children } = props;
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue);
  // Prop-presence detection so `value={undefined}` stays controlled-and-empty.
  const isControlled = 'value' in props;
  const value: readonly string[] = isControlled
    ? (controlled ?? EMPTY_ACCORDION_VALUE)
    : uncontrolled;
  const toggle = useCallback(
    (id: string) => {
      const isOpen = value.includes(id);
      let next: string[];
      if (isOpen) next = value.filter((v) => v !== id);
      else if (type === 'single') next = [id];
      else next = [...value, id];
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [value, type, isControlled, onValueChange],
  );
  return (
    <AccordionContext.Provider value={{ type, value, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  /** Stable id used in the controlled `value` array. */
  value: string;
  children?: ReactNode;
}
function AccordionItem({ value, children }: AccordionItemProps): ReactElement {
  const ctx = useAccordionContext('Accordion.Item');
  const open = ctx.value.includes(value);
  return (
    <Collapsible.Root open={open} onOpenChange={() => ctx.toggle(value)}>
      {children}
    </Collapsible.Root>
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: Collapsible.Trigger,
  Content: Collapsible.Content,
};

// ─────────── Tabs ─────────────────────────────────────────────────

interface TabsContextValue {
  readonly value: string;
  readonly setValue: (v: string) => void;
  readonly idPrefix: string;
  readonly orientation: 'horizontal' | 'vertical';
}
const TabsContext = createContext<TabsContextValue | null>(null);
function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (ctx === null) throw new Error(`${component} must be inside <Tabs.Root>.`);
  return ctx;
}

export interface TabsRootProps {
  /** Controlled active tab value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}
function TabsRoot(props: TabsRootProps): ReactElement {
  const {
    value: controlled,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    children,
  } = props;
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue);
  // Prop-presence detection so `value={undefined}` stays controlled (empty).
  const isControlled = 'value' in props;
  const value = (isControlled ? controlled : uncontrolled) ?? '';
  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolled(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );
  const idPrefix = useId();
  return (
    <TabsContext.Provider value={{ value, setValue, idPrefix, orientation }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabsList({
  children,
  asChild = false,
  style,
}: {
  children?: ReactNode;
  /** Render the role onto the single child element instead of a `<div>`,
   * so a styled wrapper can be the tablist. */
  asChild?: boolean;
  style?: CSSProperties;
}): ReactElement {
  const ctx = useTabsContext('Tabs.List');
  const listProps = { role: 'tablist' as const, 'aria-orientation': ctx.orientation, style };
  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, listProps);
  }
  return <div {...listProps}>{children}</div>;
}

export interface TabsTabProps {
  value: string;
  disabled?: boolean;
  /** Render the tab semantics onto the single child element instead of a
   * `<button>`. The child receives `role="tab"`, `aria-selected`, focus
   * management, and the click/key handlers - so a styled element (e.g. a motif
   * `Box as="button"`) can be the tab and react to `aria-selected` in CSS. */
  asChild?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}
function TabsTab({
  value,
  disabled = false,
  asChild = false,
  children,
  style,
}: TabsTabProps): ReactElement {
  const ctx = useTabsContext('Tabs.Tab');
  const ref = useRef<HTMLButtonElement | null>(null);
  const selected = ctx.value === value;

  function moveFocus(direction: 1 | -1): void {
    const list = ref.current?.parentElement;
    if (list === undefined || list === null) return;
    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    );
    if (tabs.length === 0) return;
    const cur = tabs.indexOf(ref.current!);
    const next = tabs[(cur + direction + tabs.length) % tabs.length]!;
    next.focus();
    next.click();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>): void {
    if (ctx.orientation === 'horizontal') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveFocus(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveFocus(-1);
      }
    } else {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveFocus(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveFocus(-1);
      }
    }
    if (e.key === 'Home') {
      e.preventDefault();
      const list = ref.current?.parentElement;
      const first = list?.querySelector<HTMLButtonElement>('[role="tab"]:not([disabled])');
      first?.focus();
      first?.click();
    } else if (e.key === 'End') {
      e.preventDefault();
      const list = ref.current?.parentElement;
      const tabs = list?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])');
      const last = tabs?.[tabs.length - 1];
      last?.focus();
      last?.click();
    }
  }

  const tabProps = {
    type: 'button' as const,
    role: 'tab' as const,
    id: `${ctx.idPrefix}-tab-${value}`,
    'aria-controls': `${ctx.idPrefix}-panel-${value}`,
    'aria-selected': selected,
    tabIndex: selected ? 0 : -1,
    disabled,
    onClick: () => ctx.setValue(value),
    onKeyDown,
    style,
  };
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ ref?: Ref<HTMLButtonElement> }>;
    return cloneElement(child, { ...tabProps, ref: mergeRefs(child.props.ref, ref) });
  }
  return (
    <button ref={ref} {...tabProps}>
      {children}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  forceMount?: boolean;
  /** Render the panel semantics onto the single child element instead of a
   * `<div>`. */
  asChild?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}
function TabsPanel({
  value,
  forceMount = false,
  asChild = false,
  children,
  style,
}: TabsPanelProps): ReactElement | null {
  const ctx = useTabsContext('Tabs.Panel');
  const active = ctx.value === value;
  if (!active && !forceMount) return null;
  const panelProps = {
    role: 'tabpanel' as const,
    id: `${ctx.idPrefix}-panel-${value}`,
    'aria-labelledby': `${ctx.idPrefix}-tab-${value}`,
    hidden: !active,
    tabIndex: 0,
    style,
  };
  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, panelProps);
  }
  return <div {...panelProps}>{children}</div>;
}

export const Tabs = { Root: TabsRoot, List: TabsList, Tab: TabsTab, Panel: TabsPanel };

// Suppress unused warning - kept for future imperative APIs.
export { useEffect };
