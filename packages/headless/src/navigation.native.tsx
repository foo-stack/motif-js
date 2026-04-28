import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native navigation family — Pagination, Breadcrumb, Stepper,
 * NavigationMenu, Toolbar. These all render with RN-incompatible HTML
 * elements (`<nav>`, `<ol>`, `<li>`, button) on the web. Native ports
 * should swap to View / Pressable / Text with the appropriate
 * `accessibilityRole`. Until that lands, the native variants null-
 * render and warn once.
 */

export interface PaginationProps {
  page: number;
  total: number;
  onPageChange?: (next: number) => void;
  siblings?: number;
  renderItem: (info: {
    type: 'page' | 'previous' | 'next' | 'ellipsis';
    page?: number;
    disabled: boolean;
    selected: boolean;
    onClick: () => void;
  }) => ReactElement;
  'aria-label'?: string;
}
export function Pagination(_props: PaginationProps): ReactElement | null {
  nativeStubWarn('Pagination');
  return null;
}

export interface BreadcrumbProps {
  separator?: ReactNode;
  children?: ReactNode;
}
export function Breadcrumb(_props: BreadcrumbProps): ReactElement | null {
  nativeStubWarn('Breadcrumb');
  return null;
}

export interface StepperStep {
  readonly id: string;
  readonly label: ReactNode;
  readonly status?: 'pending' | 'active' | 'complete' | 'error';
}
export interface StepperProps {
  steps: ReadonlyArray<StepperStep>;
  current?: string;
  renderStep: (info: {
    step: StepperStep;
    index: number;
    status: 'pending' | 'active' | 'complete' | 'error';
    isLast: boolean;
  }) => ReactElement;
  orientation?: 'horizontal' | 'vertical';
}
export function Stepper(_props: StepperProps): ReactElement | null {
  nativeStubWarn('Stepper');
  return null;
}

export interface NavigationMenuItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly children?: ReadonlyArray<NavigationMenuItem>;
  readonly render?: (info: {
    readonly label: ReactNode;
    readonly isOpen: boolean;
    readonly isCurrent: boolean;
    readonly hasChildren: boolean;
    readonly toggleOpen: () => void;
  }) => ReactNode;
}
export interface NavigationMenuProps {
  current?: string;
  items?: ReadonlyArray<NavigationMenuItem>;
  children?: ReactNode;
}
export function NavigationMenu(_props: NavigationMenuProps): ReactElement | null {
  nativeStubWarn('NavigationMenu');
  return null;
}

export interface ToolbarProps {
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}
export function Toolbar(_props: ToolbarProps): ReactElement | null {
  nativeStubWarn('Toolbar');
  return null;
}
