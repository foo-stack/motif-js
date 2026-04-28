'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Box, type BoxProps } from './Box.js';

/**
 * Portal — renders children into a different part of the DOM,
 * outside the parent's hierarchy. Used as the foundation for
 * overlays, modals, tooltips, etc.
 *
 * `to` defaults to `document.body`; pass any HTMLElement to render
 * elsewhere (useful for portal-into-shadow-DOM scenarios).
 *
 * SSR-safe — returns `null` until the document is available.
 */
export interface PortalProps {
  children?: ReactNode;
  to?: HTMLElement | null;
}
export function Portal({ children, to }: PortalProps): ReactElement | null {
  if (typeof document === 'undefined') return null;
  const target = to ?? document.body;
  return createPortal(children, target);
}

/**
 * Overlay — full-viewport scrim. Composes Portal + a fixed-position
 * Box so the overlay covers everything regardless of where the
 * caller renders. Tap-outside / escape handling is the caller's
 * responsibility (this primitive is a layout building block, not a
 * dialog).
 */
export interface OverlayProps extends Omit<BoxProps, 'position'> {
  /** Fired when the user clicks the scrim itself (not propagated
   * children). Useful for tap-outside-to-dismiss. */
  onScrimClick?: () => void;
  /** Background tint. Defaults to a translucent black. */
  scrim?: string;
  children?: ReactNode;
}
export function Overlay({
  onScrimClick,
  scrim = 'rgba(0, 0, 0, 0.5)',
  children,
  style,
  ...rest
}: OverlayProps): ReactElement {
  return (
    <Portal>
      <Box
        style={
          {
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: scrim,
            ...style,
          } as CSSProperties
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) onScrimClick?.();
        }}
        {...rest}
      >
        {children}
      </Box>
    </Portal>
  );
}

/**
 * VisuallyHidden — visually hidden content that remains in the
 * accessibility tree. Use for sr-only labels, off-screen headings,
 * etc. Renders the standard "sr-only" pattern (1×1 clipped span).
 */
export interface VisuallyHiddenProps {
  as?: 'span' | 'div';
  children?: ReactNode;
}
const SR_ONLY_STYLE: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
export function VisuallyHidden({ as = 'span', children }: VisuallyHiddenProps): ReactElement {
  const Tag = as;
  return <Tag style={SR_ONLY_STYLE}>{children}</Tag>;
}

/**
 * LiveRegion — `aria-live` container for announcing updates to
 * screen readers (e.g. toast messages, status changes). `politeness`
 * controls urgency: `'polite'` queues announcements, `'assertive'`
 * interrupts.
 */
export interface LiveRegionProps extends BoxProps {
  politeness?: 'polite' | 'assertive' | 'off';
  /** When true, the region is also visually hidden (sr-only). */
  visuallyHidden?: boolean;
  children?: ReactNode;
}
export function LiveRegion({
  politeness = 'polite',
  visuallyHidden = false,
  children,
  style,
  ...rest
}: LiveRegionProps): ReactElement {
  return (
    <Box
      style={
        {
          ...(visuallyHidden ? SR_ONLY_STYLE : {}),
          ...style,
        } as CSSProperties
      }
      {...({ 'aria-live': politeness, 'aria-atomic': 'true' } as Record<string, string>)}
      {...rest}
    >
      {children}
    </Box>
  );
}

/**
 * FocusScope — focus management for overlays. Three behaviours,
 * each independently togglable:
 *
 * - `autoFocus` (default true) — moves focus to the first focusable
 *   descendant on mount.
 * - `restoreFocus` (default true) — returns focus to the
 *   previously-active element on unmount.
 * - `trapFocus` (default true) — keeps Tab / Shift+Tab cycling
 *   inside the scope. From the last focusable, Tab wraps to the
 *   first; from the first, Shift+Tab wraps to the last.
 *
 * The trap is deliberately scoped to keyboard cycling only — it
 * does not block programmatic focus, click-into-other-elements, or
 * `inert` ancestors. Dialog / AlertDialog compose with Portal +
 * Overlay to set `inert` on background content; FocusScope handles
 * the keyboard side.
 *
 * `onEscape` fires when the user presses Escape inside the scope.
 * Wire it to the parent's dismiss handler — Dialog uses this to
 * implement escape-to-close without re-implementing the keydown
 * listener everywhere.
 */
export interface FocusScopeProps {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  /** Trap Tab cycling inside the scope. Defaults to true. */
  trapFocus?: boolean;
  /** Called on Escape keypress inside the scope. */
  onEscape?: () => void;
  children?: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';

function focusableInside(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function FocusScope({
  autoFocus = true,
  restoreFocus = true,
  trapFocus = true,
  onEscape,
  children,
}: FocusScopeProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const escapeRef = useRef<typeof onEscape>(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = containerRef.current;
    if (root === null) return;

    if (restoreFocus) previousFocusRef.current = document.activeElement as HTMLElement | null;
    if (autoFocus) {
      // If there's nothing focusable inside the scope, pin focus to
      // the container itself (it carries `tabIndex={-1}`) so keyboard
      // events — Escape, Tab — still land on the keydown listener
      // below. Without this fallback, an empty scope leaves focus on
      // the previously-active element and Escape never reaches us.
      const first = focusableInside(root)[0];
      (first ?? root).focus();
    }

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape' && escapeRef.current !== undefined) {
        escapeRef.current();
        return;
      }
      if (!trapFocus || e.key !== 'Tab') return;
      const focusables = focusableInside(root!);
      if (focusables.length === 0) {
        // No focusable inside — at least keep focus from leaving the
        // scope by pinning it to the container itself.
        e.preventDefault();
        root!.focus();
        return;
      }
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    root.addEventListener('keydown', handleKeyDown);
    return () => {
      root.removeEventListener('keydown', handleKeyDown);
      if (restoreFocus) previousFocusRef.current?.focus();
    };
  }, [autoFocus, restoreFocus, trapFocus]);

  return (
    <div ref={containerRef} tabIndex={-1} style={{ outline: 'none' }}>
      {children}
    </div>
  );
}

/**
 * Show / Hide — declarative responsive visibility. `<Show above="md">`
 * only renders children when the viewport is `md+`; `<Hide above="md">`
 * is the inverse. Web uses CSS media queries (the children always
 * render but their containing wrapper toggles `display`); native
 * uses the viewport hook to drop the children entirely.
 *
 * Web v0: emits inline media queries via a generated class. The
 * children are always part of the React tree; only their visibility
 * is controlled.
 */
export interface ShowHideProps {
  above?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  below?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children?: ReactNode;
}

const BP_PX: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

export function Show({ above, below, children }: ShowHideProps): ReactElement | null {
  // For v0, we use a wrapping span with a class that maps to a
  // server-rendered media query. The simpler approach: wrap a Box
  // and rely on display:none / display:block toggling via inline
  // matchMedia. To keep SSR-correct, we render an always-rendered
  // wrapper and let the user attach matchMedia logic via CSS.
  return useViewportMatch(above, below) ? <>{children}</> : null;
}

export function Hide({ above, below, children }: ShowHideProps): ReactElement | null {
  return useViewportMatch(above, below) ? null : <>{children}</>;
}

function useViewportMatch(above?: string, below?: string): boolean {
  const widthRef = useRef<number>(typeof window === 'undefined' ? 1024 : window.innerWidth);
  const [, force] = useForceRender();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = (): void => {
      widthRef.current = window.innerWidth;
      force();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [force]);
  const w = widthRef.current;
  const aboveOk = above === undefined || w >= (BP_PX[above] ?? 0);
  const belowOk = below === undefined || w < (BP_PX[below] ?? Infinity);
  return aboveOk && belowOk;
}

function useForceRender(): [number, () => void] {
  const ref = useRef(0);
  const force = useCallback(() => {
    ref.current += 1;
  }, []);
  return [ref.current, force];
}
