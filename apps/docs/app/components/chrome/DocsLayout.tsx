import type { ReactNode } from 'react';
import { Box, HStack } from '@motif-js/react';
import { Sidebar } from './Sidebar';
import { OnThisPage } from './OnThisPage';

export interface DocsLayoutProps {
  /** The article body. Becomes the prose column on desktop. */
  children: ReactNode;
}

/**
 * Three-column shell for `/docs/*` and `/api/*` pages.
 *
 *   ≥ $bp.lg : sidebar | article | OnThisPage
 *   ≥ $bp.md : sidebar | article
 *   < $bp.md : article only (sidebar lives in the mobile sheet)
 */
export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <Box maxWidth="$sizes.containerWide" mx="auto" px={{ base: '$5', md: '$8' }}>
      <HStack alignItems="flex-start" gap={{ base: 0, md: '$8' }}>
        <Sidebar />
        <Box
          as="article"
          flex={1}
          minWidth={0}
          maxWidth={{ base: '100%', lg: 760 }}
          mx={{ base: 0, lg: 'auto' }}
          py={{ base: '$10', md: '$16' }}
          color="$colors.text.default"
          fontFamily="$fonts.sans"
          fontSize="$fontSizes.md"
          lineHeight="$lineHeights.prose"
        >
          {children}
        </Box>
        <OnThisPage />
      </HStack>
    </Box>
  );
}
