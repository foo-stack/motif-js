'use client';

import {
  Toast as HeadlessToast,
  Toaster as HeadlessToaster,
  useToast,
  type ToastItem,
  type ToasterProps,
} from '@usemotif/headless';
import { useCallback, type CSSProperties } from 'react';
import { Box, Text } from 'usemotif';

export { useToast };
export type { ToastItem };

// Hoisted: a fresh object/function as a prop trips the perf lint rules, and the
// container is a stable layout wrapper anyway.
const CONTAINER_STYLE: CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  zIndex: 1200,
  // The container itself is click-through; each toast card re-enables pointer
  // events so only the visible cards are interactive.
  pointerEvents: 'none',
};

/** One themed toast card. The headless `Toast` supplies the `role` / live-region
 * semantics; the `Box` inside is the visible, re-themable surface. */
function ThemedToastItem({ item, dismiss }: { item: ToastItem; dismiss: (id: string) => void }) {
  const onDismiss = useCallback(() => dismiss(item.id), [dismiss, item.id]);
  return (
    <HeadlessToast item={item} onDismiss={onDismiss}>
      <Box
        display="flex"
        flexDirection="column"
        gap="$space.1"
        minWidth={260}
        maxWidth={380}
        p="$space.4"
        bg="$colors.surface.raised"
        color="$colors.text.default"
        borderRadius="$radii.md"
        borderWidth="$borderWidths.thin"
        borderColor="$colors.border.muted"
        boxShadow="0 10px 30px rgba(0, 0, 0, 0.18)"
      >
        {item.title !== undefined && item.title !== null ? (
          <Text fontWeight="$fontWeights.semibold">{item.title}</Text>
        ) : null}
        {item.description !== undefined && item.description !== null ? (
          <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
            {item.description}
          </Text>
        ) : null}
        {item.action ?? null}
      </Box>
    </HeadlessToast>
  );
}

function renderThemedToasts(toasts: ToastItem[], dismiss: (id: string) => void) {
  return (
    <div style={CONTAINER_STYLE}>
      {toasts.map((item) => (
        <ThemedToastItem key={item.id} item={item} dismiss={dismiss} />
      ))}
    </div>
  );
}

export interface ThemedToasterProps extends Omit<ToasterProps, 'renderToasts' | 'style'> {}

/**
 * A themed toaster. Mount it once near your app root, then push toasts from
 * anywhere with `useToast()`:
 *
 * ```tsx
 * <Toaster>
 *   <App />
 * </Toaster>
 *
 * // inside a component:
 * const { toast } = useToast();
 * <Button onPress={() => toast({ title: 'Saved' })}>Save</Button>;
 * ```
 *
 * Each toast is a themed `surface.raised` card; the headless layer keeps the
 * `role="alert"` / `role="status"` live-region semantics and auto-dismiss.
 */
export function Toaster(props: ThemedToasterProps) {
  return <HeadlessToaster {...props} renderToasts={renderThemedToasts} />;
}
