'use client';

import { Adapt, Dialog, type AdaptProps } from '@usemotif/headless';
import type { ReactNode } from 'react';
import { Box, Text } from 'usemotif';

export interface ModalContentProps extends AdaptProps {
  readonly children?: ReactNode;
}

// Hoisted so the motion props are stable references across renders.
const MODAL_ENTER = { opacity: 0, transform: 'translateY(8px) scale(0.98)' } as const;
const MODAL_TRANSITION = { duration: '$durations.2' } as const;

/**
 * The themed, adaptive modal surface - the part that proves the kit thesis.
 *
 * - **Themed:** a `surface.raised` card with token-driven radius, border, and
 *   padding, so it re-themes in light and dark.
 * - **Adaptive (P5):** wraps `Adapt`, so it's a centered dialog above the
 *   breakpoint and a bottom sheet below it, sharing one open state.
 * - **Animated (P4):** the surface mounts with an `enterStyle` translate-and-fade
 *   driven by the active motion driver.
 *
 * The headless `Dialog.Content` div stays the bare `role="dialog"` boundary
 * (focus trap, scrim, aria); the styled `Box` inside is the visible surface.
 */
function ModalContent({
  children,
  below = 'sm',
  exitDurationMs = 200,
  ...rest
}: ModalContentProps) {
  return (
    <Adapt below={below} exitDurationMs={exitDurationMs} {...rest}>
      <Box
        display="flex"
        flexDirection="column"
        gap="$space.3"
        minWidth={280}
        maxWidth={480}
        p="$space.5"
        bg="$colors.surface.raised"
        color="$colors.text.default"
        borderRadius="$radii.lg"
        borderWidth="$borderWidths.thin"
        borderColor="$colors.border.muted"
        boxShadow="0 10px 38px rgba(0, 0, 0, 0.3)"
        enterStyle={MODAL_ENTER}
        transition={MODAL_TRANSITION}
      >
        {children}
      </Box>
    </Adapt>
  );
}

/** Themed dialog title - keeps `Dialog.Title`'s aria wiring, drops the heading
 * margins, and applies the surface's title type scale. */
function ModalTitle({ children }: { readonly children?: ReactNode }) {
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

/** Themed dialog description. */
function ModalDescription({ children }: { readonly children?: ReactNode }) {
  return (
    <Dialog.Description as="div">
      <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
        {children}
      </Text>
    </Dialog.Description>
  );
}

/**
 * A batteries-included modal: the accessible headless `Dialog` (focus trap,
 * scrim, Escape) with a themed, animated, viewport-adaptive surface.
 *
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger><Button>Open</Button></Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Title>Delete project?</Modal.Title>
 *     <Modal.Description>This can't be undone.</Modal.Description>
 *     <Modal.Close><Button intent="danger">Delete</Button></Modal.Close>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const Modal = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: Dialog.Close,
};
