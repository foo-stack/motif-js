'use client';

import { Portal } from '@motif-js/react-web';
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useFloatingPosition } from './positioning.js';

/**
 * Navigation family — Pagination, Breadcrumb, Stepper,
 * NavigationMenu, Toolbar.
 *
 * Each is small but well-typed: ARIA roles and keyboard nav where
 * relevant. NavigationMenu accepts either a flat `children` set
 * (single-level horizontal nav) or a recursive `items` tree
 * (multi-level nav with hover / focus / arrow-key submenu activation).
 */

// ─────────── Pagination ───────────────────────────────────────────

export interface PaginationProps {
  page: number;
  total: number;
  /** Optional callback. Pagination is controlled-only. */
  onPageChange?: (next: number) => void;
  /** Number of sibling pages to show on each side of the current page. */
  siblings?: number;
  /** Render fn for each page button. */
  renderItem: (info: {
    type: 'page' | 'previous' | 'next' | 'ellipsis';
    page?: number;
    disabled: boolean;
    selected: boolean;
    onClick: () => void;
  }) => ReactElement;
  'aria-label'?: string;
  style?: CSSProperties;
}

function pageWindow(page: number, total: number, siblings: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: Array<number | 'ellipsis'> = [1];
  const startWindow = Math.max(2, page - siblings);
  const endWindow = Math.min(total - 1, page + siblings);
  if (startWindow > 2) out.push('ellipsis');
  for (let i = startWindow; i <= endWindow; i++) out.push(i);
  if (endWindow < total - 1) out.push('ellipsis');
  out.push(total);
  return out;
}

export function Pagination({
  page,
  total,
  onPageChange,
  siblings = 1,
  renderItem,
  style,
  ...aria
}: PaginationProps): ReactElement {
  const goto = useCallback(
    (n: number) => onPageChange?.(Math.max(1, Math.min(total, n))),
    [onPageChange, total],
  );
  const window = pageWindow(page, total, siblings);
  return (
    <nav aria-label={aria['aria-label'] ?? 'Pagination'} style={style}>
      {renderItem({
        type: 'previous',
        disabled: page <= 1,
        selected: false,
        onClick: () => goto(page - 1),
      })}
      {window.map((w, i) =>
        w === 'ellipsis' ? (
          <span key={`e-${i}`}>
            {renderItem({ type: 'ellipsis', disabled: true, selected: false, onClick: () => {} })}
          </span>
        ) : (
          <span key={w}>
            {renderItem({
              type: 'page',
              page: w,
              disabled: false,
              selected: page === w,
              onClick: () => goto(w),
            })}
          </span>
        ),
      )}
      {renderItem({
        type: 'next',
        disabled: page >= total,
        selected: false,
        onClick: () => goto(page + 1),
      })}
    </nav>
  );
}

// ─────────── Breadcrumb ───────────────────────────────────────────

export interface BreadcrumbProps {
  /** A11y label for the nav landmark. Defaults to `'Breadcrumb'`. */
  'aria-label'?: string;
  /** Visual separator between items. */
  separator?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}
export function Breadcrumb({
  'aria-label': label = 'Breadcrumb',
  separator = '/',
  children,
  style,
}: BreadcrumbProps): ReactElement {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <nav aria-label={label} style={style}>
      <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} aria-current={isLast ? 'page' : undefined}>
              {item}
              {!isLast ? <span aria-hidden="true">{separator}</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─────────── Stepper ──────────────────────────────────────────────

export interface StepperStep {
  readonly id: string;
  readonly label: ReactNode;
  readonly status?: 'pending' | 'active' | 'complete' | 'error';
}
export interface StepperProps {
  steps: ReadonlyArray<StepperStep>;
  /** Current active step id (overrides per-step `status === 'active'`). */
  current?: string;
  /** Render fn for each step. */
  renderStep: (info: {
    step: StepperStep;
    index: number;
    status: 'pending' | 'active' | 'complete' | 'error';
    isLast: boolean;
  }) => ReactElement;
  orientation?: 'horizontal' | 'vertical';
  style?: CSSProperties;
}
export function Stepper({
  steps,
  current,
  renderStep,
  orientation = 'horizontal',
  style,
}: StepperProps): ReactElement {
  return (
    <ol
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {steps.map((step, i) => {
        const status: StepperStep['status'] =
          current === step.id ? 'active' : (step.status ?? 'pending');
        return (
          <li key={step.id} aria-current={status === 'active' ? 'step' : undefined}>
            {renderStep({
              step,
              index: i,
              status: status ?? 'pending',
              isLast: i === steps.length - 1,
            })}
          </li>
        );
      })}
    </ol>
  );
}

// ─────────── NavigationMenu ───────────────────────────────────────

/**
 * Recursive item shape for the multi-level NavigationMenu mode.
 * Items with `children` render as buttons that open a submenu;
 * leaf items render as anchors when `href` is set, otherwise as
 * buttons. The `render` slot lets callers swap out either form.
 */
export interface NavigationMenuItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly children?: ReadonlyArray<NavigationMenuItem>;
  /** Custom render override. Receives the computed item state. */
  readonly render?: (info: {
    readonly label: ReactNode;
    readonly isOpen: boolean;
    readonly isCurrent: boolean;
    readonly hasChildren: boolean;
    readonly toggleOpen: () => void;
  }) => ReactNode;
}

/**
 * NavigationMenu — top-level horizontal nav.
 *
 * **Flat mode** (default): pass `children` for a single-level
 * horizontal list of links / buttons.
 *
 * **Tree mode**: pass `items={[...]}` for a recursive structure
 * with submenus. Items with `children` open a popover on hover or
 * keyboard activation; ArrowRight opens a focused submenu, ArrowLeft
 * closes it. Submenus are positioned via `useFloatingPosition`.
 */
export interface NavigationMenuProps {
  /** A11y label. */
  'aria-label'?: string;
  /** id of the active item, applied via `aria-current="page"`. */
  current?: string;
  /** Recursive item tree — when provided, renders the multi-level mode. */
  items?: ReadonlyArray<NavigationMenuItem>;
  /** Flat-mode children (legacy / single-level). Ignored when `items` is set. */
  children?: ReactNode;
  style?: CSSProperties;
}
export function NavigationMenu({
  'aria-label': label = 'Primary',
  current,
  items,
  children,
  style,
}: NavigationMenuProps): ReactElement {
  if (items !== undefined) {
    return (
      <nav aria-label={label} style={style}>
        <NavigationMenuList items={items} current={current} level={0} />
      </nav>
    );
  }
  return (
    <nav aria-label={label} style={style}>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        {Children.toArray(children).map((child, i) => {
          if (!isValidElement(child)) return null;
          const id = (child.props as { id?: string }).id;
          const isCurrent = id !== undefined && id === current;
          return (
            <li key={i} aria-current={isCurrent ? 'page' : undefined}>
              {child}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function NavigationMenuList({
  items,
  current,
  level,
}: {
  items: ReadonlyArray<NavigationMenuItem>;
  current: string | undefined;
  level: number;
}): ReactElement {
  return (
    <ul
      role={level === 0 ? 'menubar' : 'menu'}
      style={{ display: level === 0 ? 'flex' : 'block', listStyle: 'none', margin: 0, padding: 0 }}
    >
      {items.map((item) => (
        <NavigationMenuNode key={item.id} item={item} current={current} level={level} />
      ))}
    </ul>
  );
}

function NavigationMenuNode({
  item,
  current,
  level,
}: {
  item: NavigationMenuItem;
  current: string | undefined;
  level: number;
}): ReactElement {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const isCurrent = item.id === current;
  const hasChildren = item.children !== undefined && item.children.length > 0;

  const toggleOpen = useCallback(() => {
    if (!hasChildren || item.disabled === true) return;
    setOpen((prev) => !prev);
  }, [hasChildren, item.disabled]);

  // Close when focus leaves the subtree.
  const closeOnBlur = useCallback((e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }, []);

  // Keyboard activation on the trigger.
  const onTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (item.disabled === true) return;
      if (hasChildren) {
        if (e.key === 'ArrowRight' || (level === 0 && e.key === 'ArrowDown')) {
          e.preventDefault();
          setOpen(true);
        } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
          if (open) {
            e.preventDefault();
            setOpen(false);
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleOpen();
        }
      }
    },
    [hasChildren, level, open, toggleOpen, item.disabled],
  );

  const sharedTriggerProps = {
    'aria-current': isCurrent ? ('page' as const) : undefined,
    'aria-haspopup': hasChildren ? ('menu' as const) : undefined,
    'aria-expanded': hasChildren ? open : undefined,
    'aria-disabled': item.disabled === true ? true : undefined,
    onMouseEnter: () => hasChildren && !item.disabled && setOpen(true),
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (item.disabled === true) {
        e.preventDefault();
        return;
      }
      if (hasChildren) {
        e.preventDefault();
        toggleOpen();
      }
    },
    onKeyDown: onTriggerKeyDown,
  };

  let trigger: ReactNode;
  if (item.render !== undefined) {
    trigger = item.render({
      label: item.label,
      isOpen: open,
      isCurrent,
      hasChildren,
      toggleOpen,
    });
  } else if (item.href !== undefined && !hasChildren) {
    trigger = (
      <a ref={triggerRef as React.Ref<HTMLAnchorElement>} href={item.href} {...sharedTriggerProps}>
        {item.label}
      </a>
    );
  } else {
    trigger = (
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        {...sharedTriggerProps}
      >
        {item.label}
      </button>
    );
  }

  return (
    <li
      onBlur={closeOnBlur}
      style={{ position: 'relative' }}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {trigger}
      {hasChildren && open ? (
        <NavigationMenuSubmenu
          items={item.children!}
          current={current}
          level={level + 1}
          anchorRef={triggerRef}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </li>
  );
}

function NavigationMenuSubmenu({
  items,
  current,
  level,
  anchorRef,
  onClose,
}: {
  items: ReadonlyArray<NavigationMenuItem>;
  current: string | undefined;
  level: number;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}): ReactElement {
  const { position, floatingRef } = useFloatingPosition(
    anchorRef,
    true,
    level === 1 ? 'bottom' : 'right',
    4,
  );

  // Close on Escape anywhere inside the submenu.
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent): void {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Portal>
      <div
        ref={floatingRef}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          zIndex: 1000,
        }}
      >
        <NavigationMenuList items={items} current={current} level={level} />
      </div>
    </Portal>
  );
}

// ─────────── Toolbar ──────────────────────────────────────────────

/**
 * Toolbar — `role="toolbar"` with arrow-key roving focus across
 * its children. Each child should be focusable; the toolbar
 * captures Arrow keys and moves focus among them.
 */
export interface ToolbarProps {
  orientation?: 'horizontal' | 'vertical';
  'aria-label'?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
export function Toolbar({
  orientation = 'horizontal',
  'aria-label': label,
  children,
  style,
}: ToolbarProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  function focusableButtons(): HTMLElement[] {
    if (ref.current === null) return [];
    return Array.from(
      ref.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
      ),
    );
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    const incKeys = orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];
    const decKeys = orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];
    const buttons = focusableButtons();
    if (buttons.length === 0) return;
    const cur = buttons.indexOf(document.activeElement as HTMLElement);
    if (incKeys.includes(e.key)) {
      e.preventDefault();
      buttons[(cur + 1) % buttons.length]?.focus();
    } else if (decKeys.includes(e.key)) {
      e.preventDefault();
      buttons[(cur - 1 + buttons.length) % buttons.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttons[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttons[buttons.length - 1]?.focus();
    }
  }

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation={orientation}
      aria-label={label}
      onKeyDown={onKeyDown}
      style={style}
    >
      {children}
    </div>
  );
}
