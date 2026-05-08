import { Box } from '@motif-js/react';
import { usePage, useSidebar, useVorge } from '@vorge/core/runtime';
import type { SidebarItem } from '@vorge/core/sidebar';
import { Anchor } from './Anchor.js';
import { ArrowLeft, ArrowRight } from './icons.js';

const NAV_STYLE = { fontFeatureSettings: 'normal' };
const ARROW_STYLE = { width: 16, height: 16 };

export function PageNav() {
  const route = usePage();
  const sidebar = useSidebar();
  const { manifest } = useVorge();
  const flat = flattenSidebarLinks(sidebar);
  const i = flat.indexOf(route.url);
  const prevUrl = i > 0 ? flat[i - 1] : undefined;
  const nextUrl = i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined;
  const prev = prevUrl ? manifest.byUrl[prevUrl] : undefined;
  const next = nextUrl ? manifest.byUrl[nextUrl] : undefined;

  if (!prev && !next) return null;

  return (
    <Box
      as="nav"
      aria-label="Page navigation"
      display="grid"
      gap="14px"
      mt={64}
      pt={28}
      borderStyle="solid"
      borderTopWidth={1}
      borderRightWidth={0}
      borderBottomWidth={0}
      borderLeftWidth={0}
      borderTopColor="$colors.line.faint"
      style={{ ...NAV_STYLE, gridTemplateColumns: '1fr 1fr' }}
    >
      {prev ? <PageLink direction="prev" route={prev} /> : <span />}
      {next ? <PageLink direction="next" route={next} /> : <span />}
    </Box>
  );
}

interface RouteWithFm {
  url: string;
  frontmatter: { title?: unknown };
  headings: { depth: number; text: string }[];
}

function PageLink({ direction, route }: { direction: 'prev' | 'next'; route: RouteWithFm }) {
  const isNext = direction === 'next';
  return (
    <Anchor
      href={route.url}
      display="flex"
      flexDirection="column"
      gap="4px"
      py={14}
      px={18}
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius="6px"
      color="$colors.fg.base"
      bg="$colors.surface.paper"
      transition="all 160ms var(--easings-base)"
      style={{ textDecoration: 'none', textAlign: isNext ? 'right' : 'left' }}
      _hover={{ borderColor: '$colors.line.strong', bg: '$colors.surface.paper2' }}
    >
      <Box
        as="span"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="$colors.fg.faint"
      >
        {isNext ? 'Next' : 'Previous'}
      </Box>
      <Box
        as="span"
        fontFamily="$fontFamilies.display"
        fontWeight={600}
        fontSize="16px"
        lineHeight="1.3"
        color="$colors.fg.strong"
        display="inline-flex"
        alignItems="center"
        gap="$2"
        style={{
          fontVariationSettings: "'opsz' 36",
          justifyContent: isNext ? 'flex-end' : 'flex-start',
        }}
      >
        {!isNext ? <ArrowLeft style={ARROW_STYLE} /> : null}
        {titleOf(route)}
        {isNext ? <ArrowRight style={ARROW_STYLE} /> : null}
      </Box>
    </Anchor>
  );
}

function titleOf(route: RouteWithFm): string {
  const t = route.frontmatter.title;
  if (typeof t === 'string') return t;
  const h1 = route.headings.find((h) => h.depth === 1);
  return h1?.text ?? route.url;
}

function flattenSidebarLinks(items: SidebarItem[]): string[] {
  const out: string[] = [];
  const walk = (list: SidebarItem[]): void => {
    for (const it of list) {
      if ('link' in it) out.push(it.link);
      else walk(it.items);
    }
  };
  walk(items);
  return out;
}
