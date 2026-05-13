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
} from 'react';
import { useClickOutside } from './positioning.js';
import { Menu } from './Menu.js';

/**
 * ContextMenu — Menu opened by right-click (or long-press, in
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
  return (
    <ContextMenuContext.Provider
      value={{ open, setOpen, contentId: `${reactId}-contextmenu`, position, setPosition }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
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
      ctx.setPosition({ x: e.clientX, y: e.clientY });
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

  const dismiss = useCallback(() => ctx.setOpen(false), [ctx]);
  useClickOutside(ctx.open, floatingRef, dismiss);

  // Auto-focus first item on open.
  useEffect(() => {
    if (!ctx.open) return;
    const first = itemsRef.current.findIndex((el) => el.getAttribute('aria-disabled') !== 'true');
    if (first !== -1) {
      setActiveIndex(first);
      itemsRef.current[first]?.focus();
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
    const enabled = itemsRef.current
      .map((el, i) => ({ el, i }))
      .filter((it) => it.el.getAttribute('aria-disabled') !== 'true');
    if (enabled.length === 0) return;
    const cur = enabled.findIndex((it) => it.i === activeIndex);
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        dismiss();
        break;
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
      <ContextMenuItemsContext.Provider value={{ itemsRef, dismiss }}>
        <div
          ref={floatingRef}
          id={ctx.contentId}
          role="menu"
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

function Item({
  onSelect,
  disabled = false,
  children,
  style,
}: {
  onSelect?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}): ReactElement {
  const ctxValue = useContext(ContextMenuItemsContext);
  if (ctxValue === null) throw new Error('ContextMenu.Item must be inside ContextMenu.Content.');
  const itemsCtx = ctxValue;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;
    const items = itemsCtx.itemsRef.current;
    if (!items.includes(el)) items.push(el);
    return () => {
      const idx = items.indexOf(el);
      if (idx !== -1) items.splice(idx, 1);
    };
  });

  function activate(): void {
    if (disabled) return;
    onSelect?.();
    itemsCtx.dismiss();
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

export const ContextMenu = { Root, Trigger, Content, Item, Separator: Menu.Separator };
