'use client';

import { AlertDialog as HeadlessAlertDialog, type DialogContentProps } from '@usemotif/headless';
import type { ReactNode } from 'react';
import { Box, Text } from 'usemotif';

// Hoisted so the motion props are stable references across renders.
const ALERT_ENTER = { opacity: 0, transform: 'translateY(8px) scale(0.98)' } as const;
const ALERT_TRANSITION = { duration: '$durations.2' } as const;

export interface AlertDialogContentProps extends DialogContentProps {
  readonly children?: ReactNode;
}

/** The themed confirm surface. The headless `AlertDialog.Content` is a `Dialog`
 * with `role="alertdialog"` and scrim-dismiss OFF, so it requires an explicit
 * choice; the Overlay centers this styled `Box`, which mounts with a fade-scale. */
function AlertDialogContent({ children, exitDurationMs = 200, ...rest }: AlertDialogContentProps) {
  return (
    <HeadlessAlertDialog.Content exitDurationMs={exitDurationMs} {...rest}>
      <Box
        display="flex"
        flexDirection="column"
        gap="$space.3"
        minWidth={280}
        maxWidth={420}
        p="$space.5"
        bg="$colors.surface.raised"
        color="$colors.text.default"
        borderRadius="$radii.lg"
        borderWidth="$borderWidths.thin"
        borderColor="$colors.border.muted"
        boxShadow="0 10px 38px rgba(0, 0, 0, 0.3)"
        enterStyle={ALERT_ENTER}
        exitStyle={ALERT_ENTER}
        transition={ALERT_TRANSITION}
      >
        {children}
      </Box>
    </HeadlessAlertDialog.Content>
  );
}

/** Themed alert title — keeps `Dialog.Title`'s aria wiring. */
function AlertDialogTitle({ children }: { readonly children?: ReactNode }) {
  return (
    <HeadlessAlertDialog.Title as="div">
      <Text
        fontSize="$fontSizes.lg"
        fontWeight="$fontWeights.semibold"
        color="$colors.text.default"
      >
        {children}
      </Text>
    </HeadlessAlertDialog.Title>
  );
}

/** Themed alert description. */
function AlertDialogDescription({ children }: { readonly children?: ReactNode }) {
  return (
    <HeadlessAlertDialog.Description as="div">
      <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
        {children}
      </Text>
    </HeadlessAlertDialog.Description>
  );
}

/**
 * A themed confirmation dialog over the accessible headless `AlertDialog` (a
 * `role="alertdialog"` `Dialog` that requires an explicit confirm/cancel —
 * scrim-click never dismisses it). Centered and animated like `Modal`, but for
 * destructive-action guards.
 *
 * ```tsx
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger><Button intent="danger">Delete</Button></AlertDialog.Trigger>
 *   <AlertDialog.Content>
 *     <AlertDialog.Title>Delete account?</AlertDialog.Title>
 *     <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
 *     <AlertDialog.Close><Button>Cancel</Button></AlertDialog.Close>
 *     <Button intent="danger" onClick={confirm}>Delete</Button>
 *   </AlertDialog.Content>
 * </AlertDialog.Root>
 * ```
 */
export const AlertDialog = {
  Root: HeadlessAlertDialog.Root,
  Trigger: HeadlessAlertDialog.Trigger,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: HeadlessAlertDialog.Close,
};
