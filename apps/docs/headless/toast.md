# Toast / Toaster / useToast

Transient notifications announced via `aria-live`. Mount one
`<Toaster>` near the root, push toasts from anywhere with the
`useToast()` hook.

## Import

```ts
import { Toaster, useToast } from '@motif-js/headless';
```

## Setup

```tsx
function App() {
  return (
    <Toaster>
      <MyAppRoot />
    </Toaster>
  );
}

function SaveButton() {
  const { toast } = useToast();
  return <Button onPress={() => toast({ title: 'Saved!' })}>Save</Button>;
}
```

## useToast

Returns `{ toast, dismiss, toasts }`.

```tsx
const { toast, dismiss } = useToast();

const id = toast({
  title: 'Upload failed',
  description: 'Network error — retry?',
  type: 'foreground',
  duration: 8000,
  action: (
    <Button size="sm" variant="outline">
      Retry
    </Button>
  ),
});

// Manually dismiss later if needed:
dismiss(id);
```

### `toast(input)` props

| Prop          | Type                           | Default        | Description                                      |
| ------------- | ------------------------------ | -------------- | ------------------------------------------------ |
| `title`       | `ReactNode`                    | —              | Headline.                                        |
| `description` | `ReactNode`                    | —              | Body copy.                                       |
| `action`      | `ReactNode`                    | —              | Inline action element (button, link).            |
| `duration`    | `number`                       | `5000`         | ms before auto-dismiss. `Infinity` to keep open. |
| `type`        | `'foreground' \| 'background'` | `'background'` | See aria-live below.                             |
| `id`          | `string`                       | (auto)         | Override the toast id. Useful for de-duping.     |

### `aria-live` mapping

- `'background'` — `role="status"`, `aria-live="polite"`. Default;
  used for confirmations.
- `'foreground'` — `role="alert"`, `aria-live="assertive"`. Use for
  errors and other interrupting messages.

## Toaster props

| Prop              | Type                             | Default    | Description                                                |
| ----------------- | -------------------------------- | ---------- | ---------------------------------------------------------- |
| `defaultDuration` | `number`                         | `5000`     | Default `duration` for new toasts.                         |
| `renderToasts`    | `(toasts, dismiss) => ReactNode` | (built-in) | Override the list rendering. Default: bottom-right column. |
| `style`           | `CSSProperties`                  | —          | Style for the default container.                           |

## Custom rendering

Replace the default toast list layout via `renderToasts`:

```tsx
<Toaster
  renderToasts={(toasts, dismiss) => (
    <Box position="fixed" top={16} right={16} zIndex={1200}>
      <VStack gap="$2">
        {toasts.map((t) => (
          <Card key={t.id} bg="$colors.surface.raised" p="$3">
            <Heading as="h4">{t.title}</Heading>
            <Text>{t.description}</Text>
            <Button size="sm" onPress={() => dismiss(t.id)}>
              ×
            </Button>
          </Card>
        ))}
      </VStack>
    </Box>
  )}
>
  <App />
</Toaster>
```

## Native

Same context provider; the default toast list uses an Animated.View
overlay (fade in / out) anchored to the bottom of the viewport.
`type='foreground'` maps to `accessibilityLiveRegion='assertive'`,
`'background'` to `'polite'`.

## See also

- [LiveRegion (primitive)](../primitives/overlay#liveregion) — lower-
  level aria-live wrapper.
- [Dialog](./dialog) — when the user MUST acknowledge.
