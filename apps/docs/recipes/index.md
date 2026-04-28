# Recipes

End-to-end app patterns built with motif primitives + headless
components. Each recipe shows a full screen, not just one component —
the goal is to demonstrate motif at scale and surface the patterns
that recur across real apps.

## What's here

- [**Auth flow**](./auth) — sign-in / sign-up / forgot-password
  screens with form validation, loading states, and proper
  accessibility wiring. Touches `Field` / `Input` / `PasswordInput`
  / `useToast()`.
- [**Dashboard**](./dashboard) — app shell with sidebar nav, top
  header, and a responsive stat grid + activity feed. Demonstrates
  container queries, responsive primitives (`Show` / `Hide`), and
  a mobile drawer pattern.
- [**Settings**](./settings) — multi-section page with vertical
  tabbed nav, URL-hash deep-linking, destructive-action `AlertDialog`,
  and the `Switch` headless for preferences.
- [**Checkout**](./checkout) — cart → shipping → payment → confirm
  flow with a Stepper, per-step validation, lifted state, and
  Stripe-style payment scaffolding.

Each recipe is meant to be lifted into your codebase verbatim — they
use only motif primitives + headless components and standard React
patterns (no router-specific assumptions, no state-library lock-in).
