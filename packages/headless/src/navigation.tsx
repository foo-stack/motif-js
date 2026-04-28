'use client';

import {
  Children,
  isValidElement,
  useCallback,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * Navigation family — Pagination, Breadcrumb, Stepper,
 * NavigationMenu, Toolbar.
 *
 * Each is small but well-typed: ARIA roles and keyboard nav where
 * relevant. NavigationMenu in v0 is a single-level menu; nested
 * submenus are queued for v1.x.
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
 * NavigationMenu — top-level horizontal nav. v0 ships a flat
 * single-level pattern: a list of links / buttons with optional
 * `current` highlighting. Multi-level submenus are queued for v1.x;
 * the compose-time API mirrors what HTML `<nav>` already does.
 */
export interface NavigationMenuProps {
  /** A11y label. */
  'aria-label'?: string;
  /** id of the active item, applied via `aria-current="page"`. */
  current?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
export function NavigationMenu({
  'aria-label': label = 'Primary',
  current,
  children,
  style,
}: NavigationMenuProps): ReactElement {
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
