import { Box, VStack } from '@motif-js/react';
import { Anchor } from './Anchor.js';
import { Monogram } from './icons.js';

const FOOTER_STYLE = { fontFeatureSettings: 'normal' };
const MONOGRAM_STYLE = {
  width: 22,
  height: 22,
  color: 'var(--colors-accent-base)',
  flex: '0 0 auto',
};

interface FooterColumnDef {
  readonly title: string;
  readonly links: ReadonlyArray<{ readonly href: string; readonly text: string }>;
}

const COLUMNS: ReadonlyArray<FooterColumnDef> = [
  {
    title: 'Resources',
    links: [
      { href: '/getting-started/introduction', text: 'Getting started' },
      { href: '/concepts/tokens', text: 'Concepts' },
      { href: '/reference/styled', text: 'API reference' },
      { href: '/recipes/buttons', text: 'Recipes' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: 'https://github.com/foo-stack/motif-js', text: 'GitHub' },
      {
        href: 'https://github.com/foo-stack/motif-js/discussions',
        text: 'Discussions',
      },
      { href: 'https://github.com/foo-stack/motif-js/issues', text: 'Issues' },
      { href: '/changelog', text: 'Changelog' },
    ],
  },
  {
    title: 'Sitemap',
    links: [
      { href: '/', text: 'Home' },
      { href: '/guides/design-system', text: 'Guides' },
      { href: '/recipes/buttons', text: 'Recipes' },
      { href: '/changelog', text: 'Changelog' },
    ],
  },
];

export function Footer() {
  return (
    <Box
      as="footer"
      borderStyle="solid"
      borderTopWidth={1}
      borderRightWidth={0}
      borderBottomWidth={0}
      borderLeftWidth={0}
      borderTopColor="$colors.line.faint"
      py={48}
      px="$8"
      bg="$colors.surface.paper"
      style={FOOTER_STYLE}
    >
      <Box
        maxW={1440}
        mx="auto"
        display="grid"
        gap={48}
        alignItems="start"
        style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}
      >
        {/* Brand column */}
        <Box>
          <Anchor
            href="/"
            display="inline-flex"
            alignItems="center"
            gap="10px"
            color="$colors.fg.strong"
            style={{ textDecoration: 'none' }}
          >
            <Monogram style={MONOGRAM_STYLE} />
            <Box
              as="span"
              fontWeight={600}
              fontSize="19px"
              lineHeight={1}
              fontFamily="$fontFamilies.display"
              letterSpacing="-0.025em"
              style={{ fontVariationSettings: "'opsz' 36" }}
            >
              Motif
            </Box>
          </Anchor>
          <Box
            as="p"
            fontFamily="$fontFamilies.sans"
            fontWeight={400}
            fontSize="13px"
            lineHeight="1.5"
            color="$colors.fg.faint"
            mt={12}
            mb={0}
            maxW={280}
          >
            Cross-platform React styling for web, native, and desktop. Warm, editorial, ergonomic.
          </Box>
        </Box>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <FooterColumn key={col.title} column={col} />
        ))}
      </Box>

      <Box
        maxW={1440}
        mx="auto"
        mt={32}
        pt={24}
        borderStyle="solid"
        borderTopWidth={1}
        borderRightWidth={0}
        borderBottomWidth={0}
        borderLeftWidth={0}
        borderTopColor="$colors.line.faint"
        display="flex"
        justifyContent="space-between"
        fontFamily="$fontFamilies.sans"
        fontWeight={400}
        fontSize="12px"
        lineHeight={1}
        color="$colors.fg.faint"
      >
        <Box as="span">MIT licensed</Box>
        <Box as="span">
          Styled with{' '}
          <Anchor
            href="/styled-with-motif"
            color="$colors.fg.muted"
            style={{ textDecoration: 'underline' }}
          >
            <Box as="code" fontFamily="$fontFamilies.mono">
              @motif-js/react
            </Box>
          </Anchor>
          .{' '}
          <Anchor
            href="https://github.com/foo-stack/motif-js/tree/main/apps/docs"
            color="$colors.fg.muted"
            style={{ textDecoration: 'underline' }}
          >
            Source on GitHub
          </Anchor>
          .
        </Box>
        <Box as="span">© {new Date().getFullYear()} motif-js</Box>
      </Box>
    </Box>
  );
}

function FooterColumn({ column }: { column: FooterColumnDef }) {
  return (
    <Box>
      <Box
        as="span"
        display="block"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.12em"
        color="$colors.fg.faint"
        mb={14}
      >
        {column.title}
      </Box>
      <VStack as="ul" gap="$2" m={0} p={0} style={{ listStyle: 'none' }}>
        {column.links.map((link) => (
          <Box as="li" key={link.href}>
            <Anchor
              href={link.href}
              fontFamily="$fontFamilies.sans"
              fontWeight={400}
              fontSize="13.5px"
              lineHeight="1.4"
              color="$colors.fg.muted"
              transition="color 120ms var(--easings-base)"
              style={{ textDecoration: 'none' }}
              _hover={{ color: '$colors.fg.strong' }}
            >
              {link.text}
            </Anchor>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
