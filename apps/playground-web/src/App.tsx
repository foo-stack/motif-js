import { Box, HStack, Stack, styled, Text, Theme, ThemeProvider, VStack } from '@motif-js/react';
import { darkTheme, lightTheme } from '@motif-js/tokens';
import { useState, type ReactNode } from 'react';

/**
 * Phase B playground. Demonstrates:
 *
 *   - CSS-variable–driven theming (toggle dark/light by attribute, not re-render)
 *   - Box / Stack / HStack / VStack / Text primitives
 *   - Token references in style props (`bg="$colors.surface.base"`)
 *   - Nested sub-theme island (`<Theme name="dark">`)
 *   - Responsive style props via the object syntax (`p={{ base, md, lg }}`)
 *   - styled() factory with variants and a compoundVariant
 */

const Button = styled('button', {
  base: {
    px: '$4',
    py: '$2',
    borderRadius: '$md',
    fontWeight: '$semibold',
    fontSize: '$md',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '$colors.border.default',
  },
  variants: {
    intent: {
      primary: {
        bg: '$colors.action.primary.bg',
        color: '$colors.action.primary.fg',
        borderColor: '$colors.action.primary.bg',
      },
      danger: {
        bg: '$colors.action.danger.bg',
        color: '$colors.action.danger.fg',
        borderColor: '$colors.action.danger.bg',
      },
      ghost: {
        bg: 'transparent',
        color: '$colors.text.default',
      },
    },
    size: {
      sm: { fontSize: '$sm', px: '$3', py: '$1' },
      md: { fontSize: '$md', px: '$4', py: '$2' },
      lg: { fontSize: '$lg', px: '$6', py: '$3' },
    },
    block: { true: { width: '$full' } },
  },
  compoundVariants: [{ intent: 'primary', size: 'lg', css: { fontWeight: '$bold' } }],
  defaultVariants: { intent: 'primary', size: 'md' },
});

const SWATCH_GRID_STYLE = { gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' };

function ColorSwatch({ token, label }: { token: string; label: string }) {
  return (
    <Box
      p="$3"
      borderRadius="$md"
      bg={token}
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      minH={64}
      display="flex"
      alignItems="flex-end"
    >
      <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
        {label}
      </Text>
    </Box>
  );
}

function DemoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack gap="$3" mb="$8">
      <Text
        as="h2"
        fontSize="$lg"
        fontWeight="$semibold"
        color="$colors.text.default"
        mt={0}
        mb={0}
      >
        {title}
      </Text>
      {children}
    </VStack>
  );
}

export function App() {
  const [active, setActive] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active={active}>
      <Box bg="$colors.surface.base" minH="100vh" color="$colors.text.default">
        <Box maxW={960} mx="auto" px={{ base: '$4', md: '$6', lg: '$8' }} py="$8">
          {/* Header */}
          <HStack alignItems="center" justifyContent="space-between" mb="$8">
            <VStack gap="$1">
              <Text
                as="h1"
                fontSize={{ base: '$2xl', md: '$3xl' }}
                fontWeight="$bold"
                color="$colors.text.default"
                mt={0}
                mb={0}
              >
                motif-js playground
              </Text>
              <Text color="$colors.text.muted" fontSize="$md">
                Phase B — CSS variables, responsive props, Stack / Text.
              </Text>
            </VStack>
            <Button onClick={() => setActive((t) => (t === 'light' ? 'dark' : 'light'))}>
              Switch to {active === 'light' ? 'dark' : 'light'}
            </Button>
          </HStack>

          {/* Color tokens */}
          <DemoSection title="Semantic colors (active theme)">
            <Box display="grid" gap="$3" style={SWATCH_GRID_STYLE}>
              <ColorSwatch token="$colors.surface.base" label="surface.base" />
              <ColorSwatch token="$colors.surface.muted" label="surface.muted" />
              <ColorSwatch token="$colors.surface.raised" label="surface.raised" />
              <ColorSwatch token="$colors.surface.sunken" label="surface.sunken" />
            </Box>
          </DemoSection>

          {/* Responsive padding */}
          <DemoSection title="Responsive prop syntax">
            <Box
              p={{ base: '$2', sm: '$4', md: '$6', lg: '$8' }}
              bg="$colors.action.primary.bg"
              color="$colors.action.primary.fg"
              borderRadius="$md"
              fontFamily="$mono"
              fontSize="$sm"
            >
              {'p={{ base: $2, sm: $4, md: $6, lg: $8 }} — resize the window'}
            </Box>
          </DemoSection>

          {/* HStack of items */}
          <DemoSection title="HStack with gap">
            <HStack gap="$3" p="$4" bg="$colors.surface.muted" borderRadius="$lg" flexWrap="wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <Box
                  key={n}
                  flex="1"
                  minW={64}
                  py="$6"
                  bg="$colors.action.primary.bg"
                  color="$colors.action.primary.fg"
                  borderRadius="$md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="$semibold"
                >
                  {n}
                </Box>
              ))}
            </HStack>
          </DemoSection>

          {/* Buttons via styled() */}
          <DemoSection title="styled() — Button variants">
            <Stack gap="$3">
              <HStack gap="$3" flexWrap="wrap">
                <Button intent="primary">Primary</Button>
                <Button intent="danger">Danger</Button>
                <Button intent="ghost">Ghost</Button>
              </HStack>
              <HStack gap="$3" flexWrap="wrap">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </HStack>
              <HStack gap="$3" flexWrap="wrap">
                <Button intent="primary" size="lg">
                  Primary + Large (bold via compoundVariant)
                </Button>
              </HStack>
              <Box maxW={320}>
                <Button block>Block button</Button>
              </Box>
            </Stack>
          </DemoSection>

          {/* Nested sub-theme */}
          <DemoSection title="Nested sub-theme — always dark">
            <VStack gap="$3" p="$5" bg="$colors.surface.muted" borderRadius="$lg">
              <Text color="$colors.text.muted">
                Outer surface uses the active theme ({active}).
              </Text>
              <Theme name="dark">
                <VStack
                  gap="$2"
                  p="$4"
                  bg="$colors.surface.raised"
                  color="$colors.text.default"
                  borderRadius="$md"
                  borderWidth={1}
                  borderStyle="solid"
                  borderColor="$colors.border.default"
                >
                  <Text fontWeight="$semibold">Dark island</Text>
                  <Text color="$colors.text.muted" fontSize="$sm">
                    {
                      'This subtree is wrapped in <Theme name="dark">. Switching is a data-theme attribute swap — no React re-render of children.'
                    }
                  </Text>
                </VStack>
              </Theme>
            </VStack>
          </DemoSection>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
