import { Box } from 'usemotif';
import { useCallback } from 'react';
import { Btn } from './Anchor.js';
import { Search } from './icons.js';

const SEARCH_OPEN_EVENT = 'vorge:search:open';

const SEARCH_ICON_STYLE = { width: 14, height: 14, flex: '0 0 auto' };

export function SearchTrigger() {
  const onOpen = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
    }
  }, []);

  return (
    <Btn
      type="button"
      onClick={onOpen}
      aria-label="Search the docs"
      display="inline-flex"
      alignItems="center"
      gap="$2"
      w={320}
      maxW="100%"
      py="8px"
      px="10px"
      bg="$colors.surface.paper2"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius="6px"
      color="$colors.fg.faint"
      cursor="pointer"
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="13.5px"
      lineHeight={1}
      textAlign="left"
      transition="all 160ms var(--easings-base)"
      style={{ fontFeatureSettings: 'normal' }}
      _hover={{ borderColor: '$colors.line.strong', color: '$colors.fg.muted' }}
    >
      <Search style={SEARCH_ICON_STYLE} />
      <Box as="span" flex="1">
        Search the docs
      </Box>
      <Box as="span" display="inline-flex" gap="2px">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Box>
    </Btn>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="10.5px"
      lineHeight={1}
      py="3px"
      px="5px"
      pb="4px"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius="3px"
      color="$colors.fg.faint"
      bg="$colors.surface.paper"
    >
      {children}
    </Box>
  );
}
