import type { Meta, StoryObj } from '@storybook/react';
import { Toast, Toaster, useToast, type ToastItem } from '@usemotif/headless';
import { Box, Button, HStack, Text, VStack } from 'usemotif';
import type { ReactNode } from 'react';
import { Note } from '../../harness/demo.js';

/**
 * Toast / Toaster - transient notifications announced through an
 * `aria-live` region. `<Toaster>` mounts once near the app root and
 * renders the viewport (default: a bottom-right column, in a Portal).
 * Inside it, `useToast()` returns `{ toast, dismiss, toasts }`; calling
 * `toast({...})` queues a notification that auto-dismisses after
 * `duration` ms (default 5000).
 *
 * `ToastItem` fields: `title`, `description`, `action`, `duration`
 * (`Infinity` disables auto-dismiss), and `type` - `'background'`
 * (polite `role="status"`, default) or `'foreground'` (assertive
 * `role="alert"`, for errors).
 *
 * **Imperative, not prop-driven.** There's no "open" prop - toasts are
 * pushed onto a queue. The static stories render the single-item
 * `<Toast>` component directly so Docs / VR capture the styled surface;
 * the Playground fires real queued toasts from a button.
 */
const meta = {
  title: 'Overlay/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    item: {
      id: 'preview',
      title: 'Saved!',
      description: 'Your draft is up to date.',
      type: 'background',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'aria-live notifications. Mount <Toaster>, then call toast() from useToast(). Imperative - no open prop.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Styled wrapper around the headless single-toast surface. */
function StyledToast({ item, onDismiss }: { item: ToastItem; onDismiss?: () => void }) {
  const accent =
    item.type === 'foreground'
      ? 'var(--colors-action-danger-bg)'
      : 'var(--colors-action-primary-bg)';
  return (
    <Toast
      item={item}
      {...(onDismiss ? { onDismiss } : {})}
      style={{
        background: 'var(--colors-surface-raised)',
        color: 'var(--colors-text-default)',
        borderLeft: `4px solid ${accent}`,
        borderRadius: 10,
        padding: '12px 16px',
        minWidth: 280,
        maxWidth: 360,
        boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
      }}
    >
      <HStack gap="$3" alignItems="flex-start">
        <VStack gap={0} flex="1">
          {item.title ? (
            <Text fontWeight="$semibold" mt={0} mb={0}>
              {item.title}
            </Text>
          ) : null}
          {item.description ? (
            <Text color="$colors.text.muted" fontSize="$sm">
              {item.description}
            </Text>
          ) : null}
        </VStack>
        {item.action ?? null}
        {onDismiss ? (
          <Button
            size="xs"
            variant="ghost"
            intent="neutral"
            aria-label="Dismiss"
            onClick={onDismiss}
          >
            ×
          </Button>
        ) : null}
      </HStack>
    </Toast>
  );
}

/** Lives inside <Toaster>; fires real queued toasts via useToast(). */
function ToastTriggers() {
  const { toast } = useToast();
  return (
    <HStack gap="$3" flexWrap="wrap">
      <Button onClick={() => toast({ title: 'Saved!', description: 'Your draft is up to date.' })}>
        Background toast
      </Button>
      <Button
        intent="danger"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'The file exceeded the size limit.',
            type: 'foreground',
          })
        }
      >
        Foreground (error) toast
      </Button>
    </HStack>
  );
}

/**
 * Mount <Toaster> once, then call `toast()` from inside it. Each click
 * queues a real toast in the bottom-right viewport (auto-dismiss 5s).
 */
export const Playground: Story = {
  render: () => (
    <Box>
      <Note>Click to fire toasts into the bottom-right viewport.</Note>
      <Toaster>
        <ToastTriggers />
      </Toaster>
    </Box>
  ),
};

/**
 * Static surfaces rendered via the single-item `<Toast>` component (no
 * provider needed) so Docs / VR capture both `type` variants.
 */
export const Variants: Story = {
  render: () => (
    <VStack gap="$3" alignItems="flex-start">
      <StyledToast
        item={{
          id: 'bg',
          title: 'Saved!',
          description: 'Your draft is up to date.',
          type: 'background',
        }}
        onDismiss={() => undefined}
      />
      <StyledToast
        item={{
          id: 'fg',
          title: 'Upload failed',
          description: 'The file exceeded the size limit.',
          type: 'foreground',
        }}
        onDismiss={() => undefined}
      />
      <StyledToast
        item={{
          id: 'action',
          title: 'Item deleted',
          type: 'background',
          action: (
            <Button size="xs" variant="outline" intent="neutral">
              Undo
            </Button>
          ) as ReactNode,
        }}
        onDismiss={() => undefined}
      />
    </VStack>
  ),
};
