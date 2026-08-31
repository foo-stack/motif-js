import { useState } from 'react';
import { ScrollView, StatusBar, useColorScheme } from 'react-native';
import {
  Box,
  Container,
  HStack,
  Image,
  Pressable,
  Stack,
  Text,
  Theme,
  ThemeProvider,
  VStack,
} from '@usemotif/react-native';
import { darkTheme, lightTheme } from '@usemotif/tokens';

/**
 * Native renderer playground (bare RN, no Expo). Same primitives, same
 * prop schema, same themes as the web playground. Demonstrates:
 *
 * - JS-context theming with `<ThemeProvider>` + `<Theme name>`
 *   nested boundary
 * - Three responsive shapes (object / array / DSL) resolving against
 *   the device viewport via `Dimensions`
 * - Container queries via `<Container name>` measuring its own width
 *   on `View.onLayout`
 * - Pressable with `_hover` / `_focus` / `_active` / `_disabled`
 *   pseudo-state styles (RN's hover/focus only fire on platforms
 *   that support them - desktop, web, mouse-connected mobile)
 */
export default function App() {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);
  const active: 'light' | 'dark' = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active={active}>
      <StatusBar barStyle={active === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView style={{ flex: 1 }}>
        <Box bg="$colors.surface.base" minH="100%" py="$8" px={{ base: '$4', md: '$8' }}>
          <VStack gap="$6">
            {/* Header */}
            <HStack alignItems="center" justifyContent="space-between">
              <VStack gap="$1">
                <Text
                  fontSize={{ base: '$2xl', md: '$3xl' }}
                  fontWeight="$bold"
                  color="$colors.text.default"
                >
                  motif-js native
                </Text>
                <Text color="$colors.text.muted" fontSize="$md">
                  Native renderer playground
                </Text>
              </VStack>
              <Pressable
                onPress={() => setOverride(active === 'light' ? 'dark' : 'light')}
                px="$4"
                py="$2"
                borderRadius="$md"
                bg="$colors.action.primary.bg"
                _active={{ opacity: 0.8 }}
                _hover={{ opacity: 0.9 }}
              >
                <Text color="$colors.action.primary.fg" fontWeight="$semibold">
                  {active === 'light' ? 'Dark' : 'Light'}
                </Text>
              </Pressable>
            </HStack>

            {/* Responsive - three shapes */}
            <Section title="Responsive - object / array / DSL">
              <Box
                p={{ base: '$2', sm: '$4', md: '$6', lg: '$8' }}
                bg="$colors.action.primary.bg"
                borderRadius="$md"
              >
                <Text color="$colors.action.primary.fg" fontFamily="$mono" fontSize="$sm">
                  {'p={{ base: $2, sm: $4, md: $6, lg: $8 }}'}
                </Text>
              </Box>
              <Box p={['$2', '$4', '$6', '$8']} bg="$colors.action.primary.bg" borderRadius="$md">
                <Text color="$colors.action.primary.fg" fontFamily="$mono" fontSize="$sm">
                  {'p={[$2, $4, $6, $8]}'}
                </Text>
              </Box>
              <Box p="base:$2 sm:$4 md:$6 lg:$8" bg="$colors.action.primary.bg" borderRadius="$md">
                <Text color="$colors.action.primary.fg" fontFamily="$mono" fontSize="$sm">
                  {'p="base:$2 sm:$4 md:$6 lg:$8"'}
                </Text>
              </Box>
            </Section>

            {/* Container queries */}
            <Section title="Container queries - reflow on container width">
              <Container name="card">
                <Box
                  p={{ base: '$3', '@card.md': '$5' }}
                  bg="$colors.action.primary.bg"
                  borderRadius={8}
                >
                  <Stack direction={{ base: 'column', '@card.md': 'row' }} gap="$3">
                    <Box flex="1" p="$3" bg="$colors.surface.raised" borderRadius="$sm">
                      <Text fontWeight="$semibold" color="$colors.text.default">
                        Item A
                      </Text>
                    </Box>
                    <Box flex="1" p="$3" bg="$colors.surface.raised" borderRadius="$sm">
                      <Text fontWeight="$semibold" color="$colors.text.default">
                        Item B
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </Container>
            </Section>

            {/* Pressable */}
            <Section title="Pressable - pseudo states">
              <HStack gap="$3" flexWrap="wrap">
                <Pressable
                  px="$5"
                  py="$3"
                  borderRadius={8}
                  bg="$colors.action.primary.bg"
                  _hover={{ opacity: 0.9 }}
                  _active={{ opacity: 0.8 }}
                >
                  <Text color="$colors.action.primary.fg" fontWeight="$semibold">
                    Primary
                  </Text>
                </Pressable>
                <Pressable
                  px="$5"
                  py="$3"
                  borderRadius={8}
                  bg="$colors.surface.muted"
                  disabled
                  _disabled={{ opacity: 0.5 }}
                >
                  <Text color="$colors.text.default" fontWeight="$semibold">
                    Disabled
                  </Text>
                </Pressable>
              </HStack>
            </Section>

            {/* Image */}
            <Section title="Image - placeholder + fallback">
              <HStack gap="$4" flexWrap="wrap">
                <Image
                  src="https://placehold.co/160x100/3b82f6/white?text=img"
                  alt="example"
                  w={160}
                  h={100}
                  borderRadius={8}
                />
                <Image
                  src="https://example.invalid/missing.jpg"
                  alt="broken"
                  w={160}
                  h={100}
                  borderRadius={8}
                  fallback={
                    <Box
                      bg="$colors.surface.muted"
                      w="100%"
                      h="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
                        404
                      </Text>
                    </Box>
                  }
                />
              </HStack>
            </Section>

            {/* Nested theme */}
            <Section title="Nested sub-theme - always dark">
              <Theme name="dark">
                <VStack gap="$2" p="$4" bg="$colors.surface.raised" borderRadius={8}>
                  <Text fontWeight="$semibold" color="$colors.text.default">
                    Dark island
                  </Text>
                  <Text color="$colors.text.muted" fontSize="$sm">
                    Switching the outer theme leaves this region dark.
                  </Text>
                </VStack>
              </Theme>
            </Section>
          </VStack>
        </Box>
      </ScrollView>
    </ThemeProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack gap="$2">
      <Text fontSize="$lg" fontWeight="$semibold" color="$colors.text.default">
        {title}
      </Text>
      {children}
    </VStack>
  );
}
