'use client';

import { Box } from 'usemotif';
import { useCallback, useState } from 'react';
import { Btn } from '../chrome/Anchor.js';
import { ArrowRight, GitHub } from '../chrome/icons.js';
import { DocAnchorBtn, DocPressBtn } from './_DocBtn.js';
import { sizeIconChildren } from './_icon-size.js';
import {
  Box as BoxIcon,
  Check,
  Code,
  Copy,
  Globe,
  Layers,
  Palette,
  Smartphone,
  Zap,
} from './icons.js';

interface CodeLine {
  readonly t: string;
  readonly hl?: boolean;
}

const samples: Record<string, readonly CodeLine[]> = {
  component: [
    { t: "import { styled } from 'usemotif';" },
    { t: '' },
    { t: "export const Button = styled('button', {", hl: true },
    { t: '  base: {', hl: true },
    { t: "    bg: '$colors.action.primary.bg',", hl: true },
    { t: "    color: '$colors.action.primary.fg',", hl: true },
    { t: "    paddingInline: '$space.4',", hl: true },
    { t: "    paddingBlock: '$space.2',", hl: true },
    { t: "    borderRadius: '$radii.md',", hl: true },
    { t: '  },', hl: true },
    { t: '});' },
    { t: '' },
    { t: '// Renders to deduped CSS on web,' },
    { t: '// to native style objects on iOS and Android.' },
  ],
  theme: [
    { t: "import { createTheme } from 'usemotif';" },
    { t: '' },
    { t: 'export const theme = createTheme({', hl: true },
    { t: "  name: 'light',", hl: true },
    { t: '  tokens: {', hl: true },
    { t: '    colors: {' },
    { t: "      paper: '#FBF7F2'," },
    { t: "      ink:   '#1C1917'," },
    { t: "      action: { primary: { bg: '#C2410C', fg: '#FBF7F2' } }," },
    { t: '    },' },
    { t: '    space: { 1: 4, 2: 8, 3: 12, 4: 16 },' },
    { t: '    radii: { sm: 4, md: 8, lg: 12 },' },
    { t: '  },' },
    { t: '});' },
  ],
  variants: [
    { t: "export const Button = styled('button', {" },
    {
      t: "  base: { paddingInline: '$space.3', paddingBlock: '$space.2', borderRadius: '$radii.md' },",
    },
    { t: '  variants: {', hl: true },
    { t: '    size: {', hl: true },
    { t: "      sm: { fontSize: 13, paddingInline: '$space.2' },", hl: true },
    { t: '      md: { fontSize: 14 },', hl: true },
    { t: "      lg: { fontSize: 16, paddingInline: '$space.5' },", hl: true },
    { t: '    },' },
    { t: '    intent: {' },
    {
      t: "      primary: { bg: '$colors.action.primary.bg', color: '$colors.action.primary.fg' },",
    },
    { t: "      ghost:   { bg: 'transparent' }," },
    { t: '    },' },
    { t: '  },' },
    { t: '});' },
  ],
};

const tabs = [
  { id: 'component', label: 'Component', Icon: Code },
  { id: 'theme', label: 'Theme', Icon: Palette },
  { id: 'variants', label: 'Variants', Icon: Layers },
] as const;

const INSTALL_CMD = 'npm i usemotif';

// h1 + em axes — Fraunces opsz=144 / SOFT 60 (h1) / SOFT 100 (em).
const H1_AXES = { opsz: 144, SOFT: 60 } as const;
const EM_AXES = { opsz: 144, SOFT: 100 } as const;

// Grain texture: radial dot pattern faded to transparent at the edges.
const GRAIN_MASK = 'radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)';

export function Hero() {
  const [active, setActive] = useState<string>('component');
  const [copied, setCopied] = useState(false);
  const select = useCallback((id: string) => () => setActive(id), []);
  const onCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(INSTALL_CMD).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, []);

  const lines = samples[active] ?? samples.component!;

  return (
    <Box as="section" position="relative" pt={96} pb={80} overflow="hidden">
      <Box
        aria-hidden="true"
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
        opacity={0.6}
        style={{
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--colors-line-faint) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        maskImage={GRAIN_MASK}
        WebkitMaskImage={GRAIN_MASK}
      />
      <Box maxW={1280} mx="auto" px={32}>
        <Box
          position="relative"
          display="grid"
          gap={64}
          alignItems="center"
          style={{ gridTemplateColumns: '1.1fr 1fr' }}
        >
          <Box>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={10}
              mb={24}
              py="6px"
              pl="6px"
              pr="10px"
              bg="$colors.surface.paper2"
              borderStyle="solid"
              borderWidth={1}
              borderColor="$colors.line.faint"
              borderRadius="99px"
              w="fit-content"
              fontFamily="$fontFamilies.mono"
              fontWeight={500}
              fontSize="11px"
              lineHeight={1}
              color="$colors.fg.faint"
              textTransform="uppercase"
              letterSpacing="0.14em"
            >
              <Box
                as="span"
                bg="$colors.accent.base"
                color="$colors.accent.fg"
                fontFamily="$fontFamilies.mono"
                fontWeight={500}
                fontSize="9.5px"
                lineHeight={1}
                py="4px"
                px="7px"
                borderRadius="99px"
                letterSpacing="0.08em"
              >
                v1.0.0
              </Box>
              Now stable
            </Box>
            <Box
              as="h1"
              m={0}
              mb={28}
              color="$colors.fg.strong"
              fontFamily="$fontFamilies.display"
              fontWeight={500}
              fontSize="96px"
              lineHeight={0.95}
              letterSpacing="-0.04em"
              fontVariationSettings={H1_AXES}
              style={{ textWrap: 'balance' }}
            >
              Write your styles once.{' '}
              <Box
                as="em"
                color="$colors.accent.base"
                fontWeight={400}
                fontVariationSettings={EM_AXES}
                style={{ fontStyle: 'italic' }}
              >
                Run them anywhere
              </Box>{' '}
              React runs.
            </Box>
            <Box
              as="p"
              m={0}
              mb={32}
              maxW={540}
              fontFamily="$fontFamilies.sans"
              fontWeight={400}
              fontSize="22px"
              lineHeight={1.5}
              color="$colors.fg.muted"
              style={{ textWrap: 'pretty' }}
            >
              motif is a cross-platform styling library for React. One source of truth for tokens,
              variants, and themes, resolved to deduped CSS on the web and platform style objects on
              iOS and Android.
            </Box>
            <Box display="flex" alignItems="center" gap={10} flexWrap="wrap">
              <DocAnchorBtn variant="primary" href="/getting-started/introduction">
                Get started <ArrowRight />
              </DocAnchorBtn>
              <DocPressBtn
                variant="copyInstall"
                onClick={onCopy}
                title={copied ? 'Copied' : 'Copy install command'}
                aria-label="Copy install command"
              >
                <Box as="span" color="$colors.fg.faint">
                  $
                </Box>
                <Box as="span">{INSTALL_CMD}</Box>
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  p={4}
                  borderRadius="4px"
                  color="$colors.fg.faint"
                  ml={4}
                >
                  {copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
                </Box>
              </DocPressBtn>
              <DocAnchorBtn
                variant="ghost"
                href="https://github.com/foo-stack/usemotif"
                rel="noreferrer"
              >
                <GitHub /> View on GitHub
              </DocAnchorBtn>
            </Box>
            <Box
              mt={32}
              display="flex"
              gap={28}
              flexWrap="wrap"
              fontFamily="$fontFamilies.mono"
              fontWeight={500}
              fontSize="12px"
              lineHeight={1}
              color="$colors.fg.faint"
              letterSpacing="0.06em"
              textTransform="uppercase"
            >
              <HeroMetaItem>
                <BoxIcon /> 12 KB gzipped
              </HeroMetaItem>
              <HeroMetaItem>
                <Zap /> Deduped CSS
              </HeroMetaItem>
              <HeroMetaItem>
                <Globe /> Web · iOS · Android
              </HeroMetaItem>
              <HeroMetaItem>
                <Check /> MIT licensed
              </HeroMetaItem>
            </Box>
          </Box>

          <Box
            position="relative"
            borderStyle="solid"
            borderWidth={1}
            borderColor="$colors.line.base"
            borderRadius="12px"
            bg="$colors.surface.paper2"
            overflow="hidden"
            shadow="$shadows.4"
          >
            <Box
              role="tablist"
              display="flex"
              borderBottomStyle="solid"
              borderBottomWidth={1}
              borderBottomColor="$colors.line.faint"
              style={{
                background:
                  'color-mix(in oklab, var(--colors-surface-paper2) 60%, var(--colors-surface-paper3))',
              }}
            >
              {tabs.map(({ id, label, Icon }) => (
                <CodeTab
                  key={id}
                  active={active === id}
                  onClick={select(id)}
                  label={label}
                  Icon={Icon}
                />
              ))}
            </Box>
            <Box position="relative" py={18} px={0}>
              <Box
                as="pre"
                m={0}
                p={0}
                borderWidth={0}
                borderRadius={0}
                fontFamily="$fontFamilies.mono"
                fontWeight={400}
                fontSize="13.5px"
                lineHeight={1.7}
                color="$colors.fg.strong"
                bg="transparent"
              >
                <code>
                  {lines.map((line, i) => (
                    <Box
                      as="span"
                      // eslint-disable-next-line react/no-array-index-key -- code lines are stable per tab
                      key={i}
                      display="block"
                      px="22px"
                      style={{
                        whiteSpace: 'pre',
                        ...(line.hl
                          ? {
                              background:
                                'color-mix(in oklab, var(--colors-accent-base) 10%, transparent)',
                              boxShadow: 'inset 2px 0 0 var(--colors-accent-base)',
                            }
                          : {}),
                      }}
                    >
                      {line.t || ' '}
                      {'\n'}
                    </Box>
                  ))}
                </code>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap={8}
              py={10}
              px={16}
              borderTopStyle="solid"
              borderTopWidth={1}
              borderTopColor="$colors.line.faint"
              bg="$colors.surface.paper"
              fontFamily="$fontFamilies.sans"
              fontWeight={400}
              fontSize="12px"
              lineHeight={1}
              color="$colors.fg.faint"
            >
              <Box as="span">Renders to:</Box>
              <PlatformPill active>
                <Globe /> Web
              </PlatformPill>
              <PlatformPill active>
                <Smartphone /> iOS
              </PlatformPill>
              <PlatformPill active>
                <Smartphone /> Android
              </PlatformPill>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function HeroMetaItem({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={7}
      style={{ fontSize: 'inherit' }}
    >
      {sizeIconChildren(children, 13, { opacity: 0.7 })}
    </Box>
  );
}

function CodeTab({
  active,
  onClick,
  label,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Btn
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      display="inline-flex"
      alignItems="center"
      gap={7}
      py={12}
      px={16}
      borderWidth={0}
      borderStyle="solid"
      borderRightStyle="solid"
      borderRightWidth={1}
      borderRightColor="$colors.line.faint"
      bg={active ? '$colors.surface.paper2' : 'transparent'}
      color={active ? '$colors.fg.strong' : '$colors.fg.faint'}
      cursor="pointer"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.1em"
      transition="all 120ms var(--easings-base)"
      {...(active ? {} : { _hover: { color: '$colors.fg.muted' } })}
    >
      <Icon width={12} height={12} /> {label}
    </Btn>
  );
}

function PlatformPill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={6}
      py="5px"
      px="9px"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.08em"
      borderRadius="4px"
      borderStyle="solid"
      borderWidth={1}
      bg={active ? '$colors.accent.soft' : '$colors.surface.paper2'}
      borderColor={
        active
          ? 'color-mix(in oklab, var(--colors-accent-base) 30%, transparent)'
          : '$colors.line.faint'
      }
      color={active ? '$colors.accent.muted' : '$colors.fg.muted'}
    >
      {sizeIconChildren(children, 11)}
    </Box>
  );
}
