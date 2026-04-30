import type { ReactNode } from 'react';
import { Box, HStack } from '@motif-js/react';
import { Sidebar } from './Sidebar';
import { OnThisPage } from './OnThisPage';
import { bodyFontToToken, contentWidthToMaxWidth, useTweaksContext } from '../../state/tweaks';

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
 *
 * Reads `contentWidth` and `bodyFont` from `TweaksContext` (the
 * context provider sits up at `ChromeShell` in `root.tsx`).
 */
export function DocsLayout({ children }: DocsLayoutProps) {
  const tweaks = useTweaksContext();
  const maxArticle = contentWidthToMaxWidth(tweaks.contentWidth);
  const fontFamily = bodyFontToToken(tweaks.bodyFont);

  return (
    <Box maxWidth="$sizes.containerWide" mx="auto" px={{ base: '$5', md: '$8' }}>
      <HStack alignItems="flex-start" gap={{ base: 0, md: '$8' }}>
        <Sidebar />
        <Box
          as="article"
          // Pagefind: index this region as the page body. The chrome
          // (TopNav, Sidebar, OnThisPage, Footer) lives outside this
          // <article> and therefore stays out of the search index.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ 'data-pagefind-body': '' } as any)}
          flex={1}
          minWidth={0}
          maxWidth={{ base: '100%', lg: maxArticle }}
          mx={{ base: 0, lg: 'auto' }}
          py={{ base: '$10', md: '$16' }}
          color="$colors.text.default"
          fontFamily={fontFamily}
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
