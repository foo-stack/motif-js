import { Box, HStack, Heading, Paragraph, Pressable, Text, VStack } from '@motif-js/react';
import { ArrowRight, Github } from '@motif-js/icons';
import { Link as RRLink } from 'react-router';

/**
 * Phase-1 home page — minimal hero + two CTAs. Validates the nav →
 * docs/introduction path. The full feature grid + showcase land in
 * Phase 3 alongside the Tier-1 content.
 */
export default function Index() {
  return (
    <Box maxWidth="$sizes.containerWide" mx="auto" px={{ base: '$5', md: '$8' }}>
      <Box py={{ base: '$16', md: '$32' }} maxWidth={760} mx="auto" textAlign="center">
        <VStack gap="$5" alignItems="center">
          <Text
            as="span"
            fontFamily="$fonts.sans"
            fontSize="$fontSizes.2xs"
            fontWeight="$fontWeights.semibold"
            color="$colors.text.faint"
            textTransform="uppercase"
            letterSpacing="0.12em"
          >
            Motif · v1.1.2 · Documentation
          </Text>
          <Heading
            level={1}
            fontFamily="$fonts.display"
            fontWeight="$fontWeights.semibold"
            fontSize={{ base: '$fontSizes.4xl', md: '$fontSizes.5xl' }}
            lineHeight="$lineHeights.tight"
            letterSpacing="-0.02em"
            color="$colors.text.strong"
          >
            Write your styles once. Run them anywhere React runs.
          </Heading>
          <Paragraph
            fontSize={{ base: '$fontSizes.md', md: '$fontSizes.lg' }}
            color="$colors.text.muted"
            lineHeight="$lineHeights.normal"
            maxWidth={620}
          >
            Motif is a cross-platform styling library for React. One source of truth for tokens,
            variants, and themes — rendered to atomic CSS on the web and to native style objects on
            iOS and Android.
          </Paragraph>
          <HStack gap="$3" flexWrap="wrap" justifyContent="center" pt="$4">
            <PrimaryCta to="/docs/introduction">
              Read the docs <ArrowRight aria-hidden="true" />
            </PrimaryCta>
            <GhostCta href="https://github.com/foo-stack/motif-js">
              <Github aria-hidden="true" /> View on GitHub
            </GhostCta>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

function PrimaryCta({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Box
      as={RRLink}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ to } as any)}
      display="inline-flex"
      alignItems="center"
      gap="$2"
      px="$5"
      py="$3"
      borderRadius="$radii.md"
      fontFamily="$fonts.sans"
      fontSize="$fontSizes.sm"
      fontWeight="$fontWeights.medium"
      bg="$colors.action.primary.bg"
      color="$colors.action.primary.fg"
      textDecoration="none"
      _hover={{ bg: '$colors.action.primary.hover' }}
      _focus={{ outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 }}
    >
      {children}
    </Box>
  );
}

function GhostCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Pressable
      as="a"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ href, target: '_blank', rel: 'noreferrer' } as any)}
      display="inline-flex"
      alignItems="center"
      gap="$2"
      px="$5"
      py="$3"
      borderRadius="$radii.md"
      fontFamily="$fonts.sans"
      fontSize="$fontSizes.sm"
      fontWeight="$fontWeights.medium"
      bg="transparent"
      color="$colors.text.default"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      textDecoration="none"
      cursor="pointer"
      _hover={{ bg: '$colors.surface.muted', borderColor: '$colors.border.strong' }}
      _focus={{ outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 }}
    >
      {children}
    </Pressable>
  );
}
