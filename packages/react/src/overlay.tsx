'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { defaultBreakpoints } from '@usemotif/core';
import { Box, type BoxProps } from './Box.js';
import { useThemeName } from './theme-context.js';

// Token CSS vars are scoped to the `[data-theme]` element that
// ThemeProvider / Theme render; a portal mounts under `document.body`,
// outside that element, so `var(--colors-*)` inside portaled content
// would resolve to nothing. Re-stamp the active theme name (already
// resolved for nested `<Theme>` chains by useThemeName) on a wrapper.
// `display: contents` adds no layout box, but inherited custom
// properties still cascade through it to the portaled subtree.
const THEMED_PORTAL_STYLE: CSSProperties = { display: 'contents' };

/**
 * Portal — renders children into a different part of the DOM,
 * outside the parent's hierarchy. Used as the foundation for
 * overlays, modals, tooltips, etc.
 *
 * `to` defaults to `document.body`; pass any HTMLElement to render
 * elsewhere (useful for portal-into-shadow-DOM scenarios).
 *
 * Carries the active theme across the portal boundary: when a
 * `<ThemeProvider>` / `<Theme>` is in scope, the portaled subtree is
 * wrapped in a `data-theme` element so token vars resolve the same as
 * inline content. No-op (no wrapper) when no theme is in scope.
 *
 * SSR-safe — returns `null` until the document is available.
 */
export interface PortalProps {
  children?: ReactNode;
  to?: HTMLElement | null;
}
export function Portal({ children, to }: PortalProps): ReactElement | null {
  const themeName = useThemeName();
  if (typeof document === 'undefined') return null;
  const target = to ?? document.body;
  const content =
    themeName === undefined ? (
      children
    ) : (
      <div data-theme={themeName} style={THEMED_PORTAL_STYLE}>
        {children}
      </div>
    );
  return createPortal(content, target);
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
 * FocusScope — focus management for overlays. Four behaviours,
 * each independently togglable:
 *
 * - `autoFocus` (default true) — moves focus to the first focusable
 *   descendant on mount.
 * - `restoreFocus` (default true) — returns focus to the
 *   previously-active element on unmount.
 * - `trapFocus` (default true) — keeps Tab / Shift+Tab cycling
 *   inside the scope. From the last focusable, Tab wraps to the
 *   first; from the first, Shift+Tab wraps to the last.
 * - `captureFocus` (default tracks `trapFocus`) — when external
 *   code moves focus outside the scope (programmatic `.focus()`,
 *   click on a non-`inert` background element), focus is recaptured
 *   to the first focusable inside. Required for full WAI-ARIA modal
 *   compliance — without it, `someElementOutside.focus()` escapes the
 *   modal silently.
 *
 * Dialog / AlertDialog compose Portal + Overlay (which sets `inert`
 * on background content) + FocusScope to deliver the full modal
 * contract: keyboard cycling stays in, programmatic focus stays in,
 * background click-targets are non-interactive.
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
  /** Recapture focus to the scope when external code moves it
   * outside (e.g. programmatic `.focus()`). Defaults to `trapFocus`
   * — modal-style traps capture programmatic focus too; non-modal
   * uses (focus-restore-only) leave it alone. Pass `false` to
   * explicitly disable even when trapping is on. */
  captureFocus?: boolean;
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
  captureFocus,
  onEscape,
  children,
}: FocusScopeProps): ReactElement {
  // captureFocus defaults to trapFocus — modal-style traps want to
  // capture programmatic focus too; non-modal uses (focus-restore-
  // only) opt out by passing trapFocus={false}.
  const shouldCapture = captureFocus ?? trapFocus;
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

    // Programmatic-focus capture: a document-level focusin listener
    // catches any focus event whose target lies outside the scope and
    // bounces focus back to the first focusable inside. Listener runs
    // in the bubble phase (capture: false) to give descendants in the
    // scope a chance to handle their own focus first; only escapes
    // hit our redirect.
    let onFocusIn: ((e: FocusEvent) => void) | undefined;
    if (shouldCapture) {
      onFocusIn = (e: FocusEvent): void => {
        const target = e.target;
        if (target === null) return;
        if (!(target instanceof Node)) return;
        if (root!.contains(target)) return;
        // Focus left the scope — pull it back. Prefer the first
        // focusable descendant; fall back to the container itself
        // (which carries tabIndex={-1}) so Escape still works.
        const first = focusableInside(root!)[0] ?? root!;
        first.focus();
      };
      document.addEventListener('focusin', onFocusIn);
    }

    return () => {
      root.removeEventListener('keydown', handleKeyDown);
      if (onFocusIn !== undefined) {
        document.removeEventListener('focusin', onFocusIn);
      }
      if (restoreFocus) previousFocusRef.current?.focus();
    };
  }, [autoFocus, restoreFocus, trapFocus, shouldCapture]);

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

// Width assumed by the server and by the first client render, before the
// real viewport can be measured. Keeping server + first-hydration render
// identical avoids a hydration mismatch; the effect below corrects it.
const SSR_DEFAULT_WIDTH = 1024;

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
  // Width lives in state (not a ref) so a resize re-renders Show/Hide and
  // re-evaluates the match — the previous ref + no-op "force" never
  // scheduled a render, so these components ignored resize entirely.
  //
  // Both the server and the first client render use SSR_DEFAULT_WIDTH so
  // the hydrated markup matches the server output; the effect measures the
  // real width on mount (reconciling any difference) and on every resize.
  const [width, setWidth] = useState<number>(SSR_DEFAULT_WIDTH);
  useEffect(() => {
    const onResize = (): void => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  type Bp = keyof typeof defaultBreakpoints;
  const aboveOk = above === undefined || width >= (defaultBreakpoints[above as Bp] ?? 0);
  const belowOk = below === undefined || width < (defaultBreakpoints[below as Bp] ?? Infinity);
  return aboveOk && belowOk;
}
