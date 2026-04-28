# SEMVER policy

motif-js will commit to **semver stability** at the close of Phase G — the
"quality bar" milestone (full primitives + headless + a11y audit + docs site).
Until then, the v1.0 tag is **not** a stability lock.

## Until the Phase G release

motif is at v1.0.0 on npm but the v1.0.0 graduation was unintended (Phase E
close, 2026-04-28; changesets bumped 0.3.0 → 1.0.0 instead of the planned
0.4.0). The team accepted the publish rather than yank-and-republish. See
the [Phase E ROADMAP entry](./ROADMAP.md#phase-e--primitives-buildout) for
context.

**What this means in practice:** APIs may shift between v1.0.0 and the
Phase G release. We will:

- Increment the **minor** version for any breaking change in the v1.0–v1.x
  pre-quality-bar window. Yes, this is technically not strict semver — it's
  the pragmatic middle path while the project finishes Phase G work without
  forcing a v2 every time a Combobox prop renames.
- Document every breaking change in [`MIGRATION.md`](./MIGRATION.md).
- Surface the change in the relevant package's `CHANGELOG.md`.
- Prefer additive changes; only break when the alternative is genuinely
  worse for v1.0.

## After the Phase G release

The Phase G ship — full primitives + headless + a11y audit + docs site —
is when motif commits to **strict semver**:

- **Major** bumps for any breaking change.
- **Minor** bumps only for additions and non-breaking fixes.
- **Patch** bumps for bug fixes that don't touch the public API.

Public API surface (the things this guarantee covers):

- Every `export` from any `@motif-js/*` package's `index.ts`.
- Every prop / type referenced by those exports.
- Behaviour documented in the docs site or the per-package README.

Not covered:

- Internal modules (anything not re-exported from `index.ts`).
- Test utilities in `@motif-js/test-utils` whose contract is "test
  internals can change". (The harness's public adapter contract IS
  covered.)
- Compiler-emitted CSS class-name format (`m-<hash>`). The hash
  algorithm is internal; change it freely. What's covered: the class
  names produced by runtime and compiler always match for the same
  input.

## Deprecation policy

Once motif commits to semver:

- Deprecations are marked in JSDoc with `@deprecated` and a migration hint.
- The deprecated API stays for at least one minor version after the
  deprecation lands.
- The release notes at deprecation list the timeline and migration path.

## Pre-1.0 history

For reference, the v0.x → v1.x major-bump retired versions:

- v0.5 (Phase B) → shipped as v0.1.0
- v0.7 (Phase C) → shipped as v0.2.0
- v0.9 (Phase D) → shipped as v0.3.0
- v0.15 (Phase E) → shipped as v1.0.0 (unintended graduation)
- v0.20 (Phase F) → shipped as v1.x.x (Phase F close, version TBD)
- "v1.0 quality bar" (Phase G) → ships as v1.x.x at end of Phase G
