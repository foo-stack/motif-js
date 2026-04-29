---
'@motif-js/react-web': minor
---

**`FocusScope` — programmatic-focus capture for full WAI-ARIA modal compliance.**

Closes T3.4. Previously, `FocusScope` trapped *keyboard* Tab cycling
inside the scope but explicitly punted on programmatic focus
escapes. With the trap on, `someElementOutside.focus()` would
silently move focus out of an open modal, violating WAI-ARIA's
modal-dialog focus contract.

A new `captureFocus` option (defaulting to track `trapFocus`) adds a
document-level `focusin` listener that bounces focus back to the
first focusable inside the scope when external code moves it
outside.

```tsx
<Dialog.Root open>
  <Dialog.Content>
    {/* FocusScope inside Dialog.Content now captures programmatic
        focus by default — matches WAI-ARIA modal expectations. */}
  </Dialog.Content>
</Dialog.Root>
```

- **Default behaviour change**: `captureFocus` defaults to whatever
  `trapFocus` is set to. Modal-style traps (the default) now capture
  programmatic focus too. Non-modal uses (focus-restore-only via
  `trapFocus={false}`) are unaffected — `captureFocus` defaults to
  `false` along with the trap.

- **Explicit opt-out**: pass `<FocusScope captureFocus={false}>` to
  keep the keyboard-only behaviour from prior versions even when
  `trapFocus` is on. Useful for inline focus contexts where
  programmatic focus moves are intentional.

- **Listener hygiene**: the `focusin` listener is registered on
  mount, removed on unmount. Verified via a dedicated test —
  programmatic `.focus()` after unmount does NOT bounce back.

Four new tests cover the capture path: default-on bounce, opt-out,
trap-off default-off, and unmount cleanup. The existing "Escape
fires outside" test was updated to use `captureFocus={false}` since
the original setup (focus living outside the scope) is no longer
reachable with the modal-style default.
