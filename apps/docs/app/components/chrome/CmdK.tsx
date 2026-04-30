'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, HStack, Kbd, Text, VStack } from '@motif-js/react';
import { Dialog } from '@motif-js/headless';
import { ArrowRight, Search } from '@motif-js/icons';
import { useNavigate } from 'react-router';
import { usePagefind, type PagefindResult } from '../../state/pagefind';

export interface CmdKProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

const RESULT_LIMIT = 8;

/**
 * Bag of HTML-specific attrs that Box's typed surface does not
 * carry through. Lifted to a helper so the eslint-disable lives
 * exactly where the cast happens.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function inputAttrs(ref: React.RefObject<HTMLInputElement | null>): any {
  return {
    type: 'text',
    autoFocus: true,
    ref,
    'aria-label': 'Search the docs',
    'aria-autocomplete': 'list',
  };
}

/**
 * The ⌘K modal — search powered by Pagefind. The static index lives
 * at `/pagefind/pagefind.js` after `pagefind --site build/client`
 * runs (wired into the `build` script). In dev (no index yet) the
 * hook resolves to `ready=false` and the modal explains that search
 * is unavailable until the next build.
 */
export function CmdK({ open, onOpenChange }: CmdKProps) {
  const { ready, hits, query, setQuery } = usePagefind();
  const [highlighted, setHighlighted] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reset on close + focus on open.
  useEffect(() => {
    if (!open) {
      setQuery('');
      setHighlighted(0);
    }
  }, [open, setQuery]);

  // Reset highlight whenever the result list changes.
  useEffect(() => {
    setHighlighted(0);
  }, [hits]);

  const onSelect = useCallback(
    (hit: PagefindResult) => {
      onOpenChange(false);
      // Pagefind's `url` is the deployed-root-relative path. Strip
      // any trailing `index.html` so the SPA router can match it.
      const path = hit.url.replace(/\/index\.html$/, '').replace(/\.html$/, '');
      navigate(path === '' ? '/' : path);
    },
    [navigate, onOpenChange],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const max = Math.min(hits.length, RESULT_LIMIT) - 1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted((i) => Math.min(max, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter' && hits[highlighted] !== undefined) {
        e.preventDefault();
        onSelect(hits[highlighted]);
      }
    },
    [hits, highlighted, onSelect],
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          pt={{ base: '$10', md: '$24' }}
          px="$4"
        >
          <Box
            width="100%"
            maxWidth={640}
            bg="$colors.surface.raised"
            color="$colors.text.default"
            borderRadius="$radii.lg"
            borderWidth={1}
            borderStyle="solid"
            borderColor="$colors.border.default"
            boxShadow="0 24px 48px -12px rgb(0 0 0 / 0.25), 0 8px 16px -8px rgb(0 0 0 / 0.15)"
            overflow="hidden"
          >
            <HStack
              alignItems="center"
              gap="$3"
              px="$5"
              py="$4"
              borderBottomWidth={1}
              borderBottomStyle="solid"
              borderBottomColor="$colors.border.muted"
            >
              <Box display="inline-flex" color="$colors.text.muted" fontSize={16}>
                <Search aria-hidden="true" />
              </Box>
              <Box
                as="input"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search the docs"
                flex={1}
                bg="transparent"
                color="$colors.text.default"
                fontFamily="$fonts.sans"
                fontSize="$fontSizes.base"
                borderWidth={0}
                outline="none"
                {...inputAttrs(inputRef)}
              />
              <Box
                display="inline-flex"
                fontSize="$fontSizes.xs"
                color="$colors.text.faint"
                alignItems="center"
                gap="$1"
              >
                <Kbd>esc</Kbd>
              </Box>
            </HStack>

            <ResultBody
              ready={ready}
              query={query}
              hits={hits}
              highlighted={highlighted}
              onHover={setHighlighted}
              onSelect={onSelect}
            />

            {hits.length > 0 && <CmdKHints />}
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function ResultBody({
  ready,
  query,
  hits,
  highlighted,
  onHover,
  onSelect,
}: {
  ready: boolean;
  query: string;
  hits: ReadonlyArray<PagefindResult>;
  highlighted: number;
  onHover: (i: number) => void;
  onSelect: (hit: PagefindResult) => void;
}) {
  if (!ready) {
    return (
      <Box px="$5" py="$8">
        <Text as="p" color="$colors.text.muted" fontSize="$fontSizes.sm" textAlign="center">
          Search is built into the static output by Pagefind. Run{' '}
          <Text
            as="code"
            fontFamily="$fonts.mono"
            fontSize="$fontSizes.sm"
            color="$colors.text.default"
          >
            yarn build
          </Text>{' '}
          and view the production site to try it.
        </Text>
      </Box>
    );
  }

  if (query.trim().length === 0) {
    return (
      <Box px="$5" py="$8">
        <Text as="p" color="$colors.text.muted" fontSize="$fontSizes.sm" textAlign="center">
          Type to search across every Tier-1 page.
        </Text>
      </Box>
    );
  }

  if (hits.length === 0) {
    return (
      <Box px="$5" py="$8">
        <Text as="p" color="$colors.text.muted" fontSize="$fontSizes.sm" textAlign="center">
          No results for{' '}
          <Text as="span" fontWeight="$fontWeights.semibold" color="$colors.text.default">
            {query}
          </Text>
          .
        </Text>
      </Box>
    );
  }

  const visible = hits.slice(0, RESULT_LIMIT);
  return (
    <VStack as="ul" gap={0} alignItems="stretch" m={0} p="$2" maxHeight={420} overflowY="auto">
      {visible.map((hit, i) => (
        <Box as="li" key={hit.id} m={0} p={0}>
          <ResultRow
            hit={hit}
            active={i === highlighted}
            onHover={() => onHover(i)}
            onSelect={() => onSelect(hit)}
          />
        </Box>
      ))}
    </VStack>
  );
}

function ResultRow({
  hit,
  active,
  onHover,
  onSelect,
}: {
  hit: PagefindResult;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <Box
      as="button"
      onMouseEnter={onHover}
      onMouseDown={(e: React.MouseEvent) => {
        e.preventDefault();
        onSelect();
      }}
      width="100%"
      display="block"
      textAlign="left"
      px="$3"
      py="$2"
      borderRadius="$radii.md"
      borderWidth={0}
      bg={active ? '$colors.surface.muted' : 'transparent'}
      cursor="pointer"
    >
      <HStack alignItems="center" justifyContent="space-between" gap="$3">
        <VStack gap={2} alignItems="flex-start" flex={1} minWidth={0}>
          <Text
            as="span"
            fontFamily="$fonts.sans"
            fontSize="$fontSizes.sm"
            fontWeight="$fontWeights.semibold"
            color="$colors.text.strong"
          >
            {hit.meta.title ?? hit.url}
          </Text>
          <Text
            as="span"
            fontSize="$fontSizes.xs"
            color="$colors.text.muted"
            // Pagefind returns excerpt with <mark>highlighted matches</mark>;
            // render via dangerouslySetInnerHTML so the marks survive.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ dangerouslySetInnerHTML: { __html: hit.excerpt } } as any)}
          />
        </VStack>
        <Box display="inline-flex" color="$colors.text.faint" fontSize={14} aria-hidden="true">
          <ArrowRight />
        </Box>
      </HStack>
    </Box>
  );
}

function CmdKHints() {
  return (
    <HStack
      alignItems="center"
      justifyContent="flex-end"
      gap="$3"
      px="$5"
      py="$2"
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="$colors.border.muted"
      fontSize="$fontSizes.xs"
      color="$colors.text.faint"
    >
      <HStack gap="$1" alignItems="center">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Text as="span">to move</Text>
      </HStack>
      <HStack gap="$1" alignItems="center">
        <Kbd>↵</Kbd>
        <Text as="span">to open</Text>
      </HStack>
      <HStack gap="$1" alignItems="center">
        <Kbd>esc</Kbd>
        <Text as="span">to close</Text>
      </HStack>
    </HStack>
  );
}
