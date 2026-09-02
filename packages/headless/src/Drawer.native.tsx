import type { ReactNode } from 'react';
import { DialogContent, DialogRoot, type DialogContentProps } from './Dialog.js';

/**
 * Native Drawer / Sheet - composes the native Dialog (RN Modal) with
 * a `position`/`size` hint that styled wrappers can read off
 * `accessibilityLabel`. The headless layer doesn't enforce a slide
 * animation; consumers wrap `Dialog.Content` in `Animated.View` if
 * they want one.
 */

export interface DrawerContentProps extends DialogContentProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: number | string;
}

function DrawerContent({
  position: _position,
  size: _size,
  ...rest
}: DrawerContentProps): ReturnType<typeof DialogContent> {
  // Position / size are advisory; the `style` prop drives the actual
  // layout. Consumers compose with Animated.View for the slide.
  return <DialogContent {...rest} />;
}

const DrawerRoot = DialogRoot;

/**
 * Parts exported flat so `src/index.ts` can assemble the namespace in the
 * server graph, where each one is already a client reference. Internal: the
 * barrel re-exports by name and does not list these.
 */
export { DrawerRoot, DrawerContent, SheetContent };

function SheetContent(
  props: DrawerContentProps & { children?: ReactNode },
): ReturnType<typeof DialogContent> {
  return <DrawerContent {...{ position: 'bottom', ...props }} />;
}
