import { Box, HStack, Heading, Paragraph, Pressable, Text, VStack, Wrap } from '@motif-js/react';
import {
  ArrowRight,
  Box as BoxIcon,
  Compass,
  Github,
  Globe,
  Layers,
  Palette,
  Smartphone,
  Sparkles,
  Zap,
} from '@motif-js/icons';
import { Link as RRLink } from 'react-router';
import type { ReactNode } from 'react';
import { Card } from '../components/content/Card';

interface FeatureCard {
  readonly title: string;
  readonly desc: string;
  readonly to: string;
  readonly icon: ReactNode;
  readonly accent?: boolean;
}

interface FeatureBullet {
  readonly title: string;
  readonly desc: string;
  readonly icon: ReactNode;
}

const FEATURE_CARDS: ReadonlyArray<FeatureCard> = [
  {
    title: 'Get started',
    desc: 'Install Motif, write your first styled component, and see the same code render on web and native in under five minutes.',
    to: '/docs/introduction',
    icon: <Compass />,
    accent: true,
  },
  {
    title: 'Tokens',
    desc: 'A two-layer system — raw scales for designers, semantic surface and text tokens for components. The lever you pull when everything needs to change at once.',
    to: '/docs/tokens',
    icon: <Palette />,
  },
  {
    title: 'Theming',
    desc: 'Compose themes from sub-themes. Light, dark, brand-A, brand-B — switch them at any boundary, and Motif resolves the right combination.',
    to: '/docs/theming',
    icon: <Layers />,
  },
  {
    title: 'API reference',
    desc: 'Every prop, every primitive, every hook. Generated from the source — never out of date, always type-safe.',
    to: '/api/box',
    icon: <BoxIcon />,
  },
];

const FEATURE_BULLETS: ReadonlyArray<FeatureBullet> = [
  {
    title: 'Universal by design',
    desc: 'One source file. Web, iOS, Android, server. The same component, the same props, the same output.',
    icon: <Globe />,
  },
  {
    title: 'Compiled, not interpreted',
    desc: 'Styles resolve at build time to atomic classes on the web and to platform style objects on native. No runtime cost on hot paths.',
    icon: <Zap />,
  },
  {
    title: 'Token-first',
    desc: 'Define your scale once. Reference it everywhere. Refactor by editing one file and watch every component follow.',
    icon: <Palette />,
  },
  {
    title: 'Variants that compose',
    desc: 'First-class size, intent, and state variants. They are values you can map, merge, and override like any other data.',
    icon: <Layers />,
  },
  {
    title: 'Tiny by default',
    desc: 'A handful of kilobytes gzipped. No peer dependencies beyond React. Tree-shakes cleanly when you only reach for the parts you use.',
    icon: <BoxIcon />,
  },
  {
    title: 'Native-aware',
    desc: 'Knows about platform-specific tokens, safe areas, and the gaps between them. Falls back gracefully when a property does not exist.',
    icon: <Smartphone />,
  },
];

export default function Index() {
  return (
    <Box
      maxWidth="$sizes.containerWide"
      mx="auto"
      px={{ base: '$5', md: '$8' }}
      // Pagefind: index the home page as a search result. Chrome stays
      // out of the index because it lives outside this wrapper (TopNav
      // sits above it in `ChromeShell`, Footer sits below).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ 'data-pagefind-body': '' } as any)}
    >
      <Hero />
      <FeatureCards />
      <BrandStory />
      <FeatureGrid />
      <FooterCta />
    </Box>
  );
}

function Hero() {
  return (
    <Box py={{ base: '$16', md: '$24' }} maxWidth={820} mx="auto" textAlign="center">
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
          fontSize={{ base: '$fontSizes.4xl', md: '$fontSizes.6xl' }}
          lineHeight="$lineHeights.tight"
          letterSpacing="-0.03em"
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
        <HStack gap="$3" flexWrap="wrap" justifyContent="center" pt="$3">
          <PrimaryCta to="/docs/introduction">
            Read the docs <ArrowRight aria-hidden="true" />
          </PrimaryCta>
          <InstallPill command="npm install @motif-js/react" />
          <GhostCta href="https://github.com/foo-stack/motif-js">
            <Github aria-hidden="true" /> View on GitHub
          </GhostCta>
        </HStack>
      </VStack>
    </Box>
  );
}

function FeatureCards() {
  return (
    <Box pb={{ base: '$10', md: '$16' }}>
      <Wrap gap="$4" alignItems="stretch">
        {FEATURE_CARDS.map((c) => (
          <Box
            key={c.to}
            flexBasis={{ base: '100%', md: '46%', lg: 0 }}
            flexGrow={1}
            minWidth={240}
          >
            <Card.Link to={c.to} p="$5" accent={c.accent}>
              <VStack gap="$3" alignItems="flex-start" height="100%">
                <Box display="inline-flex" color="$colors.accent" fontSize={20} aria-hidden="true">
                  {c.icon}
                </Box>
                <Heading
                  level={3}
                  fontFamily="$fonts.sans"
                  fontSize="$fontSizes.lg"
                  fontWeight="$fontWeights.semibold"
                  color="$colors.text.strong"
                >
                  {c.title}
                </Heading>
                <Paragraph
                  fontSize="$fontSizes.sm"
                  color="$colors.text.muted"
                  lineHeight="$lineHeights.normal"
                  flex={1}
                >
                  {c.desc}
                </Paragraph>
                <HStack
                  alignItems="center"
                  gap="$1"
                  color="$colors.accent"
                  fontSize="$fontSizes.sm"
                >
                  <Text as="span" fontWeight="$fontWeights.medium">
                    {c.title === 'Get started'
                      ? 'Start the tour'
                      : `Read the ${c.title.toLowerCase()}`}
                  </Text>
                  <Box display="inline-flex" fontSize={14} aria-hidden="true">
                    <ArrowRight />
                  </Box>
                </HStack>
              </VStack>
            </Card.Link>
          </Box>
        ))}
      </Wrap>
    </Box>
  );
}

function BrandStory() {
  return (
    <Box
      py={{ base: '$12', md: '$20' }}
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="$colors.border.muted"
    >
      <Wrap gap="$10" alignItems="flex-start">
        <Box flexBasis={{ base: '100%', md: 320 }} flexGrow={1}>
          <VStack gap="$3" alignItems="flex-start">
            <Text
              as="span"
              fontFamily="$fonts.sans"
              fontSize="$fontSizes.2xs"
              fontWeight="$fontWeights.semibold"
              color="$colors.text.faint"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              A short note
            </Text>
            <Heading
              level={2}
              fontFamily="$fonts.display"
              fontWeight="$fontWeights.semibold"
              fontSize={{ base: '$fontSizes.2xl', md: '$fontSizes.3xl' }}
              lineHeight="$lineHeights.tight"
              color="$colors.text.strong"
            >
              On style, and why we wrote another library.
            </Heading>
          </VStack>
        </Box>
        <Box flexBasis={{ base: '100%', md: 0 }} flexGrow={2} minWidth={280}>
          <VStack gap="$4" alignItems="stretch">
            <Paragraph
              fontSize="$fontSizes.md"
              color="$colors.text.default"
              lineHeight="$lineHeights.prose"
            >
              Most styling libraries pick a side. They build for the web first and port to native,
              or build for native and ask the web to behave. We did not want to choose.
            </Paragraph>
            <Paragraph
              fontSize="$fontSizes.md"
              color="$colors.text.muted"
              lineHeight="$lineHeights.prose"
            >
              Motif compiles a single style declaration to atomic CSS on the web and to platform
              style objects on iOS and Android. Tokens resolve once, at build time. Variants are
              statically analyzable. Themes swap without re-render storms.
            </Paragraph>
            <Paragraph
              fontSize="$fontSizes.md"
              color="$colors.text.muted"
              lineHeight="$lineHeights.prose"
            >
              It is a small library that does one thing well: it lets you describe how something
              looks, in a language that travels.
            </Paragraph>
          </VStack>
        </Box>
      </Wrap>
    </Box>
  );
}

function FeatureGrid() {
  return (
    <Box
      py={{ base: '$12', md: '$20' }}
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="$colors.border.muted"
    >
      <VStack gap="$3" alignItems="flex-start" mb="$10">
        <Text
          as="span"
          fontFamily="$fonts.sans"
          fontSize="$fontSizes.2xs"
          fontWeight="$fontWeights.semibold"
          color="$colors.text.faint"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          Why Motif
        </Text>
        <Heading
          level={2}
          fontFamily="$fonts.display"
          fontWeight="$fontWeights.semibold"
          fontSize={{ base: '$fontSizes.2xl', md: '$fontSizes.3xl' }}
          lineHeight="$lineHeights.tight"
          color="$colors.text.strong"
          maxWidth={620}
        >
          A quiet set of opinions, well-tested.
        </Heading>
      </VStack>
      <Wrap gap="$8" alignItems="flex-start">
        {FEATURE_BULLETS.map((b) => (
          <Box
            key={b.title}
            flexBasis={{ base: '100%', sm: '46%', lg: '30%' }}
            flexGrow={1}
            minWidth={240}
          >
            <VStack gap="$2" alignItems="flex-start">
              <Box
                display="inline-flex"
                width={36}
                height={36}
                alignItems="center"
                justifyContent="center"
                borderRadius="$radii.md"
                bg="$colors.accentSoft"
                color="$colors.accent"
                fontSize={18}
                mb="$1"
                aria-hidden="true"
              >
                {b.icon}
              </Box>
              <Heading
                level={4}
                fontFamily="$fonts.sans"
                fontSize="$fontSizes.md"
                fontWeight="$fontWeights.semibold"
                color="$colors.text.strong"
              >
                {b.title}
              </Heading>
              <Paragraph
                fontSize="$fontSizes.sm"
                color="$colors.text.muted"
                lineHeight="$lineHeights.normal"
              >
                {b.desc}
              </Paragraph>
            </VStack>
          </Box>
        ))}
      </Wrap>
    </Box>
  );
}

function FooterCta() {
  return (
    <Box
      my={{ base: '$10', md: '$16' }}
      px={{ base: '$5', md: '$8' }}
      py={{ base: '$8', md: '$10' }}
      borderRadius="$radii.lg"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      bg="$colors.surface.muted"
    >
      <Wrap gap="$5" alignItems="center" justifyContent="space-between">
        <Box flexBasis={{ base: '100%', md: 0 }} flexGrow={1} minWidth={260}>
          <Heading
            level={3}
            fontFamily="$fonts.display"
            fontSize={{ base: '$fontSizes.xl', md: '$fontSizes.2xl' }}
            fontWeight="$fontWeights.semibold"
            color="$colors.text.strong"
            mb="$2"
          >
            Ready to start?
          </Heading>
          <Paragraph
            fontSize="$fontSizes.sm"
            color="$colors.text.muted"
            lineHeight="$lineHeights.normal"
          >
            The introduction is a five-minute read. By the end you will have a styled component
            running on web and native — from the same source.
          </Paragraph>
        </Box>
        <PrimaryCta to="/docs/introduction">
          Read the introduction <ArrowRight aria-hidden="true" />
        </PrimaryCta>
      </Wrap>
    </Box>
  );
}

function PrimaryCta({ to, children }: { to: string; children: ReactNode }) {
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

function GhostCta({ href, children }: { href: string; children: ReactNode }) {
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

function InstallPill({ command }: { command: string }) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="$2"
      px="$4"
      py="$3"
      borderRadius="$radii.md"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      bg="$colors.surface.raised"
      fontFamily="$fonts.mono"
      fontSize="$fontSizes.sm"
      color="$colors.text.muted"
    >
      <Sparkles aria-hidden="true" />
      <Text as="span" color="$colors.text.default">
        {command}
      </Text>
    </Box>
  );
}
