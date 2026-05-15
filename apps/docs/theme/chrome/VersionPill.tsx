import { Box } from 'usemotif';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Btn } from './Anchor.js';
import { Chevron } from './icons.js';

const VERSIONS = [{ version: 'v1.0.0', label: 'Latest', tag: 'current' as const }];

const CHEVRON_STYLE = { width: 10, height: 10, opacity: 0.7 };

const TAG_COLORS: Readonly<Record<'current' | 'stable' | 'canary', { color: string; bg: string }>> =
  {
    current: { color: '$colors.accent.base', bg: '$colors.accent.soft' },
    stable: { color: '$colors.fg.faint', bg: '$colors.surface.paper3' },
    canary: { color: '$colors.status.warning', bg: '$colors.status.warningSoft' },
  };

export function VersionPill() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={wrap} style={{ position: 'relative' }}>
      <Btn
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        display="inline-flex"
        alignItems="center"
        gap="6px"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        color="$colors.fg.faint"
        py="4px"
        px="7px"
        bg="$colors.surface.paper2"
        borderStyle="solid"
        borderWidth={1}
        borderColor="$colors.line.faint"
        borderRadius="4px"
        cursor="pointer"
        ml="4px"
        transition="all 160ms var(--easings-base)"
        _hover={{ color: '$colors.fg.strong', borderColor: '$colors.line.base' }}
      >
        v1.0.0
        <Chevron style={CHEVRON_STYLE} />
      </Btn>
      {open ? (
        <Box
          role="menu"
          position="absolute"
          top="calc(100% + 6px)"
          right={0}
          zIndex={50}
          minW={220}
          p="4px"
          bg="$colors.surface.paper"
          borderStyle="solid"
          borderWidth={1}
          borderColor="$colors.line.base"
          borderRadius="6px"
          boxShadow="$shadows.2"
          display="flex"
          flexDirection="column"
          gap="2px"
        >
          {VERSIONS.map((v) => (
            <Btn
              key={v.version}
              type="button"
              role="menuitem"
              display="grid"
              alignItems="center"
              gap="$2"
              p="6px 8px"
              bg="transparent"
              borderStyle="solid"
              borderWidth={0}
              borderRadius="4px"
              cursor="pointer"
              fontFamily="$fontFamilies.sans"
              fontWeight={400}
              fontSize="12.5px"
              lineHeight={1}
              color="$colors.fg.muted"
              textAlign="left"
              transition="all 120ms var(--easings-base)"
              style={{ gridTemplateColumns: 'auto 1fr auto' }}
              _hover={{ bg: '$colors.surface.paper2', color: '$colors.fg.strong' }}
            >
              <Box
                as="span"
                fontFamily="$fontFamilies.mono"
                fontWeight={500}
                fontSize="11.5px"
                lineHeight={1}
                color="$colors.fg.strong"
              >
                {v.version}
              </Box>
              <Box as="span">{v.label}</Box>
              <Box
                as="span"
                fontFamily="$fontFamilies.mono"
                fontWeight={500}
                fontSize="9.5px"
                lineHeight={1}
                textTransform="uppercase"
                letterSpacing="0.08em"
                py="3px"
                px="5px"
                borderRadius="3px"
                color={TAG_COLORS[v.tag].color}
                bg={TAG_COLORS[v.tag].bg}
              >
                {v.tag}
              </Box>
            </Btn>
          ))}
        </Box>
      ) : null}
    </div>
  );
}
