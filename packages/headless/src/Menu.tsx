'use client';

import { Portal } from '@usemotif/react';
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
  type RefObject,
} from 'react';
import { useClickOutside, useFloatingPosition, type Placement } from './positioning.js';

/**
 * Menu — accessible dropdown menu with arrow-key navigation.
 *
 * Roles: trigger has `aria-haspopup="menu"` + `aria-expanded`; the
 * panel has `role="menu"`; each item has `role="menuitem"`. Arrow
 * keys move focus between items, Home / End jump to first / last,
 * Enter / Space activates, Escape closes and returns focus to the
 * trigger.
 *
 * Compose-time API:
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger><Button>Actions</Button></Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item onSelect={() => save()}>Save</Menu.Item>
 *     <Menu.Item onSelect={() => duplicate()}>Duplicate</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item disabled onSelect={() => delete()}>Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 *
 * Submenus, checkbox / radio menu items, and section labels are
 * follow-up work (the most common roster ships in v0).
 */

interface MenuContextValue {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly contentId: string;
  readonly triggerRef: RefObject<HTMLElement | null>;
  readonly itemsRef: RefObject<HTMLElement[]>;
  readonly activeIndex: number;
  readonly setActiveIndex: (i: number) => void;
}
const MenuContext = createContext<MenuContextValue | null>(null);
function useMenuContext(component: string): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (ctx === null) throw new Error(`${component} must be inside <Menu.Root>.`);
  return ctx;
}

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
function Root({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: MenuRootProps): ReactElement {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );
  const reactId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset focused item when re-opening.
  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  return (
    <MenuContext.Provider
      value={{
        open,
        setOpen,
        contentId: `${reactId}-menu`,
        triggerRef,
        itemsRef,
        activeIndex,
        setActiveIndex,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export interface MenuTriggerProps {
  children: ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    'aria-expanded'?: boolean;
    'aria-haspopup'?: string;
    'aria-controls'?: string;
    ref?: React.Ref<HTMLElement>;
  }>;
}
function Trigger({ children }: MenuTriggerProps): ReactElement {
  const ctx = useMenuContext('Menu.Trigger');
  if (!isValidElement(children)) throw new Error('Menu.Trigger expects a single element.');
  const childOnClick = children.props.onClick;
  const childOnKeyDown = children.props.onKeyDown;
  return cloneElement(children, {
    ref: ctx.triggerRef as React.Ref<HTMLElement>,
    'aria-expanded': ctx.open,
    'aria-haspopup': 'menu',
    'aria-controls': ctx.contentId,
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      childOnKeyDown?.(e);
      if (!ctx.open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        ctx.setOpen(true);
      }
    },
  });
}

export interface MenuContentProps {
  placement?: Placement;
  offset?: number;
  style?: CSSProperties;
  children?: ReactNode;
}
function Content({
  placement = 'bottom',
  offset = 8,
  style,
  children,
}: MenuContentProps): ReactElement | null {
  const ctx = useMenuContext('Menu.Content');
  const dismiss = useCallback(() => {
    ctx.setOpen(false);
    ctx.triggerRef.current?.focus();
  }, [ctx]);
  const { position, floatingRef } = useFloatingPosition(
    ctx.triggerRef,
    ctx.open,
    placement,
    offset,
  );
  useClickOutside(ctx.open, floatingRef, () => ctx.setOpen(false));

  // Auto-focus the first enabled item on open.
  useEffect(() => {
    if (!ctx.open) return;
    const first = ctx.itemsRef.current.findIndex(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    );
    if (first !== -1) {
      ctx.setActiveIndex(first);
      ctx.itemsRef.current[first]?.focus();
    }
  }, [ctx.open, ctx]);

  if (!ctx.open) return null;

  function focusItem(index: number): void {
    const items = ctx.itemsRef.current;
    if (items[index] !== undefined) {
      ctx.setActiveIndex(index);
      items[index].focus();
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    const items = ctx.itemsRef.current;
    const enabled = items
      .map((el, i) => ({ el, i }))
      .filter((it) => it.el.getAttribute('aria-disabled') !== 'true');
    if (enabled.length === 0) return;
    const currentEnabledIdx = enabled.findIndex((it) => it.i === ctx.activeIndex);
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        dismiss();
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusItem(enabled[(currentEnabledIdx + 1) % enabled.length]!.i);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(enabled[(currentEnabledIdx - 1 + enabled.length) % enabled.length]!.i);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(enabled[0]!.i);
        break;
      case 'End':
        e.preventDefault();
        focusItem(enabled[enabled.length - 1]!.i);
        break;
    }
  }

  return (
    <Portal>
      <div
        ref={floatingRef}
        id={ctx.contentId}
        role="menu"
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          zIndex: 1000,
          ...style,
        }}
      >
        {children}
      </div>
    </Portal>
  );
}

export interface MenuItemProps {
  onSelect?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  /** Inline style passed straight through. */
  style?: CSSProperties;
}
function Item({ onSelect, disabled = false, children, style }: MenuItemProps): ReactElement {
  const ctx = useMenuContext('Menu.Item');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;
    const items = ctx.itemsRef.current;
    if (!items.includes(el)) items.push(el);
    return () => {
      const idx = items.indexOf(el);
      if (idx !== -1) items.splice(idx, 1);
    };
  });

  function activate(): void {
    if (disabled) return;
    onSelect?.();
    ctx.setOpen(false);
    ctx.triggerRef.current?.focus();
  }

  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        e.preventDefault();
        activate();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      }}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', ...style }}
    >
      {children}
    </div>
  );
}

function Separator({ style }: { style?: CSSProperties }): ReactElement {
  return (
    <div
      role="separator"
      style={{ height: 1, background: 'currentColor', opacity: 0.15, ...style }}
    />
  );
}

export const Menu = { Root, Trigger, Content, Item, Separator };
