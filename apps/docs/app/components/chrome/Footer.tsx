import { Box, HStack, Text, VStack, Wrap } from '@motif-js/react';
import { Link as RRLink } from 'react-router';
import { Lockup } from './Lockup';

interface FooterColumn {
  readonly title: string;
  readonly links: ReadonlyArray<{
    readonly label: string;
    readonly to: string;
    readonly external?: boolean;
  }>;
}

const COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    title: 'Documentation',
    links: [
      { label: 'Introduction', to: '/docs/introduction' },
      { label: 'Installation', to: '/docs/installation' },
      { label: 'API reference', to: '/api/box' },
      { label: 'Examples', to: '/examples' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', to: 'https://github.com/foo-stack/motif-js', external: true },
      { label: 'Discord', to: 'https://discord.gg/motif', external: true },
      { label: 'X / Twitter', to: 'https://twitter.com/motifjs', external: true },
      { label: 'Bluesky', to: 'https://bsky.app/profile/motif.dev', external: true },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Releases', to: 'https://github.com/foo-stack/motif-js/releases', external: true },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Contribute', to: '/contribute' },
      {
        label: 'License',
        to: 'https://github.com/foo-stack/motif-js/blob/main/LICENSE',
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <Box
      as="footer"
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="$colors.border.muted"
      bg="$colors.surface.muted"
      mt="$24"
    >
      <Box maxWidth="$sizes.containerWide" mx="auto" px={{ base: '$5', md: '$8' }} py="$16">
        <Wrap gap="$8" alignItems="flex-start">
          <Box flexBasis={{ base: '100%', lg: 320 }} maxWidth={360} flexGrow={1}>
            <VStack alignItems="flex-start" gap="$4" color="$colors.text.strong">
              <Lockup size="md" />
              <Text
                as="p"
                color="$colors.text.muted"
                fontSize="$fontSizes.sm"
                lineHeight="$lineHeights.normal"
              >
                A styling library for React, on every platform. Open source, MIT-licensed, and made
                by people who care about the craft.
              </Text>
            </VStack>
          </Box>
          {COLUMNS.map((col) => (
            <Box key={col.title} flexBasis={{ base: '45%', lg: 0 }} flexGrow={1} minWidth={140}>
              <VStack alignItems="flex-start" gap="$3">
                <Text
                  as="span"
                  fontFamily="$fonts.sans"
                  fontSize="$fontSizes.2xs"
                  fontWeight="$fontWeights.semibold"
                  color="$colors.text.faint"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  {col.title}
                </Text>
                <VStack as="ul" gap="$2" alignItems="flex-start" m={0} p={0}>
                  {col.links.map((link) => (
                    <Box as="li" key={link.label} m={0} p={0}>
                      <FooterLink link={link} />
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </Box>
          ))}
        </Wrap>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          mt="$12"
          pt="$6"
          borderTopWidth={1}
          borderTopStyle="solid"
          borderTopColor="$colors.border.muted"
          color="$colors.text.faint"
          fontSize="$fontSizes.xs"
          flexWrap="wrap"
          gap="$3"
        >
          <Text as="span">© 2026 Motif. Released under the MIT License.</Text>
          <Text as="span">Built with Motif.</Text>
        </HStack>
      </Box>
    </Box>
  );
}

function FooterLink({ link }: { link: FooterColumn['links'][number] }) {
  const sharedStyle = {
    fontSize: '$fontSizes.sm',
    color: '$colors.text.muted',
    textDecoration: 'none',
    _hover: { color: '$colors.text.strong' },
  } as const;

  if (link.external === true) {
    return (
      <Box
        as="a"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ href: link.to, target: '_blank', rel: 'noreferrer' } as any)}
        {...sharedStyle}
      >
        {link.label} ↗
      </Box>
    );
  }
  return (
    <Box
      as={RRLink}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ to: link.to } as any)}
      {...sharedStyle}
    >
      {link.label}
    </Box>
  );
}
