import { Box } from '@motif-js/react';
import { sizeIconChildren } from './_icon-size.js';
import { LandingSection, SectionEye } from './_LandingSection.js';
import { Check, Code, Globe, Smartphone } from './icons.js';

const lines: readonly { readonly t: string; readonly hl?: boolean }[] = [
  { t: "import { styled } from '@motif-js/react';" },
  { t: '' },
  { t: "export const Card = styled('section', {", hl: true },
  { t: '  base: {', hl: true },
  { t: "    bg: '$colors.surface.base',", hl: true },
  { t: "    p: '$space.6',", hl: true },
  { t: "    borderRadius: '$radii.lg',", hl: true },
  { t: "    boxShadow: '$shadows.md',", hl: true },
  { t: '  },', hl: true },
  { t: '  variants: {' },
  { t: '    elevated: {' },
  { t: "      true: { boxShadow: '$shadows.lg', transform: 'translateY(-2px)' }," },
  { t: '    },' },
  { t: '  },' },
  { t: '});' },
];

const H3_AXES = { opsz: 100 } as const;
const H3_EM_AXES = { opsz: 100, SOFT: 100 } as const;

export function UniversalShowcase() {
  return (
    <LandingSection>
      <Box display="grid" className="docs-showcase-grid" gap={56} alignItems="center">
        <Box>
          <SectionEye>The same code</SectionEye>
          <Box
            as="h3"
            m={0}
            mb={16}
            fontFamily="$fontFamilies.display"
            fontWeight={500}
            fontSize="36px"
            lineHeight={1.1}
            letterSpacing="-0.02em"
            color="$colors.fg.strong"
            fontVariationSettings={H3_AXES}
            style={{ textWrap: 'balance' }}
          >
            Renders the same on every{' '}
            <Box
              as="em"
              color="$colors.accent.base"
              fontVariationSettings={H3_EM_AXES}
              style={{ fontStyle: 'italic' }}
            >
              surface
            </Box>
            .
          </Box>
          <ShowcaseParagraph>
            Write once, deploy to web, iOS, Android, or your favourite SSR framework. Motif's
            runtime emits atomic CSS for browsers and platform style objects for React Native — from
            the same input.
          </ShowcaseParagraph>
          <ShowcaseParagraph>
            No second place to keep in sync. No "we'll get to native later." No conditional imports.
          </ShowcaseParagraph>
          <Box
            as="ul"
            m={0}
            mt={24}
            p={0}
            display="flex"
            flexDirection="column"
            gap={10}
            style={{ listStyle: 'none' }}
          >
            <ShowcaseItem>
              <strong>Web:</strong> atomic classes, hashed and deduped, zero parsing at runtime.
            </ShowcaseItem>
            <ShowcaseItem>
              <strong>iOS and Android:</strong> compiled <code>StyleSheet</code> objects, native
              performance.
            </ShowcaseItem>
            <ShowcaseItem>
              <strong>SSR and RSC:</strong> first-paint correct via <code>SSRStyleCollector</code>,
              no flash of unstyled content.
            </ShowcaseItem>
            <ShowcaseItem>
              <strong>Static analysis:</strong> tokens, variants, and theme references typecheck
              end-to-end.
            </ShowcaseItem>
          </Box>
        </Box>

        <Box
          className="hero__code"
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
            display="flex"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderBottomColor="$colors.line.faint"
            style={{
              background:
                'color-mix(in oklab, var(--colors-surface-paper2) 60%, var(--colors-surface-paper3))',
            }}
          >
            <ShowcaseCodeTab active>
              <Code /> Source
            </ShowcaseCodeTab>
            <ShowcaseCodeTab>
              <Globe /> Web output
            </ShowcaseCodeTab>
            <ShowcaseCodeTab>
              <Smartphone /> Native output
            </ShowcaseCodeTab>
          </Box>
          <Box position="relative" py={18} px={0}>
            <Box
              as="pre"
              m={0}
              p={0}
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
                    // eslint-disable-next-line react/no-array-index-key -- code lines are static
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
            <Box as="span">Output:</Box>
            <ShowcasePill>Web · atomic class</ShowcasePill>
            <ShowcasePill>Native · StyleSheet</ShowcasePill>
          </Box>
        </Box>
      </Box>
    </LandingSection>
  );
}

function ShowcaseParagraph({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="p"
      m={0}
      mb={12}
      maxW={460}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="16px"
      lineHeight={1.65}
      color="$colors.fg.muted"
      style={{ textWrap: 'pretty' }}
    >
      {children}
    </Box>
  );
}

function ShowcaseItem({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="li"
      display="flex"
      alignItems="flex-start"
      gap={10}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="14.5px"
      lineHeight={1.5}
      color="$colors.fg.base"
    >
      <Box as="span" color="$colors.accent.base" flexShrink={0} mt="2px">
        <Check width={16} height={16} />
      </Box>
      <Box as="span">{children}</Box>
    </Box>
  );
}

function ShowcaseCodeTab({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={7}
      py={12}
      px={16}
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
    >
      {sizeIconChildren(children, 12)}
    </Box>
  );
}

function ShowcasePill({ children }: { children: React.ReactNode }) {
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
      bg="$colors.surface.paper2"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.faint"
      color="$colors.fg.muted"
    >
      {children}
    </Box>
  );
}
