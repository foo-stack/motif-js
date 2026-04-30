'use client';

import { Box, HStack, Kbd, Text } from '@motif-js/react';
import { CommandPalette } from '@motif-js/headless';
import { Search } from '@motif-js/icons';
import { Dialog } from '@motif-js/headless';

export interface CmdKProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

/**
 * The ⌘K modal — empty for Phase 1. The search index (Pagefind) and
 * real commands ship in Phase 4. The shortcut listener lives in the
 * top-level Layout so this component is purely presentation +
 * controlled state.
 *
 * Built on `@motif-js/headless`'s CommandPalette which already wraps
 * Dialog. The visual surface is composed from Motif primitives so
 * styling stays in this app.
 */
export function CmdK({ open, onOpenChange }: CmdKProps) {
  return (
    <CommandPalette.Root commands={[]} open={open} onOpenChange={onOpenChange}>
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
              <CommandPalette.Input placeholder="Search the docs">
                <Box
                  as="input"
                  flex={1}
                  bg="transparent"
                  color="$colors.text.default"
                  fontFamily="$fonts.sans"
                  fontSize="$fontSizes.base"
                  borderWidth={0}
                  outline="none"
                  // HTML-attr passthrough — Box's typed surface stops at common
                  // HTMLAttributes; `type` and `autoFocus` reach the DOM input
                  // unchanged via this spread.
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...({ type: 'text', autoFocus: true } as any)}
                />
              </CommandPalette.Input>
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
            <Box px="$5" py="$8">
              <CommandPalette.List
                renderItem={() => null}
                emptyMessage={
                  <Text
                    as="p"
                    color="$colors.text.muted"
                    fontSize="$fontSizes.sm"
                    textAlign="center"
                  >
                    Search lands in a future release. Pagefind will index every Tier-1 page.
                  </Text>
                }
              />
            </Box>
          </Box>
        </Box>
      </Dialog.Content>
    </CommandPalette.Root>
  );
}
