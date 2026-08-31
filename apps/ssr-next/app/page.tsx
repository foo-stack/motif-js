import { Box, Container, HStack, Pressable, Stack, Text, VStack } from '@usemotif/react';

/**
 * SSR demo page - exercises the responsive trio, container queries,
 * pseudo-states, and themed surfaces. Renders server-side; the
 * `MotifStyleRegistry` in `layout.tsx` extracts the captured CSS and
 * inlines it into the streamed `<head>`.
 */
export default function Page() {
  return (
    <Box bg="$colors.surface.base" minH="100vh" color="$colors.text.default">
      <Box maxW={960} mx="auto" px={{ base: '$4', md: '$6', lg: '$8' }} py="$8">
        <VStack gap="$6">
          <Stack gap="$1">
            <Text as="h1" fontSize={{ base: '$2xl', md: '$3xl' }} fontWeight="$bold" mt={0} mb={0}>
              motif × Next.js App Router
            </Text>
            <Text color="$colors.text.muted" fontSize="$md">
              SSR captured CSS lives in `&lt;style data-motif-ssr&gt;` in the document head. View
              source to confirm.
            </Text>
          </Stack>

          <Section title="Object responsive prop">
            <Box
              p={{ base: '$2', sm: '$4', md: '$6', lg: '$8' }}
              bg="$colors.action.primary.bg"
              color="$colors.action.primary.fg"
              borderRadius="$md"
              fontFamily="$mono"
              fontSize="$sm"
            >
              {'p={{ base: $2, sm: $4, md: $6, lg: $8 }}'}
            </Box>
          </Section>

          <Section title="Array responsive prop">
            <Box
              p={['$2', '$4', '$6']}
              bg="$colors.action.primary.bg"
              color="$colors.action.primary.fg"
              borderRadius="$md"
              fontFamily="$mono"
              fontSize="$sm"
            >
              {'p={[$2, $4, $6]}'}
            </Box>
          </Section>

          <Section title="String DSL responsive prop">
            <Box
              p="base:$2 sm:$4 md:$6 lg:$8"
              bg="$colors.action.primary.bg"
              color="$colors.action.primary.fg"
              borderRadius="$md"
              fontFamily="$mono"
              fontSize="$sm"
            >
              {'p="base:$2 sm:$4 md:$6 lg:$8"'}
            </Box>
          </Section>

          <Section title="Container queries">
            <Container name="card">
              <Box
                display="flex"
                flexDirection={{ base: 'column', '@card.md': 'row' }}
                gap="$3"
                p={{ base: '$3', '@card.md': '$5' }}
                bg="$colors.action.primary.bg"
                color="$colors.action.primary.fg"
                borderRadius="$md"
              >
                <Box
                  flex="1"
                  p="$3"
                  bg="$colors.surface.raised"
                  color="$colors.text.default"
                  borderRadius="$sm"
                >
                  <Text fontWeight="$semibold">Item A</Text>
                </Box>
                <Box
                  flex="1"
                  p="$3"
                  bg="$colors.surface.raised"
                  color="$colors.text.default"
                  borderRadius="$sm"
                >
                  <Text fontWeight="$semibold">Item B</Text>
                </Box>
              </Box>
            </Container>
          </Section>

          <Section title="Pressable with pseudo-states">
            <HStack gap="$3" flexWrap="wrap">
              <Pressable
                px="$5"
                py="$3"
                borderRadius="$md"
                bg="$colors.action.primary.bg"
                color="$colors.action.primary.fg"
                fontWeight="$semibold"
                borderStyle="solid"
                borderWidth={2}
                borderColor="transparent"
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                _focus={{ borderColor: '$colors.action.primary.fg' }}
              >
                Primary
              </Pressable>
              <Pressable
                px="$5"
                py="$3"
                borderRadius="$md"
                bg="$colors.surface.muted"
                color="$colors.text.default"
                fontWeight="$semibold"
                borderStyle="solid"
                borderWidth={2}
                borderColor="transparent"
                _hover={{ bg: '$colors.surface.raised' }}
                _focus={{ borderColor: '$colors.text.default' }}
                disabled
                _disabled={{ opacity: 0.5 }}
              >
                Disabled
              </Pressable>
            </HStack>
          </Section>
        </VStack>
      </Box>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack gap="$2">
      <Text as="h2" fontSize="$lg" fontWeight="$semibold" mt={0} mb={0}>
        {title}
      </Text>
      {children}
    </VStack>
  );
}
