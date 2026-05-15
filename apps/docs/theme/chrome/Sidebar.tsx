import { Box, VStack } from 'usemotif';
import { useState } from 'react';
import { usePage, useSidebar } from '@vorge/core/runtime';
import type { SidebarItem } from '@vorge/core/sidebar';
import { Anchor, Btn } from './Anchor.js';
import { Chevron } from './icons.js';

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

/** True when `item` itself or any descendant links to `activeUrl`. */
function containsActive(item: SidebarItem, activeUrl: string): boolean {
  if ('link' in item) return item.link === activeUrl;
  return item.items.some((sub) => containsActive(sub, activeUrl));
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
      <CollapsibleCategory item={item} activeUrl={activeUrl} />
    </Box>
  );
}

/**
 * A category header that toggles its children. Collapsed by default;
 * starts expanded when it contains the active page so the reader's
 * current location is visible on load. Nests for sub-categories.
 */
function CollapsibleCategory({
  item,
  activeUrl,
}: {
  item: Extract<SidebarItem, { items: readonly SidebarItem[] }>;
  activeUrl: string;
}) {
  const [open, setOpen] = useState(() => containsActive(item, activeUrl));

  return (
    <Box as="div">
      <Btn
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        display="flex"
        alignItems="center"
        w="100%"
        gap="$2"
        py="4px"
        px="10px"
        mb="2px"
        bg="transparent"
        borderStyle="solid"
        borderWidth={0}
        cursor="pointer"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.12em"
        color="$colors.fg.faint"
        transition="color 120ms var(--easings-base)"
        _hover={{ color: '$colors.fg.strong' }}
      >
        <Box as="span" flex="1" style={{ textAlign: 'left' }}>
          {item.text}
        </Box>
        <Chevron
          style={{
            width: 9,
            height: 9,
            flex: '0 0 auto',
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 120ms var(--easings-base)',
          }}
        />
      </Btn>
      {open ? (
        <SidebarList>
          {item.items.map((sub) =>
            'link' in sub ? (
              <SidebarLink key={itemKey(sub)} item={sub} activeUrl={activeUrl} />
            ) : (
              <Box as="li" key={itemKey(sub)}>
                <CollapsibleCategory item={sub} activeUrl={activeUrl} />
              </Box>
            ),
          )}
        </SidebarList>
      ) : null}
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

function SidebarLink({
  item,
  activeUrl,
}: {
  item: Extract<SidebarItem, { link: string }>;
  activeUrl: string;
}) {
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
