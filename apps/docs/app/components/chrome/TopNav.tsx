'use client';

import { useEffect, useState } from 'react';
import { Box, HStack, Kbd, Pressable, Text } from '@motif-js/react';
import { Github, Menu, Search } from '@motif-js/icons';
import { Link as RRLink, useLocation } from 'react-router';
import { Lockup } from './Lockup';
import { ThemeToggle } from './ThemeToggle';
import type { ThemeMode } from '../../state/theme';

const VERSION = '1.1.2';

const NAV_LINKS: ReadonlyArray<{ label: string; to: string; matchPrefix?: string }> = [
  { label: 'Docs', to: '/docs/introduction', matchPrefix: '/docs' },
  { label: 'API', to: '/api/box', matchPrefix: '/api' },
  { label: 'Examples', to: '/examples', matchPrefix: '/examples' },
  { label: 'Blog', to: '/blog', matchPrefix: '/blog' },
];

export interface TopNavProps {
  mode: ThemeMode;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenSidebar: () => void;
}

/**
 * Sticky top nav. Hairline appears once the page has scrolled — keeps
 * the resting state airy, then anchors the bar against article content.
 *
 * On `< $bp.md` the center search collapses to an icon button and the
 * nav links are replaced by a hamburger that opens the sidebar sheet.
 */
export function TopNav({ mode, onToggleTheme, onOpenSearch, onOpenSidebar }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      bg="$colors.surface.base"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor={scrolled ? '$colors.border.muted' : 'transparent'}
      transition={{ property: 'border-color', duration: '$durations.ui' }}
    >
      <HStack
        alignItems="center"
        gap="$4"
        px={{ base: '$4', md: '$6' }}
        py="$3"
        maxWidth="$sizes.containerWide"
        mx="auto"
      >
        <Box
          as={RRLink}
          // RR Link reaches a DOM <a> via the `to` prop; its props
          // aren't part of Box's typed surface, hence the cast.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ to: '/', 'aria-label': 'Motif home' } as any)}
          textDecoration="none"
          color="$colors.text.strong"
          display="inline-flex"
          alignItems="center"
        >
          <HStack alignItems="center" gap="$3">
            <Lockup size="md" />
            <Box display={{ base: 'none', sm: 'inline-flex' }}>
              <VersionPill version={VERSION} />
            </Box>
          </HStack>
        </Box>

        <Box flex={1} display={{ base: 'none', md: 'block' }} maxWidth={420} mx="auto">
          <SearchTriggerWide onClick={onOpenSearch} />
        </Box>

        <HStack alignItems="center" gap="$2">
          <Box display={{ base: 'none', md: 'inline-flex' }}>
            <HStack gap="$1">
              {NAV_LINKS.map((link) => {
                const active =
                  link.matchPrefix !== undefined && location.pathname.startsWith(link.matchPrefix);
                return <NavLink key={link.to} to={link.to} active={active} label={link.label} />;
              })}
            </HStack>
          </Box>

          <Box display={{ base: 'inline-flex', md: 'none' }}>
            <SearchTriggerCompact onClick={onOpenSearch} />
          </Box>

          <ThemeToggle mode={mode} onToggle={onToggleTheme} />

          <Box display={{ base: 'none', sm: 'inline-flex' }}>
            <IconAffordanceLink
              href="https://github.com/foo-stack/motif-js"
              ariaLabel="Motif on GitHub"
            >
              <Github aria-hidden="true" />
            </IconAffordanceLink>
          </Box>

          <Box display={{ base: 'inline-flex', md: 'none' }}>
            <IconAffordanceButton ariaLabel="Open navigation" onPress={onOpenSidebar}>
              <Menu aria-hidden="true" />
            </IconAffordanceButton>
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
}

function VersionPill({ version }: { version: string }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="$2"
      py={2}
      borderRadius="$radii.full"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      bg="$colors.surface.muted"
      fontFamily="$fonts.mono"
      fontSize="$fontSizes.2xs"
      color="$colors.text.muted"
      letterSpacing="0.02em"
    >
      v{version}
    </Box>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Box
      as={RRLink}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ to } as any)}
      px="$3"
      py="$2"
      borderRadius="$radii.md"
      fontSize="$fontSizes.sm"
      fontWeight="$fontWeights.medium"
      color={active ? '$colors.text.strong' : '$colors.text.muted'}
      bg={active ? '$colors.surface.muted' : 'transparent'}
      textDecoration="none"
      _hover={{ color: '$colors.text.strong', bg: '$colors.surface.muted' }}
    >
      {label}
    </Box>
  );
}

function SearchTriggerWide({ onClick }: { onClick: () => void }) {
  return (
    <Pressable
      as="button"
      aria-label="Open search"
      onPress={onClick}
      width="100%"
      display="inline-flex"
      alignItems="center"
      gap="$2"
      px="$3"
      py="$2"
      borderRadius="$radii.md"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      bg="$colors.surface.muted"
      color="$colors.text.muted"
      fontFamily="$fonts.sans"
      fontSize="$fontSizes.sm"
      cursor="pointer"
      transition={{ property: 'border-color, color', duration: '$durations.ui' }}
      _hover={{ borderColor: '$colors.border.default', color: '$colors.text.default' }}
      _focus={{ outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 }}
    >
      <Box display="inline-flex" fontSize={14} aria-hidden="true">
        <Search />
      </Box>
      <Text as="span" flex={1} textAlign="left">
        Search the docs
      </Text>
      <HStack gap={2}>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </HStack>
    </Pressable>
  );
}

function SearchTriggerCompact({ onClick }: { onClick: () => void }) {
  return (
    <IconAffordanceButton ariaLabel="Open search" onPress={onClick}>
      <Search aria-hidden="true" />
    </IconAffordanceButton>
  );
}

const iconAffordanceStyle = {
  width: 36,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$radii.md',
  bg: 'transparent',
  color: '$colors.text.muted',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$colors.border.muted',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: { property: 'background-color, color, border-color', duration: '$durations.ui' },
  _hover: {
    bg: '$colors.surface.muted',
    color: '$colors.text.default',
    borderColor: '$colors.border.default',
  },
  _focus: { outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 },
} as const;

function IconAffordanceButton({
  ariaLabel,
  onPress,
  children,
}: {
  ariaLabel: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable as="button" aria-label={ariaLabel} onPress={onPress} {...iconAffordanceStyle}>
      <Box display="inline-flex" fontSize={16}>
        {children}
      </Box>
    </Pressable>
  );
}

function IconAffordanceLink({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      as="a"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ href, target: '_blank', rel: 'noreferrer', 'aria-label': ariaLabel } as any)}
      {...iconAffordanceStyle}
    >
      <Box display="inline-flex" fontSize={16}>
        {children}
      </Box>
    </Pressable>
  );
}
