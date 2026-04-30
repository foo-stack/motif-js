'use client';

import { useCallback, useState } from 'react';
import { Box, Pressable } from '@motif-js/react';
import { Check, Copy } from '@motif-js/icons';

const RESET_DELAY_MS = 1500;

export interface CopyButtonProps {
  /** Lazy text-getter — runs at click time so the consumer can read
   * the current DOM (helpful for code blocks where children are
   * highlighted React trees, not raw strings). */
  getText: () => string;
}

/**
 * Compact copy button. Sits in the top-right of a code block; flips
 * to a check icon for ~1.5s after a successful copy.
 */
export function CopyButton({ getText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), RESET_DELAY_MS);
    } catch {
      // Clipboard permission denied or insecure context — silently no-op.
      // The fallback path (manual select-all) is already in the user's
      // hands; failing loudly here just adds noise.
    }
  }, [getText]);

  const label = copied ? 'Copied' : 'Copy code';

  return (
    <Pressable
      as="button"
      aria-label={label}
      title={label}
      onPress={onCopy}
      position="absolute"
      top="$2"
      right="$2"
      width={32}
      height={32}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="$radii.md"
      bg="$colors.surface.muted"
      color="$colors.text.muted"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      cursor="pointer"
      opacity={copied ? 1 : 0.7}
      transition={{ property: 'opacity, color, border-color', duration: '$durations.ui' }}
      _hover={{
        opacity: 1,
        color: '$colors.text.default',
        borderColor: '$colors.border.default',
      }}
      _focus={{ outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 }}
    >
      <Box display="inline-flex" fontSize={14} aria-hidden="true">
        {copied ? <Check /> : <Copy />}
      </Box>
    </Pressable>
  );
}
