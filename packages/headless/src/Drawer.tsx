'use client';

import type { CSSProperties, ReactElement } from 'react';
import {
  DialogContent,
  DialogRoot,
  type DialogContentProps,
  type DialogRootProps,
} from './Dialog.js';

/**
 * Drawer - side-anchored Dialog for mobile-first navigation.
 *
 * Same Dialog compose-time API + a11y wiring (Portal + Overlay +
 * FocusScope, modal, escape + scrim dismiss). The only addition is
 * a `side` prop that steers the Content's default positioning.
 *
 * **Motion**: Drawer composes `Dialog.Content` directly, so it
 * inherits `exitDurationMs` and the `[data-motif-state="exiting"]`
 * boundary contract for free. Pair `<Box exitStyle={{ ... }}
 * transition="...">` inside DrawerContent with `<Drawer.Content
 * exitDurationMs={250}>` to animate the slide-out.
 */

export interface DrawerContentProps extends DialogContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

function DrawerContent({
  side = 'right',
  style,
  ...rest
}: DrawerContentProps): ReactElement | null {
  const sideStyle: CSSProperties = (() => {
    switch (side) {
      case 'left':
        return { position: 'fixed', top: 0, bottom: 0, left: 0 };
      case 'right':
        return { position: 'fixed', top: 0, bottom: 0, right: 0 };
      case 'top':
        return { position: 'fixed', top: 0, left: 0, right: 0 };
      case 'bottom':
        return { position: 'fixed', bottom: 0, left: 0, right: 0 };
    }
  })();
  return <DialogContent style={{ ...sideStyle, ...style }} {...rest} />;
}

function DrawerRoot(props: DialogRootProps): ReactElement {
  return <DialogRoot {...props} />;
}

/**
 * Parts exported flat so `src/index.ts` can assemble the namespace in the
 * server graph, where each one is already a client reference. Internal: the
 * barrel re-exports by name and does not list these.
 */
export { DrawerRoot, DrawerContent, SheetContent };

/**
 * Sheet - Drawer pinned to the bottom edge. Common mobile pattern
 * for action sheets / disclosure panels. Identical compose-time
 * API; only the default `side` differs.
 */
function SheetContent(props: Omit<DrawerContentProps, 'side'>): ReactElement | null {
  return <DrawerContent {...props} side="bottom" />;
}
