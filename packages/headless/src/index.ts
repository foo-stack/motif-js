/**
 * @motif-js/headless — accessible behavior components for motif-js.
 *
 * Headless: behaviour + a11y wiring, no styling. Each component
 * exposes a small surface (Root / Trigger / Content / etc.) that
 * composes the visual primitives from `@motif-js/react`. Build
 * fully-styled components on top of these in your app.
 */

export const PACKAGE_NAME = '@motif-js/headless';

export { Dialog, useDialogState } from './Dialog.js';
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
} from './Dialog.js';

export { AlertDialog } from './AlertDialog.js';

export { Tooltip } from './Tooltip.js';
export type { TooltipContentProps, TooltipRootProps, TooltipTriggerProps } from './Tooltip.js';
