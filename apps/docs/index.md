---
layout: home

hero:
  name: 'motif-js'
  text: 'One styling library for web, React Native, and desktop.'
  tagline: 'Style props, theming, responsive, container queries, and a progressive compiler — all three platforms treated as first-class equals.'
  actions:
    - theme: brand
      text: Get started
      link: /guides/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/foo-stack/motif-js

features:
  - title: 50+ primitives
    details: 'Box, Stack, Text, Button, Avatar, Tooltip, Drawer — every primitive ships on both renderers with the same prop schema.'
  - title: 36 headless components
    details: 'Dialog, Menu, Combobox, Tabs, Toast, Calendar, TreeView — accessibility-first behaviour with no built-in styles. Compose your own visuals.'
  - title: Progressive compiler
    details: '1.73× faster on render-heavy paths. Compiled output is byte-identical to runtime, so half-compiled apps dedupe correctly. Babel / Vite / Webpack / Metro plugins.'
  - title: Container queries
    details: 'Both media queries and container queries, with object / array / string DSL syntaxes. Container-query polyfill for native via onLayout.'
  - title: SSR-ready
    details: 'Streaming SSR via AsyncLocalStorage. Next App Router integration. RSC-compatible primitives.'
  - title: Type-safe theming
    details: 'Two-layer tokens (primitive + semantic), nested sub-themes, CSS variables on web, JS context on native. Token references resolve at compile time on the web and at runtime on native.'
---

## Installation

```sh
yarn add @motif-js/react @motif-js/tokens
```

```tsx
import { Box, Button, ThemeProvider } from '@motif-js/react';
import { lightTheme, darkTheme } from '@motif-js/tokens';

export function App() {
  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
      <Box p="$4" bg="$colors.surface.base">
        <Button onPress={() => console.log('hi')}>Click me</Button>
      </Box>
    </ThemeProvider>
  );
}
```

## Status

motif-js is at **v1.0.0** on npm — the primitives + headless layer is complete, but
this is **not yet the original v1.0 quality bar**. APIs may shift between v1.0 and the
upcoming quality-bar release; semantic-stability commits at that point.
