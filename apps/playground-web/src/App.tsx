import { Box, styled, Theme, ThemeProvider } from '@motif-js/react';
import { darkTheme, lightTheme } from '@motif-js/tokens';
import { useState } from 'react';

/**
 * The Phase A playground. Demonstrates:
 *
 *   - The Box primitive with style props and token references
 *   - Light / dark theme switching at the top level
 *   - A nested sub-theme island (always dark, regardless of top-level)
 *   - A Button built with the styled() factory + variants + compoundVariants
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
    block: {
      true: { width: '$full' },
    },
  },
  compoundVariants: [{ intent: 'primary', size: 'lg', css: { fontWeight: '$bold' } }],
  defaultVariants: { intent: 'primary', size: 'md' },
});

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
      <Box fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
        {label}
      </Box>
    </Box>
  );
}

function DemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box mb="$8">
      <Box
        as="h2"
        fontSize="$lg"
        fontWeight="$semibold"
        color="$colors.text.default"
        mb="$3"
        mt={0}
      >
        {title}
      </Box>
      {children}
    </Box>
  );
}

export function App() {
  const [active, setActive] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider theme={active === 'light' ? lightTheme : darkTheme}>
      <Box bg="$colors.surface.base" minH="100vh" color="$colors.text.default">
        <Box maxW={960} mx="auto" px="$6" py="$8">
          {/* Header */}
          <Box mb="$8" display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Box
                as="h1"
                fontSize="$3xl"
                fontWeight="$bold"
                color="$colors.text.default"
                mb="$2"
                mt={0}
              >
                motif-js playground
              </Box>
              <Box color="$colors.text.muted" fontSize="$md">
                Phase A — Box, Theme, styled().
              </Box>
            </Box>
            <Button onClick={() => setActive((t) => (t === 'light' ? 'dark' : 'light'))}>
              Switch to {active === 'light' ? 'dark' : 'light'}
            </Button>
          </Box>

          {/* Color tokens */}
          <DemoSection title="Semantic colors (active theme)">
            <Box display="grid" gap="$3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <ColorSwatch token="$colors.surface.base" label="surface.base" />
              <ColorSwatch token="$colors.surface.muted" label="surface.muted" />
              <ColorSwatch token="$colors.surface.raised" label="surface.raised" />
              <ColorSwatch token="$colors.surface.sunken" label="surface.sunken" />
            </Box>
          </DemoSection>

          {/* Spacing & layout */}
          <DemoSection title="Spacing & layout">
            <Box
              display="flex"
              flexDirection="row"
              gap="$3"
              p="$4"
              bg="$colors.surface.muted"
              borderRadius="$lg"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Box
                  key={n}
                  flex="1"
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
            </Box>
          </DemoSection>

          {/* Buttons via styled() */}
          <DemoSection title="styled() — Button variants">
            <Box display="flex" flexDirection="row" gap="$3" flexWrap="wrap" mb="$3">
              <Button intent="primary">Primary</Button>
              <Button intent="danger">Danger</Button>
              <Button intent="ghost">Ghost</Button>
            </Box>
            <Box display="flex" flexDirection="row" gap="$3" flexWrap="wrap" mb="$3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Box>
            <Box display="flex" flexDirection="row" gap="$3" flexWrap="wrap" mb="$3">
              <Button intent="primary" size="lg">
                Primary + Large (bold via compoundVariant)
              </Button>
            </Box>
            <Box maxW={320}>
              <Button block>Block button</Button>
            </Box>
          </DemoSection>

          {/* Nested sub-theme */}
          <DemoSection title="Nested sub-theme — always dark">
            <Box
              p="$5"
              bg="$colors.surface.muted"
              borderRadius="$lg"
              display="flex"
              flexDirection="column"
              gap="$3"
            >
              <Box color="$colors.text.muted">Outer surface uses the active theme ({active}).</Box>
              <Theme theme={darkTheme}>
                <Box
                  p="$4"
                  bg="$colors.surface.raised"
                  color="$colors.text.default"
                  borderRadius="$md"
                  borderWidth={1}
                  borderStyle="solid"
                  borderColor="$colors.border.default"
                >
                  <Box fontWeight="$semibold" mb="$2">
                    Dark island
                  </Box>
                  <Box color="$colors.text.muted" fontSize="$sm">
                    {
                      'This subtree is wrapped in <Theme theme={darkTheme}>, so its tokens resolve against dark regardless of the parent theme.'
                    }
                  </Box>
                </Box>
              </Theme>
            </Box>
          </DemoSection>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
