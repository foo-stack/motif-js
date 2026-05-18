import type { Theme, TokenMap } from '@usemotif/core';
import {
  borderWidths,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  zIndices,
} from './primitives.js';

/**
 * The shared primitive layer. Both light and dark themes reference these by
 * `$colors.blue.500`-style paths. Primitives never change with the theme;
 * only the semantic layer rebinds.
 */
const primitiveTokens: TokenMap = {
  colors,
  space,
  sizes,
  radii,
  fontSizes,
  fontWeights,
  fontFamilies,
  lineHeights,
  letterSpacings,
  borderWidths,
  shadows,
  zIndices,
  opacities,
};

/**
 * Build a theme by merging the shared primitives with a semantic-layer
 * override (which uses `$`-refs into the primitive tree).
 */
function buildTheme(name: string, semantic: TokenMap): Theme {
  return {
    name,
    tokens: {
      // Primitive scales — shared.
      ...primitiveTokens,
      // Semantic scales — light/dark override these.
      colors: {
        ...colors,
        ...semantic.colors,
      },
    },
  };
}

export const lightTheme: Theme = buildTheme('light', {
  colors: {
    surface: {
      base: '$colors.white',
      muted: '$colors.gray.50',
      raised: '$colors.white',
      sunken: '$colors.gray.100',
      inverse: '$colors.gray.900',
    },
    text: {
      default: '$colors.gray.900',
      muted: '$colors.gray.600',
      subtle: '$colors.gray.500',
      inverse: '$colors.gray.50',
    },
    border: {
      default: '$colors.gray.200',
      muted: '$colors.gray.100',
      strong: '$colors.gray.300',
    },
    action: {
      primary: { bg: '$colors.blue.600', fg: '$colors.white', hover: '$colors.blue.700' },
      danger: { bg: '$colors.red.600', fg: '$colors.white', hover: '$colors.red.700' },
      success: { bg: '$colors.green.600', fg: '$colors.white', hover: '$colors.green.700' },
    },
  },
});

export const darkTheme: Theme = buildTheme('dark', {
  colors: {
    surface: {
      base: '$colors.gray.950',
      muted: '$colors.gray.900',
      raised: '$colors.gray.900',
      sunken: '$colors.black',
      inverse: '$colors.gray.50',
    },
    text: {
      default: '$colors.gray.50',
      muted: '$colors.gray.400',
      subtle: '$colors.gray.500',
      inverse: '$colors.gray.900',
    },
    border: {
      default: '$colors.gray.800',
      muted: '$colors.gray.900',
      strong: '$colors.gray.700',
    },
    action: {
      primary: { bg: '$colors.blue.500', fg: '$colors.white', hover: '$colors.blue.400' },
      danger: { bg: '$colors.red.500', fg: '$colors.white', hover: '$colors.red.400' },
      success: { bg: '$colors.green.500', fg: '$colors.white', hover: '$colors.green.400' },
    },
  },
});
