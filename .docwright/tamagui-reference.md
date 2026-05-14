# Tamagui docs — structural reference (motif mirror)

**Crawled:** 2026-05-15
**Source:** `tamagui.dev/docs`, `tamagui.dev/ui/*`, `tamagui.dev/llms.txt`
**Why this exists:** Phase 1 captures Tamagui's IA and per-component page template as the structural reference for motif's per-component pages. Motif borrows the shape, not the prose. Voice stays in `voice-card.md`.

## Tamagui top-level IA

Sidebar structure observed:

```
Core
  Introduction
  Installation
  CLI
  Releases
  Configuration
  Config v5                  (versioned config alternative)
  Tokens
  Themes
  Styling
  Components                 (overview, then UI section per-component)
  Hooks
  Animations
  Compiler
  Bundlers
  Guides

UI                           (component pages)
  Intro
  Stacks
  Headings
  Text
  Native
  Z-Index
  Forms                      (group; multiple components inside)
  Menus
  Panels
  Content
  Functional
  Visual
  Dialog                     (one of ~20 component pages)
  Button
  …
```

Tamagui mixes flat Core docs with a separate UI namespace for per-component pages. The split is deliberate: Core covers "how to build with the styling system", UI covers "the components you can import".

## Per-component page template (Tamagui)

Observed across `Button`, `Dialog`, and other component pages:

| # | Section | Notes |
|---|---|---|
| 1 | **Title** | Component name, e.g. "Button". |
| 2 | **One-line subtitle** | "Show a modal with configurable layout and accessible actions." Below the H1, not in frontmatter. |
| 3 | **Hero demo** | Interactive, often with multiple example tabs (Plain / Outlined / Active variants). "Show code" button reveals source. |
| 4 | **Features** | Bulleted list. "Size prop that works on all styles." "Comes with styling, yet completely customizable and themeable." |
| 5 | **Component reference links** | Cross-links to related components / sub-component pages. |
| 6 | **Installation** | "Button is already installed in `tamagui`, or you can install it independently." NPM snippet for the dedicated package. |
| 7 | **Usage** (simple components) or **Anatomy** (compound components) | Button uses "Usage": `export default () => <Button>Lorem ipsum</Button>`. Dialog uses "Anatomy" with the full compound API laid out as nested JSX. |
| 8 | **Behavior-specific sections** | Highly component-dependent. Dialog has "Scoping", "Dismissal Behavior", "Modal vs Non-Modal", "Preventing Outside Dismissal". Button has "Sizing", "Variants", "Icon Theming", "Group Theming", "Web Form Props", "Text Styling". |
| 9 | **Creating your own** | Recipe for replacing the built-in with a custom equivalent. Optional. |
| 10 | **API Reference** | Prop tables. For compound components, **one table per sub-component** (Dialog.Root, Dialog.Trigger, Dialog.Content, Dialog.Title, Dialog.Description, Dialog.Close…). |
| 11 | **Accessibility** | Sometimes folded into Features (Button); sometimes implicit in the API reference (Dialog). **Not always a standalone section.** |

## Motif-shaped per-component template

Synthesised from Tamagui's template + the motif voice card + the existing `<ApiSignature>` and `<ComponentDemoStrip>` components.

```mdx
---
title: <Component>
description: <One sentence describing what it is and when to reach for it.>
diataxis: reference
covers: [<Component>, <subcomponents>]
last_verified: <YYYY-MM-DD>
---

import { ApiSignature, ArticleMeta, Callout, CodeBlock, ComponentDemoStrip, Eyebrow, Lede } from '../../../components/index.js';

<Eyebrow><Family></Eyebrow>

# <Component>

<Lede>
  <One to three sentences. What it is, what it carries (its contract), and where to use it.
   Aphoristic, declarative — see voice card.>
</Lede>

<ComponentDemoStrip demo="<component-key>" />

<ArticleMeta />

## What it is

One short paragraph. Aphoristic opening sentence ("Box is the styling primitive."). Then 1-2
sentences extending. No headings inside.

## Install

For components reachable from the meta `usemotif` package:
> `<Component>` is exported from `usemotif`. No separate install.

For components only in a sub-package:
> ```bash
> yarn add @usemotif/<package>
> ```
> Then: `import { <Component> } from '@usemotif/<package>'`.

## Anatomy

For compound components only (Dialog, Menu, Combobox, etc.). Shows the full nested JSX.

```tsx
<Component.Root>
  <Component.Trigger />
  <Component.Content>
    <Component.Title />
    <Component.Description />
  </Component.Content>
</Component.Root>
```

(For simple components — Box, Stack, Text — skip Anatomy and go straight to API.)

## API

For each (sub-)component, an `<ApiSignature>` followed by a props table.

<ApiSignature
  name="<Component>"
  status="stable"
  signature={`function <Component>(props: <Component>Props): JSX.Element`}
  params={[…]}
/>

Then a `### Props` heading with a description table.

## Variants

When the component is `styled()`-built and exposes a `variants` axis. Skip when not relevant.

## Cross-platform notes

For components with a `.native.tsx` divergence (Dialog, Drawer, Menu, ScrollView, VirtualList,
SafeArea…). Use the "On web …; on native …" pattern from the voice card.

## Accessibility

For headless components and any styled component that asserts an accessibility contract
(Pressable, Button, Link). Lists the keyboard-interactions, aria-attributes the component
manages, and the responsibility the consumer keeps (e.g. supplying an aria-label for icon-only
buttons).

For purely visual primitives (Box, Stack, Spacer), skip.

## Examples

Three to six short snippets demonstrating common shapes. Each example is a self-contained
<CodeBlock>. Order by complexity, simplest first.

<Callout variant="info" title="Related">
  <links to 1-2 closely related component pages>
</Callout>
```

## Sections by component class

| Class | Sections present |
|---|---|
| **Visual primitive** (Box, Stack, Text) | Title • Lede • Demo • What it is • Install • API • Variants† • Cross-platform† • Examples • Related |
| **Interactive primitive** (Pressable, Button, IconButton, Link) | Title • Lede • Demo • What it is • Install • API • Variants† • Cross-platform† • A11y • Examples • Related |
| **Headless behavior** (Dialog, Menu, Combobox) | Title • Lede • Demo • What it is • Install • Anatomy • Behavior sections • API (per sub-component) • Cross-platform† • A11y • Examples • Related |
| **Hook** (useTheme, useThemeSetting) | Title • Lede • ApiSignature • What it does • Returns • Examples • Related |

† Only when the component has variants / native divergence.

## What motif borrows from Tamagui

- **Hero demo at the top of every per-component page.** Owns the page's first impression.
- **API reference per sub-component for compound components.** A single sprawling table is harder to scan.
- **"Installed in the meta package, or available standalone"** install messaging.
- **Features-as-bullets is replaced by the motif Lede.** Motif's Lede is a thesis sentence(s) — denser than a bullet list, more memorable, and matches the existing voice.
- **Sibling component navigation at the bottom** (motif uses the existing `<Callout variant="info" title="Related">` pattern instead of Tamagui's "Component Reference Links" header).

## What motif rejects from Tamagui

- **Versioned per-component pages** (Tamagui has `/ui/dialog/1.0.0`, `/ui/dialog/2.0.0`). Motif is always-latest; version-to-version stories live in `/migrating/*`.
- **Title-case headings** (Tamagui uses Title Case throughout). Motif keeps sentence case per voice card.
- **Configuration alternatives split across pages** (Tamagui has `Configuration` and `Config v5`). Motif keeps one config page per surface.
- **Feature-bullet-list opener.** Replaced by the motif Lede.
- **"Comes with styling, yet completely customizable and themeable"** style marketing prose. Forbidden per voice card.
