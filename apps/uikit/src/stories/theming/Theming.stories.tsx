import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, Theme, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * How theming composes: every theme ships as a `[data-theme]` CSS-variable
 * block, switched by attribute (no React re-render). `<Theme name>` opens a
 * nested island that re-maps the same semantic tokens for its subtree.
 */
const meta = {
  title: 'Theming/Overview',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A small card built purely from semantic tokens, so it tracks its theme. */
function ThemeCard({ label }: { label: string }) {
  return (
    <VStack
      gap="$3"
      p="$5"
      bg="$colors.surface.base"
      borderRadius="$lg"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      style={{ width: 260 }}
    >
      <Text fontWeight="$bold" mt={0} mb={0}>
        {label}
      </Text>
      <Text color="$colors.text.muted" fontSize="$sm" mt={0} mb={0}>
        surface.base / text tokens
      </Text>
      <Box bg="$colors.surface.raised" p="$3" borderRadius="$md">
        <Text fontSize="$sm" mt={0} mb={0}>
          surface.raised
        </Text>
      </Box>
      <HStack gap="$2">
        <Box
          bg="$colors.action.primary.bg"
          color="$colors.action.primary.fg"
          px="$3"
          py="$2"
          borderRadius="$md"
        >
          <Text fontSize="$sm" fontWeight="$semibold" mt={0} mb={0}>
            primary
          </Text>
        </Box>
        <Box
          bg="$colors.action.danger.bg"
          color="$colors.action.danger.fg"
          px="$3"
          py="$2"
          borderRadius="$md"
        >
          <Text fontSize="$sm" fontWeight="$semibold" mt={0} mb={0}>
            danger
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
}

/** Light and dark rendered together via `<Theme name>` islands, regardless of
 *  the global toolbar selection. */
export const SideBySide: Story = {
  render: () => (
    <VStack gap="$3">
      <Note>
        Two `&lt;Theme name&gt;` islands - same markup, different token maps. Independent of the
        toolbar.
      </Note>
      <HStack gap="$4" alignItems="flex-start">
        <Theme name="light">
          <ThemeCard label="Light" />
        </Theme>
        <Theme name="dark">
          <ThemeCard label="Dark" />
        </Theme>
      </HStack>
    </VStack>
  ),
};

/** A nested island: a dark region inside the (toolbar-controlled) outer theme. */
export const SubThemeIsland: Story = {
  render: () => (
    <VStack gap="$3" p="$5" bg="$colors.surface.muted" borderRadius="$lg">
      <Text color="$colors.text.default" mt={0} mb={0}>
        Outer region - uses the active (toolbar) theme.
      </Text>
      <Theme name="dark">
        <VStack
          gap="$2"
          p="$4"
          bg="$colors.surface.raised"
          borderRadius="$md"
          borderWidth={1}
          borderStyle="solid"
          borderColor="$colors.border.default"
        >
          <Text fontWeight="$semibold" mt={0} mb={0}>
            Always-dark island
          </Text>
          <Text color="$colors.text.muted" fontSize="$sm" mt={0} mb={0}>
            Wrapped in &lt;Theme name="dark"&gt;. Switching is a data-theme attribute swap -
            children do not re-render.
          </Text>
        </VStack>
      </Theme>
    </VStack>
  ),
};

const CREATE_THEME_SNIPPET = `import { createTheme } from 'usemotif';

export const brand = createTheme({
  name: 'brand',
  tokens: {
    colors: {
      // palette primitives ...
      brand: { 500: '#5b5bd6' },
      // semantic layer references them via $-paths
      surface: { base: '$colors.white', raised: '$colors.gray.50' },
      text: { default: '$colors.gray.900', muted: '$colors.gray.500' },
      action: { primary: { bg: '$colors.brand.500', fg: '$colors.white' } },
    },
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16 /* ... */ },
    radii: { sm: 4, md: 8, lg: 12, full: 9999 },
    fontSizes: { sm: 14, md: 16, lg: 18 /* ... */ },
  },
  // optional: fonts (@font-face), root (body resets), reducedMotion
});

// then: <ThemeProvider themes={[brand, brandDark]} active="brand">`;

export const CreateThemeWalkthrough: Story = {
  name: 'createTheme walkthrough',
  parameters: { docs: { source: { code: CREATE_THEME_SNIPPET } } },
  render: () => (
    <VStack gap="$3">
      <Note>
        Themes are plain objects from `createTheme({'{'} name, tokens, fonts?, root?, reducedMotion?{' '}
        {'}'})`. Semantic tokens reference palette primitives by `$`-path; the cascade resolves them
        per theme.
      </Note>
      <Box
        bg="$colors.surface.sunken"
        color="$colors.text.default"
        p="$4"
        borderRadius="$md"
        fontFamily="$mono"
        fontSize="$xs"
        style={{ overflow: 'auto', whiteSpace: 'pre' }}
      >
        {CREATE_THEME_SNIPPET}
      </Box>
    </VStack>
  ),
};
