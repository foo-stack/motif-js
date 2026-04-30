'use client';

import { Box, HStack, Text, VStack } from '@motif-js/react';
import { Dialog } from '@motif-js/headless';
import { X } from '@motif-js/icons';
import { Link as RRLink, useLocation } from 'react-router';
import { Lockup } from './Lockup';

interface SidebarItem {
  readonly id: string;
  readonly label: string;
  readonly to: string;
  readonly badge?: 'new' | 'canary';
}

interface SidebarSection {
  readonly title: string;
  readonly items: ReadonlyArray<SidebarItem>;
}

const SECTIONS: ReadonlyArray<SidebarSection> = [
  {
    title: 'Getting started',
    items: [
      { id: 'introduction', label: 'Introduction', to: '/docs/introduction' },
      { id: 'installation', label: 'Installation', to: '/docs/installation' },
      { id: 'first-style', label: 'Your first style', to: '/docs/your-first-style' },
      { id: 'platforms', label: 'Web and native', to: '/docs/web-and-native' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { id: 'tokens', label: 'Tokens', to: '/docs/tokens' },
      { id: 'variants', label: 'Variants', to: '/docs/variants' },
      { id: 'theming', label: 'Theming', to: '/docs/theming' },
      { id: 'composition', label: 'Composition', to: '/docs/composition' },
      { id: 'responsive', label: 'Responsive styles', to: '/docs/responsive', badge: 'new' },
    ],
  },
  {
    title: 'API',
    items: [
      { id: 'api-box', label: 'Box', to: '/api/box' },
      { id: 'api-create-theme', label: 'createTheme()', to: '/api/createTheme' },
      { id: 'api-styled', label: 'styled', to: '/api/styled' },
      { id: 'api-use-theme', label: 'useTheme()', to: '/api/useTheme' },
    ],
  },
  {
    title: 'Recipes',
    items: [
      { id: 'r-buttons', label: 'Buttons', to: '/recipes/buttons' },
      { id: 'r-forms', label: 'Forms', to: '/recipes/forms' },
      { id: 'r-layouts', label: 'Layouts', to: '/recipes/layouts' },
      { id: 'r-animation', label: 'Animation', to: '/recipes/animation' },
    ],
  },
];

interface SidebarBodyProps {
  onNavigate?: () => void;
}

/**
 * The desktop sidebar (rendered as the left column of `DocsLayout`)
 * and the mobile sheet body share this component. `onNavigate` lets
 * the sheet variant close itself when a link is followed.
 */
function SidebarBody({ onNavigate }: SidebarBodyProps) {
  const location = useLocation();
  return (
    <VStack as="nav" aria-label="Documentation" gap="$6" alignItems="stretch">
      {SECTIONS.map((section) => (
        <VStack key={section.title} gap="$2" alignItems="stretch">
          <Text
            as="span"
            fontFamily="$fonts.sans"
            fontSize="$fontSizes.2xs"
            fontWeight="$fontWeights.semibold"
            color="$colors.text.faint"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            {section.title}
          </Text>
          <VStack gap={2} alignItems="stretch" as="ul" m={0} p={0}>
            {section.items.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Box as="li" key={item.id} m={0} p={0}>
                  <SidebarLink item={item} active={active} onNavigate={onNavigate} />
                </Box>
              );
            })}
          </VStack>
        </VStack>
      ))}
    </VStack>
  );
}

function SidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: SidebarItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Box
      as={RRLink}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ to: item.to, onClick: onNavigate } as any)}
      display="flex"
      alignItems="center"
      gap="$2"
      px="$3"
      py="$2"
      borderRadius="$radii.md"
      fontSize="$fontSizes.sm"
      fontWeight="$fontWeights.medium"
      color={active ? '$colors.accent' : '$colors.text.muted'}
      bg={active ? '$colors.accentSoft' : 'transparent'}
      textDecoration="none"
      borderLeftWidth={2}
      borderLeftStyle="solid"
      borderLeftColor={active ? '$colors.accent' : 'transparent'}
      _hover={{ color: '$colors.text.strong', bg: '$colors.surface.muted' }}
    >
      <Text as="span" flex={1}>
        {item.label}
      </Text>
      {item.badge !== undefined && <Badge kind={item.badge} />}
    </Box>
  );
}

function Badge({ kind }: { kind: 'new' | 'canary' }) {
  return (
    <Text
      as="span"
      px="$2"
      py={1}
      borderRadius="$radii.full"
      fontFamily="$fonts.sans"
      fontSize={10}
      fontWeight="$fontWeights.semibold"
      letterSpacing="0.04em"
      textTransform="uppercase"
      bg={kind === 'new' ? '$colors.action.success.bg' : '$colors.action.warning.bg'}
      color={kind === 'new' ? '$colors.action.success.fg' : '$colors.action.warning.fg'}
    >
      {kind}
    </Text>
  );
}

/**
 * Desktop sidebar — the left column of the docs layout. Rendered above
 * `$bp.md` only; below that, callers render `<SidebarSheet>` instead.
 */
export function Sidebar() {
  return (
    <Box
      as="aside"
      width={260}
      flexShrink={0}
      position="sticky"
      top={64}
      maxHeight="calc(100vh - 64px)"
      overflowY="auto"
      py="$8"
      pr="$6"
      display={{ base: 'none', md: 'block' }}
    >
      <SidebarBody />
    </Box>
  );
}

export interface SidebarSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

/**
 * Mobile sidebar — a left-edge sheet. Closes on link tap so navigation
 * doesn't strand the user behind a scrim.
 */
export function SidebarSheet({ open, onOpenChange }: SidebarSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Box position="fixed" top={0} left={0} bottom={0} width="min(320px, 88vw)" zIndex={60}>
          <Box
            height="100%"
            bg="$colors.surface.base"
            borderRightWidth={1}
            borderRightStyle="solid"
            borderRightColor="$colors.border.default"
            boxShadow="0 24px 48px -12px rgb(0 0 0 / 0.25)"
            display="flex"
            flexDirection="column"
          >
            <HStack
              alignItems="center"
              justifyContent="space-between"
              px="$5"
              py="$3"
              borderBottomWidth={1}
              borderBottomStyle="solid"
              borderBottomColor="$colors.border.muted"
              color="$colors.text.strong"
            >
              <Lockup size="sm" />
              <Dialog.Close>
                <Box
                  as="button"
                  aria-label="Close navigation"
                  width={32}
                  height={32}
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="$radii.md"
                  bg="transparent"
                  color="$colors.text.muted"
                  borderWidth={0}
                  cursor="pointer"
                  _hover={{ bg: '$colors.surface.muted', color: '$colors.text.default' }}
                >
                  <Box display="inline-flex" fontSize={16}>
                    <X aria-hidden="true" />
                  </Box>
                </Box>
              </Dialog.Close>
            </HStack>
            <Box flex={1} overflowY="auto" px="$5" py="$5">
              <SidebarBody onNavigate={() => onOpenChange(false)} />
            </Box>
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
