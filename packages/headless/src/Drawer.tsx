'use client';

import type { CSSProperties, ReactElement } from 'react';
import { Dialog, type DialogContentProps, type DialogRootProps } from './Dialog.js';

/**
 * Drawer — side-anchored Dialog for mobile-first navigation.
 *
 * Same Dialog compose-time API + a11y wiring (Portal + Overlay +
 * FocusScope, modal, escape + scrim dismiss). The only addition is
 * a `side` prop that steers the Content's default positioning;
 * actual entry / exit animation is the caller's CSS responsibility
 * (motion is out-of-scope in v1.x — Phase G's animation hooks for
 * Motion / Reanimated are the future home for this).
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
  return <Dialog.Content style={{ ...sideStyle, ...style }} {...rest} />;
}

export const Drawer = {
  Root: (props: DialogRootProps): ReactElement => <Dialog.Root {...props} />,
  Trigger: Dialog.Trigger,
  Content: DrawerContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
};

/**
 * Sheet — Drawer pinned to the bottom edge. Common mobile pattern
 * for action sheets / disclosure panels. Identical compose-time
 * API; only the default `side` differs.
 */
function SheetContent(props: Omit<DrawerContentProps, 'side'>): ReactElement | null {
  return <DrawerContent {...props} side="bottom" />;
}

export const Sheet = {
  Root: Drawer.Root,
  Trigger: Dialog.Trigger,
  Content: SheetContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
};
