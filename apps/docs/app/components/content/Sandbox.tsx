'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Box, Text } from '@motif-js/react';

/**
 * Live demo block. Sandpack runs an in-browser bundler that fetches
 * `@motif-js/react@1.1.2` from npm — every demo on the docs site
 * is the canonical npm install path, not a workspace shortcut. The
 * sandpack chunk is lazy-loaded and gated on intersection so a page
 * with five demos costs roughly the same as a page with zero until
 * the user scrolls one into view.
 */

export interface SandboxProps {
  /** Single-file demo source. Starts in `App.tsx` and is the entry. */
  code: string;
  /**
   * Pinned version of the `@motif-js/*` packages the demo installs.
   * Defaults to the docs-app pin so demos always match the prose.
   */
  motifVersion?: string;
  /** Approximate editor + preview height. Defaults to 360 px. */
  height?: number;
}

const DEFAULT_MOTIF_VERSION = '1.1.2';

const SandpackImpl = lazy(() => import('./SandboxImpl'));

export function Sandbox({
  code,
  motifVersion = DEFAULT_MOTIF_VERSION,
  height = 360,
}: SandboxProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }
    const node = wrapRef.current;
    if (node === null) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ ref: wrapRef } as any)}
      my="$5"
      borderRadius="$radii.lg"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      bg="$colors.surface.muted"
      overflow="hidden"
      minHeight={height}
    >
      {shouldLoad ? (
        <Suspense fallback={<Placeholder height={height} />}>
          <SandpackImpl code={code} motifVersion={motifVersion} height={height} />
        </Suspense>
      ) : (
        <Placeholder height={height} />
      )}
    </Box>
  );
}

function Placeholder({ height }: { height: number }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={height}
      color="$colors.text.faint"
      fontSize="$fontSizes.sm"
      fontFamily="$fonts.mono"
    >
      <Text as="span">loading sandbox</Text>
    </Box>
  );
}
