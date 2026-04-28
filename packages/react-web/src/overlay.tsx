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
 * FocusScope — minimal focus management for overlays. v0 sets
 * initial focus on the first focusable descendant when `autoFocus`
 * is true and restores focus to the previously-focused element on
 * unmount when `restoreFocus` is true. Real focus trapping (Tab /
 * Shift+Tab cycling within the scope) is deferred to a Phase F
 * patch — Dialog / AlertDialog headless components there will need
 * a more robust implementation.
 */
export interface FocusScopeProps {
  /** Move focus into the scope on mount. */
  autoFocus?: boolean;
  /** Restore focus to the previously-focused element on unmount. */
  restoreFocus?: boolean;
  children?: ReactNode;
}
export function FocusScope({
  autoFocus = true,
  restoreFocus = true,
  children,
}: FocusScopeProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (restoreFocus) previousFocusRef.current = document.activeElement as HTMLElement | null;
    if (autoFocus && containerRef.current !== null) {
      const focusable = containerRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
    return () => {
      if (restoreFocus) previousFocusRef.current?.focus();
    };
  }, [autoFocus, restoreFocus]);

  return <div ref={containerRef}>{children}</div>;
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
