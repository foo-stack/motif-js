'use client';

import { Portal } from '@usemotif/react';
import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useClickOutside, useFloatingPosition, type Placement } from './positioning.js';

/**
 * Popover — non-modal floating panel anchored to a trigger.
 *
 * Distinct from Dialog (modal, takes focus, blocks scroll, scrim)
 * — Popover is non-modal: focus stays with the trigger, the page
 * keeps interacting, no scrim. Use for filter dropdowns, simple
 * info cards, etc. For modal patterns use Dialog; for purely
 * descriptive overlays use Tooltip.
 *
 * **Motion**: `exitStyle` integration is tracked as a follow-on. Today
 * Popover unmounts instantly when closed; pair with a CSS
 * `transition` on the Content surface for prop-change animations
 * (open arrow rotation, etc.). Adopt the same `exitDurationMs` /
 * `data-motif-state="exiting"` contract Dialog uses once the wiring
 * lands.
 *
 * Compose-time API:
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger><Button>Filter</Button></Popover.Trigger>
 *   <Popover.Content placement="bottom">
 *     <FilterControls />
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 *
 * Dismiss behaviour: Escape closes; click-outside closes (opt-out
 * via `dismissOnClickOutside={false}`).
 */

interface PopoverContextValue {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly contentId: string;
  readonly triggerRef: React.RefObject<HTMLElement | null>;
}
const PopoverContext = createContext<PopoverContextValue | null>(null);
function usePopoverContext(component: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (ctx === null) throw new Error(`${component} must be inside <Popover.Root>.`);
  return ctx;
}

export interface PopoverRootProps {
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
}: PopoverRootProps): ReactElement {
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
    <PopoverContext.Provider value={{ open, setOpen, contentId: `${reactId}-popover`, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps {
  children: ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
    'aria-haspopup'?: string;
    ref?: React.Ref<HTMLElement>;
  }>;
}
function Trigger({ children }: PopoverTriggerProps): ReactElement {
  const ctx = usePopoverContext('Popover.Trigger');
  if (!isValidElement(children)) throw new Error('Popover.Trigger expects a single React element.');
  const childOnClick = children.props.onClick;
  return cloneElement(children, {
    ref: ctx.triggerRef as React.Ref<HTMLElement>,
    'aria-expanded': ctx.open,
    'aria-controls': ctx.contentId,
    'aria-haspopup': 'dialog',
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
    },
  });
}

export interface PopoverContentProps {
  placement?: Placement;
  offset?: number;
  dismissOnClickOutside?: boolean;
  dismissOnEscape?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}
function Content({
  placement = 'bottom',
  offset = 8,
  dismissOnClickOutside = true,
  dismissOnEscape = true,
  style,
  children,
}: PopoverContentProps): ReactElement | null {
  const ctx = usePopoverContext('Popover.Content');
  const dismiss = useCallback(() => ctx.setOpen(false), [ctx]);
  const { position, floatingRef } = useFloatingPosition(
    ctx.triggerRef,
    ctx.open,
    placement,
    offset,
  );
  // Ignore the trigger: it owns the open/close toggle. Without this a
  // click on the trigger while open dismisses on mousedown and then the
  // trigger's click re-opens, so the popover never closes from its trigger.
  useClickOutside(ctx.open && dismissOnClickOutside, floatingRef, dismiss, ctx.triggerRef);

  if (!ctx.open) return null;
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    if (dismissOnEscape && e.key === 'Escape') {
      dismiss();
      ctx.triggerRef.current?.focus();
    }
  }
  return (
    <Portal>
      <div
        ref={floatingRef}
        id={ctx.contentId}
        role="dialog"
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

export interface PopoverCloseProps {
  children: ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
}
function Close({ children }: PopoverCloseProps): ReactElement {
  const ctx = usePopoverContext('Popover.Close');
  if (!isValidElement(children)) throw new Error('Popover.Close expects a single React element.');
  const childOnClick = children.props.onClick;
  return cloneElement(children, {
    onClick: (e: MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) ctx.setOpen(false);
    },
  });
}

export const Popover = { Root, Trigger, Content, Close };
