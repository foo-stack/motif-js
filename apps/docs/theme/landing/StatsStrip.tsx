import { Box } from '@motif-js/react';

const VALUE_AXES = { opsz: 144, SOFT: 60 } as const;
const VALUE_EM_AXES = { opsz: 144, SOFT: 100 } as const;

export function StatsStrip() {
  return (
    <Box
      as="section"
      display="grid"
      className="docs-stats-grid"
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor="$colors.line.faint"
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      bg="$colors.surface.paper"
    >
      <Stat number="12" suffix=" KB" label="Gzipped on web" />
      <Stat number="3" label="Platforms supported" />
      <Stat number="0" suffix=" ms" label="Style-resolution overhead" />
      <Stat number="1.1" label="Stable since" />
    </Box>
  );
}

function Stat({ number, suffix, label }: { number: string; suffix?: string; label: string }) {
  return (
    <Box className="docs-stat-cell" py={56} px={32} textAlign="center">
      <Box
        m={0}
        fontFamily="$fontFamilies.display"
        fontWeight={500}
        fontSize="64px"
        lineHeight={0.95}
        letterSpacing="-0.03em"
        color="$colors.fg.strong"
        fontVariationSettings={VALUE_AXES}
      >
        <Box
          as="em"
          color="$colors.accent.base"
          fontVariationSettings={VALUE_EM_AXES}
          style={{ fontStyle: 'italic' }}
        >
          {number}
        </Box>
        {suffix === undefined ? null : suffix}
      </Box>
      <Box
        mt={14}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="12px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="$colors.fg.faint"
      >
        {label}
      </Box>
    </Box>
  );
}
