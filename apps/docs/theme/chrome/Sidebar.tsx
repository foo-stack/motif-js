import { Box, VStack } from '@motif-js/react';
import { usePage, useSidebar } from '@vorge/core/runtime';
import type { SidebarItem } from '@vorge/core/sidebar';
import { Anchor } from './Anchor.js';

const ASIDE_STYLE = {
  // Custom scrollbar — same as chrome.css's `.sidebar::-webkit-scrollbar` rules.
  scrollbarWidth: 'thin' as const,
  fontFeatureSettings: 'normal',
};

export function Sidebar() {
  const items = useSidebar();
  const route = usePage();

  return (
    <Box
      as="aside"
      display={{ base: 'none', md: 'block' }}
      aria-label="Documentation sidebar"
      position="sticky"
      top={72}
      alignSelf="start"
      maxH="calc(100vh - 96px)"
      overflowY="auto"
      pt="$2"
      pr="$2"
      pb="$6"
      style={ASIDE_STYLE}
    >
      {items.map((item, i) => (
        <SidebarSection key={itemKey(item)} item={item} activeUrl={route.url} isFirst={i === 0} />
      ))}
    </Box>
  );
}

function SidebarSection({
  item,
  activeUrl,
  isFirst,
}: {
  item: SidebarItem;
  activeUrl: string;
  isFirst: boolean;
}) {
  // chrome.css used `.side-section + .side-section { margin-top: 14px }`
  // — sibling combinator means only sections AFTER the first one have
  // top margin. Mirror by skipping marginTop on the first section.
  const mt = isFirst ? 0 : 14;
  if ('link' in item) {
    return (
      <Box as="div" mt={mt}>
        <SidebarList>
          <SidebarLink item={item} activeUrl={activeUrl} />
        </SidebarList>
      </Box>
    );
  }
  return (
    <Box as="div" mt={mt}>
      <SidebarTitle>{item.text}</SidebarTitle>
      <SidebarList>
        {item.items.map((sub) => (
          <SidebarLink key={itemKey(sub)} item={sub} activeUrl={activeUrl} />
        ))}
      </SidebarList>
    </Box>
  );
}

function SidebarList({ children }: { children: React.ReactNode }) {
  return (
    <VStack as="ul" gap={0} m={0} p={0} style={{ listStyle: 'none' }}>
      {children}
    </VStack>
  );
}

function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
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
      py="4px"
      px="10px"
      mb="2px"
    >
      {children}
    </Box>
  );
}

function SidebarLink({ item, activeUrl }: { item: SidebarItem; activeUrl: string }) {
  if ('link' in item) {
    const active = item.link === activeUrl;
    return (
      <Box as="li">
        <Anchor
          href={item.link}
          display="flex"
          alignItems="center"
          gap="$2"
          py="3px"
          px="10px"
          fontFamily="$fontFamilies.sans"
          fontWeight={active ? 500 : 400}
          fontSize="13.5px"
          lineHeight="1.4"
          color={active ? '$colors.accent.muted' : '$colors.fg.muted'}
          bg={active ? '$colors.accent.soft' : 'transparent'}
          borderRadius="5px"
          position="relative"
          transition="all 120ms var(--easings-base)"
          style={{ textDecoration: 'none' }}
          {...(active
            ? {}
            : { _hover: { color: '$colors.fg.strong', bg: '$colors.surface.paper2' } })}
        >
          {item.text}
          {item.badge ? <SidebarBadge variant={item.badge}>{item.badge}</SidebarBadge> : null}
        </Anchor>
      </Box>
    );
  }
  return (
    <Box as="li">
      <SidebarTitle>{item.text}</SidebarTitle>
      <SidebarList>
        {item.items.map((sub) => (
          <SidebarLink key={itemKey(sub)} item={sub} activeUrl={activeUrl} />
        ))}
      </SidebarList>
    </Box>
  );
}

function SidebarBadge({ variant, children }: { variant: string; children: React.ReactNode }) {
  const isNew = variant === 'new';
  return (
    <Box
      as="span"
      ml="auto"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="9.5px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.08em"
      py="3px"
      px="5px"
      borderRadius="3px"
      bg={isNew ? '$colors.status.successSoft' : '$colors.surface.paper3'}
      color={isNew ? '$colors.status.success' : '$colors.fg.faint'}
      borderStyle="solid"
      borderWidth={1}
      borderColor={isNew ? 'transparent' : '$colors.line.faint'}
    >
      {children}
    </Box>
  );
}

function itemKey(item: SidebarItem): string {
  return 'link' in item ? item.link : item.text;
}
