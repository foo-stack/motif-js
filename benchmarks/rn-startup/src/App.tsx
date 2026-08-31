/**
 * React Native startup-bench fixture.
 *
 * This file is the entrypoint a real RN app would mount. It
 * deliberately exercises the motif primitives a typical app loads
 * at startup (theme, a screen layout, a button) so the measured
 * Hermes / JS-engine startup time reflects realistic motif usage.
 *
 * To measure in practice, drop this file into a fresh Expo / bare
 * RN app and follow the README instructions. The point of the
 * bench is the **delta** between motif vs. plain RN - keep both
 * variants running through the same React tree shape.
 */

import { Box, Button, Stack, Text, ThemeProvider } from '@usemotif/react-native';
import { type ReactElement } from 'react';

const theme = {
  name: 'startup-bench',
  tokens: {
    colors: {
      action: { primary: { bg: '#3b82f6', fg: '#ffffff', hover: '#2563eb' } },
      surface: { base: '#ffffff' },
      text: { default: '#111827' },
      gray: { 200: '#e5e7eb', 900: '#111827' },
    },
    space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24 },
    fontSizes: { sm: 14, md: 16, lg: 18, xl: 20 },
    radii: { md: 8 },
    fontWeights: { semibold: 600, bold: 700 },
    sizes: { full: '100%' },
  },
};

export function App(): ReactElement {
  return (
    <ThemeProvider themes={[theme]} active="startup-bench">
      <Box flex={1} bg="$colors.surface.base" p="$4">
        <Stack gap="$3">
          <Text fontSize="$xl" fontWeight="$bold">
            motif-js startup bench
          </Text>
          <Text color="$colors.text.default">
            A minimal screen exercising Box / Stack / Text / Button + theme so startup-time
            measurements reflect realistic usage.
          </Text>
          <Button onPress={() => {}}>Tap me</Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
