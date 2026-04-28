'use client';

import type { ReactElement } from 'react';
import { Dialog, type DialogRootProps } from './Dialog.js';

/**
 * AlertDialog — confirmation dialog for destructive actions.
 *
 * Identical to Dialog except `role='alertdialog'` is the default
 * and dismiss-on-scrim-click is OFF by default — alert dialogs
 * should require an explicit confirm or cancel rather than
 * accidental dismiss. Callers can re-enable scrim-click dismissal
 * by passing `dismissOnScrimClick={true}` to AlertDialog.Content.
 *
 * The compose-time API mirrors Dialog (Root / Trigger / Content /
 * Title / Description / Close). Intended use:
 *
 * ```tsx
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger><Button intent="danger">Delete</Button></AlertDialog.Trigger>
 *   <AlertDialog.Content>
 *     <AlertDialog.Title>Delete account?</AlertDialog.Title>
 *     <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
 *     <AlertDialog.Close><Button>Cancel</Button></AlertDialog.Close>
 *     <Button intent="danger" onClick={confirmDelete}>Delete</Button>
 *   </AlertDialog.Content>
 * </AlertDialog.Root>
 * ```
 */

function Root(props: DialogRootProps): ReactElement {
  return <Dialog.Root {...props} role={props.role ?? 'alertdialog'} />;
}

function Content(props: Parameters<typeof Dialog.Content>[0]): ReturnType<typeof Dialog.Content> {
  return <Dialog.Content {...{ dismissOnScrimClick: false, ...props }} />;
}

export const AlertDialog = {
  Root,
  Trigger: Dialog.Trigger,
  Content,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
};
