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
  useMemo,
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
import { inDomOrder } from './_dom-order.js';
import { useClickOutside } from './positioning.js';
import { Menu } from './Menu.js';

/**
 * ContextMenu - Menu opened by right-click (or long-press, in
 * future). Same a11y model as Menu (role="menu" + role="menuitem"
 * + arrow-key nav), but the trigger is a region rather than a
 * button, and the menu opens at the pointer coordinates.
 *
 * ```tsx
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>
 *     <Box>Right-click me</Box>
 *   </ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item onSelect={cut}>Cut</ContextMenu.Item>
 *     <ContextMenu.Item onSelect={copy}>Copy</ContextMenu.Item>
 *     <ContextMenu.Item onSelect={paste}>Paste</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu.Root>
 * ```
 */

interface ContextMenuContextValue {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly contentId: string;
  readonly position: { x: number; y: number };
  readonly setPosition: (p: { x: number; y: number }) => void;
}
const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);
function useContextMenuContext(component: string): ContextMenuContextValue {
  const ctx = useContext(ContextMenuContext);
  if (ctx === null) throw new Error(`${component} must be inside <ContextMenu.Root>.`);
  return ctx;
}

export interface ContextMenuRootProps {
  children?: ReactNode;
}
function Root({ children }: ContextMenuRootProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reactId = useId();
  // Memoized so consumers don't re-render on every provider render (parity
  // with Menu/Dialog/Popover). setOpen/setPosition are stable useState setters.
  const value = useMemo(
    () => ({ open, setOpen, contentId: `${reactId}-contextmenu`, position, setPosition }),
    [open, position, reactId],
  );
  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>;
}

export interface ContextMenuTriggerProps {
  children: ReactElement<{
    onContextMenu?: (e: MouseEvent<HTMLElement>) => void;
  }>;
}
function Trigger({ children }: ContextMenuTriggerProps): ReactElement {
  const ctx = useContextMenuContext('ContextMenu.Trigger');
  if (!isValidElement(children)) throw new Error('ContextMenu.Trigger expects a single element.');
  const childOnContextMenu = children.props.onContextMenu;
  return cloneElement(children, {
    onContextMenu: (e: MouseEvent<HTMLElement>) => {
      childOnContextMenu?.(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      // Store document-relative coordinates: the Content is portaled to
      // <body> as position:absolute (document-flow), but clientX/Y are
      // viewport-relative. Without the scroll offset the menu lands
      // `scrollY` px above the pointer on a scrolled page.
      ctx.setPosition({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
      ctx.setOpen(true);
    },
  });
}

export interface ContextMenuContentProps {
  style?: CSSProperties;
  children?: ReactNode;
}
function Content({ style, children }: ContextMenuContentProps): ReactElement | null {
  const ctx = useContextMenuContext('ContextMenu.Content');
  const itemsRef = useRef<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const floatingRef = useRef<HTMLDivElement | null>(null);

  // Remember the element focused before the menu opened so focus can return
  // to it on close. A context menu has no single trigger button (it opens
  // wherever the user right-clicks), so the previously-focused element is
  // the correct restore target per the WAI-ARIA menu pattern. Without this,
  // closing the menu (Escape or click-outside) dropped focus to <body>.
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const dismiss = useCallback(() => {
    ctx.setOpen(false);
    restoreFocusRef.current?.focus();
  }, [ctx]);
  useClickOutside(ctx.open, floatingRef, dismiss);
  // Memoized (above the early-return so the hook order is stable) so item
  // consumers don't re-render on every Content render.
  const itemsValue = useMemo(() => ({ itemsRef, dismiss }), [itemsRef, dismiss]);

  // Auto-focus first item on open (after capturing the prior focus owner).
  useEffect(() => {
    if (!ctx.open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const firstEl = inDomOrder(itemsRef.current).find(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    );
    if (firstEl !== undefined) {
      setActiveIndex(itemsRef.current.indexOf(firstEl));
      firstEl.focus();
    } else {
      // All items disabled - focus the menu container so Escape still closes.
      floatingRef.current?.focus();
    }
  }, [ctx.open]);

  if (!ctx.open) return null;

  function focusItem(i: number): void {
    if (itemsRef.current[i] !== undefined) {
      setActiveIndex(i);
      itemsRef.current[i].focus();
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    // Escape works even with every item disabled - handle before the
    // all-disabled early-return.
    if (e.key === 'Escape') {
      e.preventDefault();
      dismiss();
      return;
    }
    // DOM order, not mount order, so navigation follows visual order.
    const enabled = inDomOrder(itemsRef.current)
      .map((el) => ({ el, i: itemsRef.current.indexOf(el) }))
      .filter((it) => it.el.getAttribute('aria-disabled') !== 'true');
    if (enabled.length === 0) return;
    const cur = enabled.findIndex((it) => it.i === activeIndex);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(enabled[(cur + 1) % enabled.length]!.i);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(enabled[(cur - 1 + enabled.length) % enabled.length]!.i);
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
      <ContextMenuItemsContext.Provider value={itemsValue}>
        <div
          ref={floatingRef}
          id={ctx.contentId}
          role="menu"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          style={{
            position: 'absolute',
            top: ctx.position.y,
            left: ctx.position.x,
            zIndex: 1000,
            ...style,
          }}
        >
          {children}
        </div>
      </ContextMenuItemsContext.Provider>
    </Portal>
  );
}

const ContextMenuItemsContext = createContext<{
  itemsRef: React.RefObject<HTMLElement[]>;
  dismiss: () => void;
} | null>(null);

interface ContextMenuItemChildProps {
  ref?: Ref<HTMLElement>;
  role?: string;
  tabIndex?: number;
  'aria-disabled'?: boolean | undefined;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  style?: CSSProperties;
}

function Item({
  onSelect,
  disabled = false,
  children,
  style,
  asChild = false,
}: {
  onSelect?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  /** Project the menu-item semantics onto a provided element instead of the
   * default `<div>` (so a styled wrapper can be the focusable item). */
  asChild?: boolean;
}): ReactElement {
  const ctxValue = useContext(ContextMenuItemsContext);
  if (ctxValue === null) throw new Error('ContextMenu.Item must be inside ContextMenu.Content.');
  const itemsCtx = ctxValue;
  const ref = useRef<HTMLElement | null>(null);

  // Register once on mount / unregister on unmount. Keyed on the stable
  // itemsRef so it doesn't re-run every render (which previously spliced
  // the item out and back in, making the registry order render-dependent).
  useEffect(() => {
    const el = ref.current;
    if (el === null) return;
    const items = itemsCtx.itemsRef.current;
    if (!items.includes(el)) items.push(el);
    return () => {
      const idx = items.indexOf(el);
      if (idx !== -1) items.splice(idx, 1);
    };
  }, [itemsCtx.itemsRef]);

  function activate(): void {
    if (disabled) return;
    onSelect?.();
    itemsCtx.dismiss();
  }

  const itemProps = {
    role: 'menuitem',
    tabIndex: -1,
    'aria-disabled': disabled || undefined,
    onClick: (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      activate();
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    },
  };
  const cursorStyle: CSSProperties = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
  };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<ContextMenuItemChildProps>;
    return cloneElement(child, {
      ...itemProps,
      ref: mergeRefs(child.props.ref, ref),
      style: { ...cursorStyle, ...child.props.style, ...style },
    });
  }

  return (
    <div ref={ref as Ref<HTMLDivElement>} {...itemProps} style={{ ...cursorStyle, ...style }}>
      {children}
    </div>
  );
}

/**
 * Parts exported flat so `src/index.ts` can assemble the namespace in the
 * server graph, where each one is already a client reference. Internal: the
 * barrel re-exports by name and does not list these.
 */
export {
  Root as ContextMenuRoot,
  Trigger as ContextMenuTrigger,
  Content as ContextMenuContent,
  Item as ContextMenuItem,
};

export const ContextMenuSeparator = Menu.Separator;

export const ContextMenu = { Root, Trigger, Content, Item, Separator: Menu.Separator };
