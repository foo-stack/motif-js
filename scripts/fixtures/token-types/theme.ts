import { createTheme } from 'usemotif';

/**
 * The fixture's theme. Small on purpose: the probe asks whether token paths
 * reach a style prop at all, not how many of them there are.
 */
export const fixtureTheme = createTheme({
  name: 'fixture',
  tokens: {
    space: { 4: 16, 8: 32 },
    colors: { brand: { 500: '#3b82f6' } },
  },
} as const);
