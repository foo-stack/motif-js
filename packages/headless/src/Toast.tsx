'use client';

import { Portal } from '@motif-js/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * Toast / Toaster — transient notifications announced via an
 * `aria-live` region.
 *
 * `<Toaster>` mounts once near the root of the app. Inside, call
 * `useToast()` to get a `toast({...})` function that pushes
 * notifications onto the queue. Each toast auto-dismisses after
 * `duration` ms (default 5000); the user can dismiss earlier via
 * the Close action.
 *
 * **Motion**: `exitStyle` integration is tracked as a follow-on. The
 * `exitDurationMs` / `data-motif-state="exiting"` contract used by
 * Dialog will land here once Toaster gains a per-toast exit timer.
 * Until then, dismissed toasts unmount instantly; pair with a CSS
 * `transition` on the toast surface for prop-change animations.
 *
 * ```tsx
 * function App() {
 *   return (
 *     <Toaster>
 *       <MyAppRoot />
 *     </Toaster>
 *   );
 * }
 *
 * function SaveButton() {
 *   const { toast } = useToast();
 *   return <Button onClick={() => toast({ title: 'Saved!' })}>Save</Button>;
 * }
 * ```
 */

export interface ToastItem {
  readonly id: string;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  /** ms before auto-dismiss. Pass `Infinity` to disable. */
  readonly duration?: number;
  /** `'foreground'` (assertive) for errors, `'background'` (polite)
   * for confirmations. Defaults to `'background'`. */
  readonly type?: 'foreground' | 'background';
}

type ToastInput = Omit<ToastItem, 'id'> & { id?: string };

interface ToasterContextValue {
  readonly toast: (input: ToastInput) => string;
  readonly dismiss: (id: string) => void;
  readonly toasts: ToastItem[];
}
const ToasterContext = createContext<ToasterContextValue | null>(null);

export function useToast(): ToasterContextValue {
  const ctx = useContext(ToasterContext);
  if (ctx === null) throw new Error('useToast() must be called inside <Toaster>.');
  return ctx;
}

/**
 * Render the toast list itself. Default implementation: a stacked
 * column at the bottom-right of the viewport. Callers wanting a
 * different layout can pass `renderToasts` to override.
 */
export interface ToasterProps {
  /** Children — the rest of your app. */
  children?: ReactNode;
  /** Override how the toast list renders. Receives the active
   * toasts + the dismiss handler. Default: bottom-right column. */
  renderToasts?: (toasts: ToastItem[], dismiss: (id: string) => void) => ReactNode;
  /** Default duration in ms for new toasts. Defaults to 5000. */
  defaultDuration?: number;
  /** Inline style for the default container — only used when
   * `renderToasts` is not provided. */
  style?: CSSProperties;
}

let nextId = 0;

export function Toaster({
  children,
  renderToasts,
  defaultDuration = 5000,
  style,
}: ToasterProps): ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput): string => {
      nextId += 1;
      const id = input.id ?? `toast-${nextId}`;
      const item: ToastItem = {
        ...input,
        id,
        duration: input.duration ?? defaultDuration,
        type: input.type ?? 'background',
      };
      setToasts((current) => [...current, item]);
      if (item.duration !== Infinity && (item.duration ?? 0) > 0) {
        const timer = setTimeout(() => dismiss(id), item.duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [defaultDuration, dismiss],
  );

  // Clear pending timers on unmount.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers.values()) clearTimeout(t);
      timers.clear();
    };
  }, []);

  return (
    <ToasterContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <Portal>
        {renderToasts !== undefined ? (
          renderToasts(toasts, dismiss)
        ) : (
          <DefaultToasterList
            toasts={toasts}
            dismiss={dismiss}
            {...(style !== undefined ? { style } : {})}
          />
        )}
      </Portal>
    </ToasterContext.Provider>
  );
}

function DefaultToasterList({
  toasts,
  dismiss,
  style,
}: {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
  style?: CSSProperties;
}): ReactElement {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 1200,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

/**
 * Renders a single toast with the right `aria-live` semantics.
 * Foreground toasts use `role="alert"` (interrupts); background
 * toasts use `role="status"` (polite).
 */
export function Toast({
  item,
  onDismiss,
  style,
  children,
}: {
  item: ToastItem;
  onDismiss?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
}): ReactElement {
  return (
    <div
      role={item.type === 'foreground' ? 'alert' : 'status'}
      aria-live={item.type === 'foreground' ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{ pointerEvents: 'auto', ...style }}
    >
      {children ?? (
        <>
          {item.title !== undefined && item.title !== null ? <div>{item.title}</div> : null}
          {item.description !== undefined && item.description !== null ? (
            <div>{item.description}</div>
          ) : null}
          {item.action !== undefined && item.action !== null ? <div>{item.action}</div> : null}
          {onDismiss !== undefined ? (
            <button type="button" onClick={onDismiss} aria-label="Dismiss">
              ×
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
