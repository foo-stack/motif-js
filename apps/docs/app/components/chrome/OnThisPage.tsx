'use client';

import { useEffect, useState } from 'react';
import { Box, Text, VStack } from '@motif-js/react';

interface TocItem {
  readonly id: string;
  readonly label: string;
  readonly level: 2 | 3;
}

const SCROLL_OFFSET = 120;

/**
 * Right-rail table of contents. Reads h2/h3 elements out of the
 * article body on mount, watches scroll, and highlights the current
 * section. Selectors are constrained to the `<article>` rendered by
 * `DocsLayout` so prose-internal headings don't interfere with each
 * other when multiple articles ever co-exist.
 */
export function OnThisPage({ articleSelector = 'article' }: { articleSelector?: string }) {
  const [items, setItems] = useState<ReadonlyArray<TocItem>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (article === null) return;
    const headings = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'));
    const next: TocItem[] = headings
      .map((el) => {
        if (el.id === '') {
          el.id =
            el.textContent
              ?.trim()
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '') ?? '';
        }
        return {
          id: el.id,
          label: el.textContent?.trim() ?? '',
          level: el.tagName === 'H2' ? 2 : 3,
        } as TocItem;
      })
      .filter((it) => it.id !== '');
    setItems(next);
    setActiveId(next[0]?.id ?? null);
  }, [articleSelector]);

  useEffect(() => {
    if (items.length === 0) return;
    const onScroll = () => {
      let current = items[0]?.id ?? null;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el !== null && el.getBoundingClientRect().top < SCROLL_OFFSET) {
          current = it.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <Box
      as="aside"
      aria-label="On this page"
      width={220}
      flexShrink={0}
      position="sticky"
      top={64}
      maxHeight="calc(100vh - 64px)"
      overflowY="auto"
      py="$8"
      pl="$4"
      display={{ base: 'none', lg: 'block' }}
    >
      <VStack gap="$3" alignItems="stretch">
        <Text
          as="span"
          fontFamily="$fonts.sans"
          fontSize="$fontSizes.2xs"
          fontWeight="$fontWeights.semibold"
          color="$colors.text.faint"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          On this page
        </Text>
        <VStack as="ul" gap={2} alignItems="stretch" m={0} p={0}>
          {items.map((it) => {
            const active = it.id === activeId;
            return (
              <Box as="li" key={it.id} m={0} p={0}>
                <Box
                  as="a"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...({ href: `#${it.id}` } as any)}
                  display="block"
                  pl={it.level === 3 ? 24 : 12}
                  py={1}
                  borderLeftWidth={2}
                  borderLeftStyle="solid"
                  borderLeftColor={active ? '$colors.accent' : 'transparent'}
                  fontSize="$fontSizes.sm"
                  color={active ? '$colors.text.strong' : '$colors.text.muted'}
                  textDecoration="none"
                  _hover={{ color: '$colors.text.strong' }}
                >
                  {it.label}
                </Box>
              </Box>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}
