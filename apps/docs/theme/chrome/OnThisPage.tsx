import { Box, VStack } from 'motif-js';
import { useTOC } from '@vorge/core/runtime';
import { Anchor } from './Anchor.js';
import { Edit } from './icons.js';

export interface OnThisPageProps {
  editPath?: string;
}

const NAV_STYLE = { fontFeatureSettings: 'normal' };
const EDIT_ICON_STYLE = { width: 11, height: 11, opacity: 0.7 };

export function OnThisPage({ editPath }: OnThisPageProps) {
  const headings = useTOC();
  if (headings.length === 0) return null;

  return (
    <Box
      as="nav"
      display={{ base: 'none', lg: 'block' }}
      aria-label="On this page"
      position="sticky"
      top={72}
      alignSelf="start"
      pl={16}
      borderStyle="solid"
      borderTopWidth={0}
      borderRightWidth={0}
      borderBottomWidth={0}
      borderLeftWidth={1}
      borderLeftColor="$colors.line.faint"
      maxH="calc(100vh - 96px)"
      overflowY="auto"
      style={NAV_STYLE}
    >
      <Box
        as="p"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.12em"
        color="$colors.fg.faint"
        m={0}
        mb="4px"
      >
        On this page
      </Box>
      <VStack as="ul" gap={0} mt={10} mb={0} mx={0} p={0} style={{ listStyle: 'none' }}>
        {headings.map((h) => (
          <Box as="li" key={h.slug} data-depth={h.depth}>
            <Anchor
              href={`#${h.slug}`}
              display="block"
              py="2px"
              pl={h.depth >= 3 ? 24 : 12}
              ml={-16}
              fontFamily="$fontFamilies.sans"
              fontWeight={400}
              fontSize={h.depth >= 3 ? '12.5px' : '13px'}
              lineHeight="1.4"
              color="$colors.fg.muted"
              borderStyle="solid"
              borderTopWidth={0}
              borderRightWidth={0}
              borderBottomWidth={0}
              borderLeftWidth={2}
              borderLeftColor="transparent"
              transition="all 120ms var(--easings-base)"
              style={{ textDecoration: 'none' }}
              _hover={{ color: '$colors.fg.strong' }}
            >
              {h.text}
            </Anchor>
          </Box>
        ))}
      </VStack>
      {editPath ? (
        <Box
          mt={24}
          pt={16}
          borderStyle="solid"
          borderTopWidth={1}
          borderRightWidth={0}
          borderBottomWidth={0}
          borderLeftWidth={0}
          borderTopColor="$colors.line.faint"
          display="flex"
          flexDirection="column"
          gap="6px"
        >
          <Anchor
            href={editPath}
            target="_blank"
            rel="noreferrer"
            fontFamily="$fontFamilies.sans"
            fontWeight={400}
            fontSize="12.5px"
            lineHeight="1.4"
            color="$colors.fg.faint"
            display="inline-flex"
            alignItems="center"
            gap="6px"
            transition="color 120ms var(--easings-base)"
            style={{ textDecoration: 'none' }}
            _hover={{ color: '$colors.accent.base' }}
          >
            <Edit style={EDIT_ICON_STYLE} />
            Edit this page on GitHub
          </Anchor>
        </Box>
      ) : null}
    </Box>
  );
}
