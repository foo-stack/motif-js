'use client';

import { Box, Pressable } from '@motif-js/react';
import { Moon, Sun } from '@motif-js/icons';
import type { ThemeMode } from '../../state/theme';

export interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

/**
 * Sun ↔ moon button. Sized to match the other circular icon affordances
 * in the top nav. Uses Pressable so we can drive the brand's hairline
 * outline + paper-muted hover rather than IconButton's gray-token
 * defaults (which our theme intentionally does not register).
 */
export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const next: ThemeMode = mode === 'paper' ? 'ink' : 'paper';
  const label = `Switch to ${next === 'ink' ? 'dark' : 'light'} theme`;

  return (
    <Pressable
      as="button"
      aria-label={label}
      title={label}
      onPress={onToggle}
      width={36}
      height={36}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="$radii.md"
      bg="transparent"
      color="$colors.text.muted"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      cursor="pointer"
      transition={{ property: 'background-color, color, border-color', duration: '$durations.ui' }}
      _hover={{
        bg: '$colors.surface.muted',
        color: '$colors.text.default',
        borderColor: '$colors.border.default',
      }}
      _focus={{ outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 }}
    >
      <Box display="inline-flex" fontSize={16} aria-hidden="true">
        {mode === 'ink' ? <Sun /> : <Moon />}
      </Box>
    </Pressable>
  );
}
