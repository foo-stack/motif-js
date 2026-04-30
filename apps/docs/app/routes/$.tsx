import { Box, HStack, Heading, Paragraph, Text, VStack } from '@motif-js/react';
import { ArrowRight, Compass } from '@motif-js/icons';
import { Link as RRLink } from 'react-router';
import { Card } from '../components/content/Card';

interface Suggestion {
  readonly label: string;
  readonly section: string;
  readonly to: string;
}

const SUGGESTIONS: ReadonlyArray<Suggestion> = [
  { label: 'Introduction', section: 'Getting started', to: '/docs/introduction' },
  { label: 'Installation', section: 'Getting started', to: '/docs/installation' },
  { label: 'Tokens', section: 'Concepts', to: '/docs/tokens' },
  { label: 'Box', section: 'API reference', to: '/api/box' },
];

/**
 * Catch-all 404. Reachable both as the in-build static fallback and
 * via the SPA-fallback file the build emits. Visual goal: warm and
 * unhurried — broken links happen, give the reader four good doors.
 */
export default function NotFound() {
  return (
    <Box maxWidth="$sizes.containerWide" mx="auto" px={{ base: '$5', md: '$8' }}>
      <Box py={{ base: '$16', md: '$24' }} maxWidth={760} mx="auto">
        <VStack gap="$5" alignItems="flex-start">
          <Text
            as="span"
            fontFamily="$fonts.display"
            fontSize={{ base: '$fontSizes.6xl', md: '$fontSizes.display' }}
            fontWeight="$fontWeights.semibold"
            color="$colors.text.faint"
            lineHeight="$lineHeights.tight"
            letterSpacing="-0.04em"
          >
            404
          </Text>
          <Heading
            level={1}
            fontFamily="$fonts.display"
            fontWeight="$fontWeights.semibold"
            fontSize={{ base: '$fontSizes.3xl', md: '$fontSizes.4xl' }}
            lineHeight="$lineHeights.tight"
            letterSpacing="-0.02em"
            color="$colors.text.strong"
          >
            This page doesn't exist.
          </Heading>
          <Paragraph
            fontSize={{ base: '$fontSizes.md', md: '$fontSizes.lg' }}
            color="$colors.text.muted"
            lineHeight="$lineHeights.normal"
            maxWidth={620}
          >
            It might have moved with a recent docs reorg, or you may have followed a link that's
            gone stale. Try one of the doors below — or search the docs for what you were looking
            for.
          </Paragraph>
          <HStack gap="$3" flexWrap="wrap" pt="$2">
            <Box
              as={RRLink}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({ to: '/' } as any)}
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
              Back home <ArrowRight aria-hidden="true" />
            </Box>
            <Box
              as={RRLink}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({ to: '/docs/introduction' } as any)}
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
              _hover={{ bg: '$colors.surface.muted', borderColor: '$colors.border.strong' }}
            >
              <Compass aria-hidden="true" /> Read the introduction
            </Box>
          </HStack>
        </VStack>
        <Box mt="$16">
          <Text
            as="span"
            fontFamily="$fonts.sans"
            fontSize="$fontSizes.2xs"
            fontWeight="$fontWeights.semibold"
            color="$colors.text.faint"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            You might be looking for
          </Text>
          <VStack gap="$3" alignItems="stretch" mt="$4">
            {SUGGESTIONS.map((s) => (
              <Card.Link key={s.to} to={s.to} p="$4">
                <HStack alignItems="center" justifyContent="space-between" gap="$3">
                  <VStack gap={2} alignItems="flex-start">
                    <Text
                      as="span"
                      fontFamily="$fonts.sans"
                      fontSize="$fontSizes.md"
                      fontWeight="$fontWeights.semibold"
                      color="$colors.text.strong"
                    >
                      {s.label}
                    </Text>
                    <Text as="span" fontSize="$fontSizes.sm" color="$colors.text.muted">
                      {s.section}
                    </Text>
                  </VStack>
                  <Box
                    display="inline-flex"
                    color="$colors.text.faint"
                    fontSize={16}
                    aria-hidden="true"
                  >
                    <ArrowRight />
                  </Box>
                </HStack>
              </Card.Link>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
