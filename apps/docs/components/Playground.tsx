// Vorge SSGs all components by default — interactive state is only wired
// up for components mounted via <Island>. Playground.client.tsx holds the
// real component (useState, controls, copy button); this file is the thin
// island wrapper authors import.

import { Island } from '@vorge/core/islands';
import { Box } from '@usemotif/react';
import type { PlaygroundProps } from './Playground.client.js';

export type { PlaygroundProps } from './Playground.client.js';

const FALLBACK_HEIGHT = 320;

export function Playground(props: PlaygroundProps = {}) {
  return (
    <Island<PlaygroundProps>
      client="load"
      load={() => import('./Playground.client.js')}
      props={props}
      fallback={<PlaygroundFallback />}
    />
  );
}

function PlaygroundFallback() {
  return (
    <Box
      mt={0}
      mb={28}
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius="10px"
      bg="$colors.surface.paper2"
      style={{ minHeight: FALLBACK_HEIGHT }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.1em"
      color="$colors.fg.faint"
    >
      Loading playground…
    </Box>
  );
}
