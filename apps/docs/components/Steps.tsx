import { Box } from 'motif-js';
import type { ReactNode } from 'react';

const TITLE_AXES = { opsz: 36 } as const;

export interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps) {
  return (
    <Box
      as="ol"
      my={22}
      pl={32}
      borderLeftStyle="solid"
      borderLeftWidth={1}
      borderLeftColor="$colors.line.faint"
      style={{ counterReset: 'step', listStyle: 'none', margin: '22px 0', paddingLeft: 32 }}
    >
      {children}
    </Box>
  );
}

export interface StepProps {
  title: ReactNode;
  children: ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <Box
      as="li"
      position="relative"
      pb={28}
      style={{ counterIncrement: 'step', listStyle: 'none' }}
      _before={{
        content: 'counter(step)',
        position: 'absolute',
        left: '-45px',
        top: 0,
        w: 26,
        h: 26,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '$fontFamilies.mono',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: 1,
        bg: '$colors.surface.paper2',
        color: '$colors.fg.strong',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '$colors.line.base',
        borderRadius: '50%',
      }}
    >
      <Box
        as="h3"
        m={0}
        mb={6}
        fontFamily="$fontFamilies.display"
        fontWeight={600}
        fontSize="18px"
        lineHeight={1.3}
        color="$colors.fg.strong"
        fontVariationSettings={TITLE_AXES}
      >
        {title}
      </Box>
      <Box
        fontFamily="$fontFamilies.sans"
        fontWeight={400}
        fontSize="15px"
        lineHeight={1.6}
        color="$colors.fg.muted"
        className="docs-step-body"
      >
        {children}
      </Box>
    </Box>
  );
}
