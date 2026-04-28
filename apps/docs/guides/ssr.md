# Server-side rendering

motif ships three composable mechanisms. Pick what fits.

## Sync `renderToString`

```tsx
import { renderToString } from 'react-dom/server';
import { SSRStyleCollector } from '@motif-js/react-web';

const collector = new SSRStyleCollector();
const html = collector.collect(() => renderToString(<App />));
const styleTag = collector.getStyleTag(); // <style data-motif-ssr>...</style>
```

Embed `styleTag` in `<head>` next to `html` and you're done. Works in any
SSR environment; no `node:` deps required.

## Streaming SSR / RSC

Concurrent rendering interleaves async work across requests, which corrupts
the module-level collector pointer. Import `@motif-js/react-web/server`
once at server startup to swap in an `AsyncLocalStorage`-backed storage
backend:

```ts
// server.ts (entry, runs once)
import '@motif-js/react-web/server';
```

After that, `collector.collect()` works correctly across async boundaries
(`await` / Suspense / etc.).

## Next.js App Router

The motif team's reference `<MotifStyleRegistry>` (canonical 30-line client
component, lives in `apps/ssr-next/app/motif-style-registry.tsx` in the
repo) creates a per-request collector, provides it via `CollectorContext`,
and uses `useServerInsertedHTML` to flush captured CSS as
`<style data-motif-ssr>` into the streamed `<head>`.

The registry pattern survives RSC + Suspense + streaming. Box / Pressable
read the active collector via `useActiveCollector()` and pass it as the
`override` to inject helpers.
