import { Box } from 'motif-js';

const VALUE_AXES = { opsz: 144, SOFT: 60 } as const;
const VALUE_EM_AXES = { opsz: 144, SOFT: 100 } as const;

const STATS = [
  { number: '12', suffix: ' KB', label: 'Gzipped on web' },
  { number: '3', label: 'Platforms supported' },
  { number: '0', suffix: ' ms', label: 'Style-resolution overhead' },
  { number: '1.1', label: 'Stable since' },
] as const;

export function StatsStrip() {
  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor="$colors.line.faint"
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      bg="$colors.surface.paper"
    >
      {STATS.map((s, i) => (
        <Stat key={s.label} index={i} count={STATS.length} {...s} />
      ))}
    </Box>
  );
}

function Stat({
  number,
  suffix,
  label,
  index,
  count,
}: {
  number: string;
  suffix?: string;
  label: string;
  index: number;
  count: number;
}) {
  // At base (2-col grid): drop the divider on every even cell — those
  // are the right edge of their row. At lg+ (count-col grid): drop only
  // on the last cell. Last-cell rule applies at both breakpoints.
  const isLast = index === count - 1;
  const isRowEndAtBase = index % 2 === 1;
  const baseShow = !(isLast || isRowEndAtBase);
  const lgShow = !isLast;
  return (
    <Box
      py={56}
      px={32}
      textAlign="center"
      borderRightStyle={{
        base: baseShow ? 'solid' : 'none',
        lg: lgShow ? 'solid' : 'none',
      }}
      borderRightWidth={{ base: baseShow ? 1 : 0, lg: lgShow ? 1 : 0 }}
      borderRightColor="$colors.line.faint"
    >
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
