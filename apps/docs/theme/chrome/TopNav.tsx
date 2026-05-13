import { Box, HStack } from 'usemotif';
import { useEffect, useState } from 'react';
import { Anchor } from './Anchor.js';
import { GitHub, Monogram } from './icons.js';
import { SearchTrigger } from './SearchTrigger.js';
import { ThemeToggle } from './ThemeToggle.js';
import { VersionPill } from './VersionPill.js';

const MONOGRAM_STYLE = {
  width: 22,
  height: 22,
  color: 'var(--colors-accent-base)',
  flex: '0 0 auto',
};
const GITHUB_ICON_STYLE = { width: 16, height: 16 };

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={40}
      bg="color-mix(in oklab, var(--colors-surface-paper) 88%, transparent)"
      borderStyle="solid"
      borderTopWidth={0}
      borderRightWidth={0}
      borderLeftWidth={0}
      borderBottomWidth={1}
      borderBottomColor={scrolled ? '$colors.line.faint' : 'transparent'}
      transition="border-color 160ms var(--easings-base)"
      style={{
        backdropFilter: 'saturate(140%) blur(10px)',
        WebkitBackdropFilter: 'saturate(140%) blur(10px)',
        // chrome.css uses `font:` shorthand on every chrome class,
        // which resets `font-feature-settings` to its default.
        // Motif's root `font-feature-settings: 'ss01', 'cv11'`
        // cascades from <body>; reset it at the chrome boundary so
        // chrome text matches the unmigrated chrome.css output.
        fontFeatureSettings: 'normal',
      }}
    >
      <Box
        maxW={1440}
        mx="auto"
        display="grid"
        alignItems="center"
        gap="$6"
        py="14px"
        px="$8"
        style={{ gridTemplateColumns: 'auto 1fr auto' }}
      >
        {/* Lockup + version pill */}
        <HStack alignItems="center" gap="$1" position="relative">
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
          <VersionPill />
        </HStack>

        {/* Center search — hidden on small mobile, shown at md+. */}
        <Box display={{ base: 'none', md: 'flex' }} justifyContent="center">
          <SearchTrigger />
        </Box>

        {/* Right side */}
        <HStack alignItems="center" gap="6px">
          <NavLink href="/getting-started/introduction">Docs</NavLink>
          <NavLink href="/guides/design-system">Guides</NavLink>
          <NavLink href="/reference/styled">API</NavLink>
          <NavLink href="/recipes/buttons">Recipes</NavLink>
          <Box w="$2" />
          <ThemeToggle />
          <Anchor
            href="https://github.com/foo-stack/motif-js"
            title="GitHub"
            aria-label="GitHub repository"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={32}
            h={32}
            color="$colors.fg.muted"
            borderStyle="solid"
            borderWidth={1}
            borderColor="transparent"
            borderRadius="5px"
            cursor="pointer"
            transition="all 160ms var(--easings-base)"
            style={{ textDecoration: 'none' }}
            _hover={{ color: '$colors.fg.strong', bg: '$colors.surface.paper2' }}
          >
            <GitHub style={GITHUB_ICON_STYLE} />
          </Anchor>
        </HStack>
      </Box>
    </Box>
  );
}

/**
 * One top-nav text link. Hidden on small mobile, shown at md+.
 */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Anchor
      display={{ base: 'none', md: 'inline-flex' }}
      href={href}
      alignItems="center"
      gap="6px"
      fontFamily="$fontFamilies.sans"
      fontWeight={500}
      fontSize="13.5px"
      lineHeight={1}
      color="$colors.fg.muted"
      px="10px"
      py="8px"
      borderRadius="5px"
      transition="all 160ms var(--easings-base)"
      style={{ textDecoration: 'none' }}
      _hover={{ color: '$colors.fg.strong', bg: '$colors.surface.paper2' }}
    >
      {children}
    </Anchor>
  );
}
