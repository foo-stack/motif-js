import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native Toast / Toaster — RN doesn't ship a Snackbar primitive; a
 * real port should render via an absolutely-positioned overlay with
 * `Animated` slide-in / fade-out. Until that lands, the native
 * variant null-renders and warns once.
 */

export interface ToastItem {
  readonly id: string;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  readonly duration?: number;
  readonly type?: 'foreground' | 'background';
}

export interface ToasterProps {
  children?: ReactNode;
  defaultDuration?: number;
  maxVisible?: number;
}

export function Toaster(_props: ToasterProps): ReactElement | null {
  nativeStubWarn('Toaster');
  return null;
}

export function Toast(_props: { item: ToastItem }): ReactElement | null {
  nativeStubWarn('Toast');
  return null;
}

export function useToast(): {
  toast: (input: Omit<ToastItem, 'id'> & { id?: string }) => string;
  dismiss: (id: string) => void;
  toasts: ToastItem[];
} {
  nativeStubWarn('useToast');
  return {
    toast: () => '',
    dismiss: () => {},
    toasts: [],
  };
}
