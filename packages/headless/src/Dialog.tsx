'use client';

import { FocusScope, Overlay } from '@usemotif/react';
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
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useExitTransition } from './_use-exit-transition.js';

/**
 * Dialog — accessible modal dialog. Headless: composes the visuals
 * out of motif primitives (Box, Button, Text), and lets the caller
 * style the surface freely. The headless wiring covers:
 *
 * - **Controlled or uncontrolled** open state (`open` + `onOpenChange`
 *   for controlled; `defaultOpen` for uncontrolled).
 * - **Trigger** with `aria-expanded` / `aria-haspopup="dialog"`.
 * - **Content** rendered inside a Portal + Overlay, with FocusScope
 *   handling autoFocus / restoreFocus / Tab cycling / Escape.
 * - **Title** and **Description** bind via `aria-labelledby` /
 *   `aria-describedby` so screen readers announce both at open.
 * - **Close** action button.
 * - **Click-outside dismiss** via Overlay's `onScrimClick`. Pass
 *   `dismissOnEscape={false}` or `dismissOnScrimClick={false}` to
 *   opt out.
 *
 * Wraps the Radix-style multi-component composition pattern:
 *
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Confirm save?</Dialog.Title>
 *     <Dialog.Description>This will overwrite the existing draft.</Dialog.Description>
 *     <Dialog.Close>Cancel</Dialog.Close>
 *     <button onClick={save}>Save</button>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 *
 * The dialog DOES NOT style the surface — pass styling via children.
 * For a fully-styled component, build one in your app on top of
 * Dialog.
 */

interface DialogContextValue {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly titleId: string;
  readonly descriptionId: string;
  readonly triggerRef: React.RefObject<HTMLElement | null>;
  readonly role: 'dialog' | 'alertdialog';
}
const DialogContext = createContext<DialogContextValue | null>(null);
function useDialogContext(component: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (ctx === null) {
    throw new Error(`${component} must be rendered inside <Dialog.Root>.`);
  }
  return ctx;
}

export interface DialogRootProps {
  /** Controlled open state. Pass alongside `onOpenChange`. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Use `'alertdialog'` for destructive confirmations (overrides
   * the default `'dialog'` role). */
  role?: 'dialog' | 'alertdialog';
  children?: ReactNode;
}
function Root({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  role = 'dialog',
  children,
}: DialogRootProps): ReactElement {
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

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        titleId: `${reactId}-title`,
        descriptionId: `${reactId}-description`,
        triggerRef,
        role,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps {
  /** Single child element. The Dialog clones it to inject onClick +
   * aria-expanded + aria-haspopup. */
  children: ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    'aria-expanded'?: boolean;
    'aria-haspopup'?: string;
    ref?: React.Ref<HTMLElement>;
  }>;
}
function Trigger({ children }: DialogTriggerProps): ReactElement {
  const ctx = useDialogContext('Dialog.Trigger');
  if (!isValidElement(children)) {
    throw new Error('Dialog.Trigger expects a single React element child.');
  }
  const childOnClick = children.props.onClick;
  return cloneElement(children, {
    ref: ctx.triggerRef as React.Ref<HTMLElement>,
    'aria-expanded': ctx.open,
    'aria-haspopup': ctx.role,
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
    },
  });
}

export interface DialogContentProps {
  /** Allow Escape to close. Defaults to true. */
  dismissOnEscape?: boolean;
  /** Allow scrim clicks to close. Defaults to true. */
  dismissOnScrimClick?: boolean;
  /** Custom inline style for the surface wrapper. The dialog's a11y
   * wiring (aria-modal, role, aria-labelledby, aria-describedby) is
   * always applied. */
  style?: CSSProperties;
  /**
   * Fallback timeout (ms) for the exit transition. **Defaults to `0`**
   * — the dialog unmounts instantly on close (matches the original
   * pre-T1.1 behaviour). Set to a positive value to opt into exit
   * animations: the dialog stays rendered with
   * `data-motif-state="exiting"` until either a `transitionend` event
   * fires on the surface element or this timeout expires (whichever
   * comes first). Pair with `exitStyle` on a child `<Box>` to actually
   * see the animation.
   */
  exitDurationMs?: number;
  children?: ReactNode;
}
function Content({
  dismissOnEscape = true,
  dismissOnScrimClick = true,
  style,
  exitDurationMs = 0,
  children,
}: DialogContentProps): ReactElement | null {
  const ctx = useDialogContext('Dialog.Content');
  const { shouldRender, phase, elementRef } = useExitTransition(ctx.open, exitDurationMs);
  if (!shouldRender) return null;
  return (
    <Overlay {...(dismissOnScrimClick ? { onScrimClick: () => ctx.setOpen(false) } : {})}>
      <FocusScope
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        restoreFocus
        trapFocus
        {...(dismissOnEscape ? { onEscape: () => ctx.setOpen(false) } : {})}
      >
        <div
          ref={(node) => {
            elementRef.current = node;
          }}
          role={ctx.role}
          aria-modal="true"
          aria-labelledby={ctx.titleId}
          aria-describedby={ctx.descriptionId}
          {...(phase === 'exiting' ? { 'data-motif-state': 'exiting' } : {})}
          style={style}
        >
          {children}
        </div>
      </FocusScope>
    </Overlay>
  );
}

export interface DialogTitleProps {
  children?: ReactNode;
  /** Render as a different element. Defaults to `<h2>`. */
  as?: keyof React.JSX.IntrinsicElements;
}
function Title({ children, as = 'h2' }: DialogTitleProps): ReactElement {
  const ctx = useDialogContext('Dialog.Title');
  const Tag = as as React.ElementType;
  return <Tag id={ctx.titleId}>{children}</Tag>;
}

export interface DialogDescriptionProps {
  children?: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}
function Description({ children, as = 'p' }: DialogDescriptionProps): ReactElement {
  const ctx = useDialogContext('Dialog.Description');
  const Tag = as as React.ElementType;
  return <Tag id={ctx.descriptionId}>{children}</Tag>;
}

export interface DialogCloseProps {
  children: ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
}
function Close({ children }: DialogCloseProps): ReactElement {
  const ctx = useDialogContext('Dialog.Close');
  if (!isValidElement(children)) {
    throw new Error('Dialog.Close expects a single React element child.');
  }
  const childOnClick = children.props.onClick;
  return cloneElement(children, {
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(false);
    },
  });
}

export const Dialog = { Root, Trigger, Content, Title, Description, Close };

/**
 * `useDialogState({ defaultOpen })` — imperative control for callers
 * who want to drive Dialog from external state machines (form
 * libraries, routing, etc.). Returns `{ open, setOpen, toggle, props }`
 * where `props` is the controlled-mode pair to spread into `<Dialog.Root>`.
 */
export function useDialogState(initial: { defaultOpen?: boolean } = {}): {
  open: boolean;
  setOpen: (next: boolean) => void;
  toggle: () => void;
  props: { open: boolean; onOpenChange: (next: boolean) => void };
} {
  const [open, setOpen] = useState(initial.defaultOpen ?? false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return {
    open,
    setOpen,
    toggle,
    props: { open, onOpenChange: setOpen },
  };
}

// Suppress unused-effect warning — kept for future imperative APIs.
export { useEffect };
