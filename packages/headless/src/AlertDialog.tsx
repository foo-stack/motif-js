'use client';

import type { ReactElement } from 'react';
import { DialogContent, DialogRoot, type DialogRootProps } from './Dialog.js';

/**
 * AlertDialog - confirmation dialog for destructive actions.
 *
 * Identical to Dialog except `role='alertdialog'` is the default
 * and dismiss-on-scrim-click is OFF by default - alert dialogs
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
  return <DialogRoot {...props} role={props.role ?? 'alertdialog'} />;
}

function Content(props: Parameters<typeof DialogContent>[0]): ReturnType<typeof DialogContent> {
  return <DialogContent {...{ dismissOnScrimClick: false, ...props }} />;
}

/**
 * Parts exported flat so `src/index.ts` can assemble the namespace in the
 * server graph, where each one is already a client reference. Internal: the
 * barrel re-exports by name and does not list these.
 */
export { Root as AlertDialogRoot, Content as AlertDialogContent };
