import type { ReactNode } from 'react';
import { Dialog, type DialogContentProps } from './Dialog.js';

/**
 * Native Drawer / Sheet — composes the native Dialog (RN Modal) with
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
}: DrawerContentProps): ReturnType<typeof Dialog.Content> {
  // Position / size are advisory; the `style` prop drives the actual
  // layout. Consumers compose with Animated.View for the slide.
  return <Dialog.Content {...rest} />;
}

export const Drawer = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: DrawerContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
};

function SheetContent(
  props: DrawerContentProps & { children?: ReactNode },
): ReturnType<typeof Dialog.Content> {
  return <DrawerContent {...{ position: 'bottom', ...props }} />;
}

export const Sheet = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: SheetContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
};
