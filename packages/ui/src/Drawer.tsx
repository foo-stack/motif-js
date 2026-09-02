'use client';

import {
  Dialog,
  Drawer as HeadlessDrawer,
  Sheet as HeadlessSheet,
  type DrawerContentProps as HeadlessDrawerContentProps,
} from '@usemotif/headless';
import type { ReactNode } from 'react';
import { Box, Text } from 'usemotif';

type Side = 'left' | 'right' | 'top' | 'bottom';

// Hoisted so the motion props are stable references (lint: no-new-object). The
// panel slides off toward its anchored edge - the same translate serves as both
// the enter-from and exit-to offset, driven by the active motion driver.
const SLIDE: Record<Side, { readonly transform: string }> = {
  left: { transform: 'translateX(-100%)' },
  right: { transform: 'translateX(100%)' },
  top: { transform: 'translateY(-100%)' },
  bottom: { transform: 'translateY(100%)' },
};
const DRAWER_TRANSITION = { duration: '$durations.2' } as const;

// Rounded only on the corners that face into the viewport (the anchored edge sits
// flush). Literal px so the multi-corner shorthand stays a plain CSS value.
const RADIUS: Record<Side, string> = {
  left: '0',
  right: '0',
  top: '0 0 16px 16px',
  bottom: '16px 16px 0 0',
};

export interface DrawerContentProps extends HeadlessDrawerContentProps {
  readonly children?: ReactNode;
}
export type SheetContentProps = Omit<DrawerContentProps, 'side'>;

/** The themed sliding panel that fills the headless Drawer/Sheet boundary. */
function DrawerSurface({ side, children }: { readonly side: Side; readonly children?: ReactNode }) {
  const horizontal = side === 'left' || side === 'right';
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="$space.3"
      width={horizontal ? 360 : '100%'}
      maxWidth={horizontal ? '90vw' : '100%'}
      height={horizontal ? '100%' : 'auto'}
      maxHeight={horizontal ? '100%' : '85vh'}
      overflow="auto"
      p="$space.5"
      bg="$colors.surface.raised"
      color="$colors.text.default"
      borderColor="$colors.border.muted"
      borderWidth="$borderWidths.thin"
      borderRadius={RADIUS[side]}
      boxShadow="0 10px 38px rgba(0, 0, 0, 0.3)"
      enterStyle={SLIDE[side]}
      exitStyle={SLIDE[side]}
      transition={DRAWER_TRANSITION}
    >
      {children}
    </Box>
  );
}

/** Side-anchored drawer surface; forwards every headless `Drawer.Content` prop
 * (`side`, `exitDurationMs`, ...) and animates the slide for that side. */
function DrawerContent({
  side = 'right',
  exitDurationMs = 250,
  children,
  ...rest
}: DrawerContentProps) {
  return (
    <HeadlessDrawer.Content side={side} exitDurationMs={exitDurationMs} {...rest}>
      <DrawerSurface side={side}>{children}</DrawerSurface>
    </HeadlessDrawer.Content>
  );
}

/** Bottom-pinned sheet surface - a Drawer fixed to `side="bottom"`. */
function SheetContent({ exitDurationMs = 250, children, ...rest }: SheetContentProps) {
  return (
    <HeadlessSheet.Content exitDurationMs={exitDurationMs} {...rest}>
      <DrawerSurface side="bottom">{children}</DrawerSurface>
    </HeadlessSheet.Content>
  );
}

/** Themed drawer/sheet title - keeps `Dialog.Title`'s aria wiring. */
function DrawerTitle({ children }: { readonly children?: ReactNode }) {
  return (
    <Dialog.Title as="div">
      <Text
        fontSize="$fontSizes.lg"
        fontWeight="$fontWeights.semibold"
        color="$colors.text.default"
      >
        {children}
      </Text>
    </Dialog.Title>
  );
}

/** Themed drawer/sheet description. */
function DrawerDescription({ children }: { readonly children?: ReactNode }) {
  return (
    <Dialog.Description as="div">
      <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
        {children}
      </Text>
    </Dialog.Description>
  );
}

/**
 * A themed, animated side drawer over the accessible headless `Drawer` (a
 * side-anchored `Dialog`: focus trap, scrim, Escape). The panel slides in from
 * its `side` (`left` · `right` · `top` · `bottom`, default `right`) through the
 * active motion driver, and slides back out on close.
 *
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger><Button>Menu</Button></Drawer.Trigger>
 *   <Drawer.Content side="left">
 *     <Drawer.Title>Navigation</Drawer.Title>
 *     ...links...
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
/**
 * Parts exported flat so `src/index.ts` can assemble the namespace in the
 * server graph. Internal: the barrel does not re-export these by name.
 */
export { DrawerContent, DrawerDescription, DrawerTitle, SheetContent };
