import {
  AspectRatio,
  Avatar,
  Blockquote,
  Box,
  Button,
  Center,
  Code,
  Container,
  Field,
  FieldError,
  FieldHelp,
  Fieldset,
  Flex,
  Grid,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Kbd,
  Label,
  Link,
  NumberInput,
  Paragraph,
  PasswordInput,
  Pressable,
  Spacer,
  Stack,
  TextArea,
  styled,
  Text,
  Theme,
  ThemeProvider,
  VStack,
  Wrap,
  ZStack,
} from 'usemotif';
import { Check, ChevronRight, Heart, Plus, Search, Star, Trash } from '@motif-js/icons';
import { AlertDialog, Dialog, Tooltip } from '@motif-js/headless';
import { darkTheme, lightTheme } from '@motif-js/tokens';
import { useMemo, useState, type ReactNode } from 'react';
import type { FontFace, ThemeRootStyles } from 'usemotif';
import { keyframes } from 'usemotif';

/** M-2 keyframes() demo: a 360° rotation used by the spinner below. */
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

/** M-2 keyframes() demo: a horizontal pulse used by the marquee badge. */
const pulse = keyframes({
  '0%': { opacity: 0.4 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.4 },
});

/**
 * Inter Variable as a self-hosted-style example, served from the
 * upstream CDN. Demonstrates the M-1 `fonts` field on `createTheme`:
 * the @font-face block is emitted once at the root by `<ThemeProvider>`,
 * deduped across themes by `(family, weight, style, src)`.
 */
const RUNTIME_FONTS: readonly FontFace[] = [
  {
    family: 'Inter',
    src: [{ url: 'https://rsms.me/inter/font-files/Inter-roman.var.woff2?v=4.0', format: 'woff2' }],
    weight: '100 900',
    style: 'normal',
    display: 'swap',
  },
];

/**
 * Body / `::selection` resets driven by token references — the cascade
 * resolves them per active theme automatically.
 */
const RUNTIME_ROOT: ThemeRootStyles = {
  background: '$colors.surface.base',
  color: '$colors.text.default',
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  selectionBackground: '$colors.action.primary.bg',
  selectionColor: '$colors.action.primary.fg',
};

/**
 * Web playground. Demonstrates:
 *
 *   - CSS-variable–driven theming (toggle dark/light by attribute, not re-render)
 *   - Box / Stack / HStack / VStack / Text primitives
 *   - Token references in style props (`bg="$colors.surface.base"`)
 *   - Nested sub-theme island (`<Theme name="dark">`)
 *   - Responsive style props via object / array / DSL syntax
 *   - Container queries via `<Container>` and `@<name>.<bp>` prop keys
 *   - Pressable primitive with `_hover` / `_focus` / `_active` / `_disabled`
 *   - Image primitive with placeholder + fallback states
 *   - styled() factory with variants and a compoundVariant
 */

const StyledButton = styled('button', {
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

  // Augment the shipped tokens themes with the M-1 runtime fields so a
  // single mount exercises @font-face emission, body / ::selection
  // resets, and the prefers-reduced-motion guard.
  const themes = useMemo(
    () => [
      { ...lightTheme, fonts: RUNTIME_FONTS, root: RUNTIME_ROOT, reducedMotion: 'guard' as const },
      { ...darkTheme, fonts: RUNTIME_FONTS, root: RUNTIME_ROOT, reducedMotion: 'guard' as const },
    ],
    [],
  );

  return (
    <ThemeProvider themes={themes} active={active}>
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
                CSS variables, responsive props, primitives + headless.
              </Text>
            </VStack>
            <Button
              variant="outline"
              intent="neutral"
              onClick={() => setActive((t) => (t === 'light' ? 'dark' : 'light'))}
            >
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
          <DemoSection title="Responsive prop syntax — object, array, DSL">
            <Text color="$colors.text.muted" fontSize="$sm">
              Resize the window. All three boxes reflow identically; only the prop shape differs.
            </Text>
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
            <Box
              p={['$2', '$4', '$6', '$8']}
              bg="$colors.action.primary.bg"
              color="$colors.action.primary.fg"
              borderRadius="$md"
              fontFamily="$mono"
              fontSize="$sm"
            >
              {'p={[$2, $4, $6, $8]}'}
            </Box>
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
          </DemoSection>

          {/* Container queries */}
          <DemoSection title="Container queries — reflow on container width">
            <Text color="$colors.text.muted" fontSize="$sm">
              Drag the bottom-right corner to resize. The card reflows on its own width —
              independent of the viewport.
            </Text>
            <Box
              style={{ resize: 'horizontal', overflow: 'auto' }}
              p="$3"
              borderWidth={1}
              borderStyle="solid"
              borderColor="$colors.border.default"
              borderRadius="$md"
              minW={240}
              maxW="100%"
            >
              <Container name="card">
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', '@card.md': 'row' }}
                  gap="$3"
                  p={{ base: '$3', '@card.sm': '$4', '@card.lg': '$6' }}
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
                    <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
                      flexDirection=
                      {`{{ base: 'column', '@card.md': 'row' }}`}
                    </Text>
                  </Box>
                  <Box
                    flex="1"
                    p="$3"
                    bg="$colors.surface.raised"
                    color="$colors.text.default"
                    borderRadius="$sm"
                  >
                    <Text fontWeight="$semibold">Item B</Text>
                    <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
                      p=
                      {`{{ base: $3, '@card.sm': $4, '@card.lg': $6 }}`}
                    </Text>
                  </Box>
                </Box>
              </Container>
            </Box>
          </DemoSection>

          {/* Pressable */}
          <DemoSection title="Pressable — hover / focus / active / disabled">
            <Text color="$colors.text.muted" fontSize="$sm">
              Hover, click, and Tab onto the buttons. Focus styles only show on keyboard focus
              (`:focus-visible`).
            </Text>
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
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                onPress={() => console.info('primary pressed')}
              >
                Primary
              </Pressable>
              <Pressable
                px="$5"
                py="$3"
                borderRadius="$md"
                bg="$colors.action.danger.bg"
                color="$colors.action.danger.fg"
                fontWeight="$semibold"
                borderStyle="solid"
                borderWidth={2}
                borderColor="transparent"
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                _focus={{ borderColor: '$colors.action.danger.fg' }}
              >
                Danger
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
          </DemoSection>

          {/* Image */}
          <DemoSection title="Image — simple, placeholder, and fallback">
            <Text color="$colors.text.muted" fontSize="$sm">
              Three states: a plain image, a placeholder shown while loading (open DevTools and
              throttle to "Slow 3G" to see it), and a fallback for the broken-URL case.
            </Text>
            <HStack gap="$4" flexWrap="wrap">
              <Box>
                <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono" mb="$1">
                  simple
                </Text>
                <Image
                  src="https://placehold.co/160x100/3b82f6/white?text=img"
                  alt="Placeholder image"
                  w={160}
                  h={100}
                  borderRadius="$md"
                  objectFit="cover"
                />
              </Box>
              <Box>
                <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono" mb="$1">
                  with placeholder
                </Text>
                <Image
                  src="https://placehold.co/160x100/8b5cf6/white?text=img"
                  alt="With placeholder"
                  w={160}
                  h={100}
                  borderRadius="$md"
                  objectFit="cover"
                  placeholder={
                    <Box
                      bg="$colors.surface.muted"
                      w="100%"
                      h="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
                        loading…
                      </Text>
                    </Box>
                  }
                />
              </Box>
              <Box>
                <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono" mb="$1">
                  broken URL → fallback
                </Text>
                <Image
                  src="https://example.invalid/missing.jpg"
                  alt="Broken — fallback"
                  w={160}
                  h={100}
                  borderRadius="$md"
                  objectFit="cover"
                  fallback={
                    <Box
                      bg="$colors.surface.muted"
                      w="100%"
                      h="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
                        404
                      </Text>
                    </Box>
                  }
                />
              </Box>
            </HStack>
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

          {/* The shipped <Button> primitive */}
          <DemoSection title="Button primitive — variant matrix">
            <Stack gap="$4">
              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  variant × intent
                </Text>
                <HStack gap="$3" flexWrap="wrap">
                  <Button>Solid · primary</Button>
                  <Button intent="danger">Solid · danger</Button>
                  <Button intent="success">Solid · success</Button>
                  <Button intent="neutral">Solid · neutral</Button>
                </HStack>
                <HStack gap="$3" flexWrap="wrap">
                  <Button variant="outline">Outline · primary</Button>
                  <Button variant="outline" intent="danger">
                    Outline · danger
                  </Button>
                  <Button variant="outline" intent="neutral">
                    Outline · neutral
                  </Button>
                </HStack>
                <HStack gap="$3" flexWrap="wrap">
                  <Button variant="ghost">Ghost · primary</Button>
                  <Button variant="ghost" intent="danger">
                    Ghost · danger
                  </Button>
                </HStack>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  size
                </Text>
                <HStack gap="$3" flexWrap="wrap" alignItems="center">
                  <Button size="xs">XS</Button>
                  <Button size="sm">SM</Button>
                  <Button size="md">MD</Button>
                  <Button size="lg">LG</Button>
                  <Button size="xl">XL</Button>
                </HStack>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  composition slots
                </Text>
                <HStack gap="$3" flexWrap="wrap">
                  <Button leadingIcon={<span aria-hidden>+</span>}>Add item</Button>
                  <Button trailingIcon={<span aria-hidden>→</span>}>Continue</Button>
                  <Button
                    intent="danger"
                    leadingIcon={<span aria-hidden>×</span>}
                    trailingIcon={<span aria-hidden>!</span>}
                  >
                    Delete
                  </Button>
                </HStack>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  state
                </Text>
                <HStack gap="$3" flexWrap="wrap">
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                  <Button loading loadingLabel="Saving…">
                    Save
                  </Button>
                </HStack>
              </Stack>

              <Box maxW={320}>
                <Button fullWidth>Full-width</Button>
              </Box>
            </Stack>
          </DemoSection>

          {/* Typography primitives */}
          <DemoSection title="Typography primitives">
            <Stack gap="$3">
              <Heading level={1}>Heading level 1</Heading>
              <Heading level={2}>Heading level 2</Heading>
              <Heading level={3}>Heading level 3</Heading>
              <Heading level={4}>Heading level 4</Heading>
              <Paragraph>
                A paragraph wraps `&lt;p&gt;` with sane defaults: 1.6 line-height, medium font size,
                no enforced margin. Inline <Code>code</Code> tints lightly. Press <Kbd>⌘</Kbd>+
                <Kbd>K</Kbd> to focus search.
              </Paragraph>
              <Blockquote cite="— Aristotle">
                We are what we repeatedly do. Excellence, then, is not an act, but a habit.
              </Blockquote>
            </Stack>
          </DemoSection>

          {/* Layout primitives */}
          <DemoSection title="Layout primitives">
            <Stack gap="$5">
              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  Spacer / HStack — pushes apart
                </Text>
                <HStack gap="$2" bg="$colors.surface.muted" p="$2" borderRadius="$md">
                  <Box bg="$colors.action.primary.bg" w={48} h={32} borderRadius="$sm" />
                  <Spacer />
                  <Box bg="$colors.action.danger.bg" w={48} h={32} borderRadius="$sm" />
                </HStack>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  Center — both axes
                </Text>
                <Center bg="$colors.surface.muted" h={120} borderRadius="$md">
                  <Text>Centered</Text>
                </Center>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  Wrap — flex-wrap with consistent gap
                </Text>
                <Wrap gap="$2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Box
                      key={i}
                      bg="$colors.action.primary.bg"
                      color="$colors.action.primary.fg"
                      px="$3"
                      py="$1"
                      borderRadius="$full"
                      fontSize="$sm"
                    >
                      tag {i + 1}
                    </Box>
                  ))}
                </Wrap>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  AspectRatio — 16:9 box
                </Text>
                <AspectRatio
                  ratio={16 / 9}
                  maxW={480}
                  bg="$colors.surface.muted"
                  borderRadius="$md"
                >
                  <Center w="$full" h="$full">
                    <Text fontSize="$lg">16 : 9</Text>
                  </Center>
                </AspectRatio>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  Grid — 4 uniform columns
                </Text>
                <Grid columns={4} gap="$2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Box
                      key={i}
                      bg="$colors.surface.muted"
                      borderRadius="$md"
                      h={48}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {i + 1}
                    </Box>
                  ))}
                </Grid>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  ZStack — z-axis overlap
                </Text>
                <ZStack maxW={320} h={120}>
                  <Box bg="$colors.action.primary.bg" w="$full" h="$full" borderRadius="$md" />
                  <Center>
                    <Text color="$colors.action.primary.fg" fontWeight="$bold">
                      Overlay
                    </Text>
                  </Center>
                </ZStack>
              </Stack>

              <Stack gap="$2">
                <Text color="$colors.text.muted" fontSize="$sm">
                  Flex — bare flex container
                </Text>
                <Flex direction="row" gap="$3" alignItems="center">
                  <Box bg="$colors.surface.muted" p="$2" borderRadius="$sm">
                    A
                  </Box>
                  <Box bg="$colors.surface.muted" p="$2" borderRadius="$sm">
                    B
                  </Box>
                  <Box bg="$colors.surface.muted" p="$2" borderRadius="$sm">
                    C
                  </Box>
                </Flex>
              </Stack>
            </Stack>
          </DemoSection>

          {/* IconButton + Link */}
          <DemoSection title="IconButton + Link">
            <Stack gap="$3">
              <Text color="$colors.text.muted" fontSize="$sm">
                IconButton sizes
              </Text>
              <HStack gap="$3" alignItems="center">
                <IconButton aria-label="add (xs)" size="xs">
                  <span>+</span>
                </IconButton>
                <IconButton aria-label="add (sm)" size="sm">
                  <span>+</span>
                </IconButton>
                <IconButton aria-label="add (md)" size="md">
                  <span>+</span>
                </IconButton>
                <IconButton aria-label="add (lg)" size="lg">
                  <span>+</span>
                </IconButton>
                <IconButton aria-label="add (xl)" size="xl">
                  <span>+</span>
                </IconButton>
              </HStack>

              <Text color="$colors.text.muted" fontSize="$sm">
                IconButton variants
              </Text>
              <HStack gap="$3">
                <IconButton aria-label="solid">★</IconButton>
                <IconButton aria-label="outline" variant="outline">
                  ★
                </IconButton>
                <IconButton aria-label="ghost" variant="ghost">
                  ★
                </IconButton>
                <IconButton aria-label="danger" intent="danger" variant="outline">
                  ×
                </IconButton>
                <IconButton aria-label="loading" loading>
                  ⏳
                </IconButton>
              </HStack>

              <Text color="$colors.text.muted" fontSize="$sm">
                Link
              </Text>
              <Paragraph>
                Read the{' '}
                <Link href="https://github.com/foo-stack/motif-js" target="_blank">
                  GitHub repo
                </Link>{' '}
                for the full picture, or jump to the{' '}
                <Link href="#typography-primitives" underline="always">
                  typography section
                </Link>{' '}
                above.
              </Paragraph>
            </Stack>
          </DemoSection>

          {/* Media primitives */}
          <DemoSection title="Media — Avatar / Icon / @motif-js/icons">
            <Stack gap="$3">
              <Text color="$colors.text.muted" fontSize="$sm">
                Avatar — image with initials fallback
              </Text>
              <HStack gap="$3" alignItems="center">
                <Avatar name="Jane Doe" size="xs" />
                <Avatar name="Jane Doe" size="sm" />
                <Avatar name="Jane Doe" size="md" />
                <Avatar name="Jane Doe" size="lg" />
                <Avatar name="Jane Doe" size="xl" />
                <Avatar name="Anil" size="md" shape="square" />
                <Avatar
                  name="With image"
                  size="md"
                  src="https://avatars.githubusercontent.com/u/0?v=4"
                />
              </HStack>

              <Text color="$colors.text.muted" fontSize="$sm">
                Icons (from @motif-js/icons)
              </Text>
              <HStack gap="$3" alignItems="center" fontSize="$2xl">
                <Plus />
                <Check />
                <Search />
                <ChevronRight />
                <Heart color="$colors.action.danger.bg" />
                <Star color="$colors.action.success.bg" />
                <Trash color="$colors.action.danger.bg" />
                <Box fontSize="$sm">
                  <Plus />
                </Box>
                <Box fontSize="$3xl">
                  <Plus />
                </Box>
              </HStack>

              <Text color="$colors.text.muted" fontSize="$sm">
                IconButton with bundled icons
              </Text>
              <HStack gap="$3">
                <IconButton aria-label="Add">
                  <Plus />
                </IconButton>
                <IconButton aria-label="Delete" intent="danger" variant="outline">
                  <Trash />
                </IconButton>
                <IconButton aria-label="Like" intent="danger" variant="ghost">
                  <Heart />
                </IconButton>
              </HStack>
            </Stack>
          </DemoSection>

          {/* Forms primitives */}
          <DemoSection title="Forms — Field / Label / Input / TextArea / NumberInput / PasswordInput">
            <Fieldset legend="Account">
              <Stack gap="$3">
                <Field required>
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" />
                  <FieldHelp>We'll never share it.</FieldHelp>
                </Field>

                <Field invalid>
                  <Label>Username</Label>
                  <Input defaultValue="bad value" />
                  <FieldError>Username is already taken.</FieldError>
                </Field>

                <Field>
                  <Label>Bio</Label>
                  <TextArea rows={4} placeholder="Say something about yourself…" />
                </Field>

                <Field>
                  <Label>Age</Label>
                  <NumberInput min={0} max={120} />
                </Field>

                <Field>
                  <Label>Password</Label>
                  <PasswordInput />
                </Field>

                <Field disabled>
                  <Label>Disabled</Label>
                  <Input defaultValue="cannot edit" />
                </Field>
              </Stack>
            </Fieldset>
          </DemoSection>

          {/* Headless components */}
          <DemoSection title="Headless components — Dialog / AlertDialog / Tooltip">
            <Stack gap="$3">
              <Text color="$colors.text.muted" fontSize="$sm">
                Each headless component composes motif primitives — no built-in styling. Click the
                triggers to open.
              </Text>

              <HStack gap="$3" flexWrap="wrap">
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button>Open Dialog</Button>
                  </Dialog.Trigger>
                  <Dialog.Content
                    style={{
                      background: 'var(--colors-surface-base)',
                      color: 'var(--colors-text-default)',
                      padding: 24,
                      borderRadius: 12,
                      maxWidth: 420,
                      boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
                    }}
                  >
                    <Dialog.Title as="h2">
                      <Text fontSize="$lg" fontWeight="$bold" mt={0} mb="$2">
                        Confirm save?
                      </Text>
                    </Dialog.Title>
                    <Dialog.Description as="div">
                      <Text color="$colors.text.muted" mb="$4">
                        This will overwrite the existing draft.
                      </Text>
                    </Dialog.Description>
                    <HStack gap="$2" justifyContent="flex-end">
                      <Dialog.Close>
                        <Button variant="outline" intent="neutral">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button>Save</Button>
                      </Dialog.Close>
                    </HStack>
                  </Dialog.Content>
                </Dialog.Root>

                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button intent="danger">Delete account</Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content
                    style={{
                      background: 'var(--colors-surface-base)',
                      color: 'var(--colors-text-default)',
                      padding: 24,
                      borderRadius: 12,
                      maxWidth: 420,
                      boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
                    }}
                  >
                    <AlertDialog.Title as="h2">
                      <Text fontSize="$lg" fontWeight="$bold" mt={0} mb="$2">
                        Delete account?
                      </Text>
                    </AlertDialog.Title>
                    <AlertDialog.Description as="div">
                      <Text color="$colors.text.muted" mb="$4">
                        This is permanent. All your data will be removed and cannot be recovered.
                      </Text>
                    </AlertDialog.Description>
                    <HStack gap="$2" justifyContent="flex-end">
                      <AlertDialog.Close>
                        <Button variant="outline" intent="neutral">
                          Cancel
                        </Button>
                      </AlertDialog.Close>
                      <AlertDialog.Close>
                        <Button intent="danger">Delete</Button>
                      </AlertDialog.Close>
                    </HStack>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </HStack>

              <HStack gap="$3" alignItems="center">
                <Text color="$colors.text.muted" fontSize="$sm">
                  Hover or focus →
                </Text>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger>
                    <IconButton aria-label="Save">
                      <Heart />
                    </IconButton>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <Box
                      bg="$colors.text.default"
                      color="$colors.surface.base"
                      px="$2"
                      py="$1"
                      borderRadius="$sm"
                      fontSize="$sm"
                    >
                      Save (⌘S)
                    </Box>
                  </Tooltip.Content>
                </Tooltip.Root>

                <Tooltip.Root placement="top">
                  <Tooltip.Trigger>
                    <Button variant="outline">Hover me</Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <Box
                      bg="$colors.text.default"
                      color="$colors.surface.base"
                      px="$2"
                      py="$1"
                      borderRadius="$sm"
                      fontSize="$sm"
                    >
                      Tooltip placed above
                    </Box>
                  </Tooltip.Content>
                </Tooltip.Root>
              </HStack>
            </Stack>
          </DemoSection>

          {/* Buttons via styled() — kept as the styled() factory demo. */}
          <DemoSection title="styled() factory — building your own Button">
            <Stack gap="$3">
              <HStack gap="$3" flexWrap="wrap">
                <StyledButton intent="primary">Primary</StyledButton>
                <StyledButton intent="danger">Danger</StyledButton>
                <StyledButton intent="ghost">Ghost</StyledButton>
              </HStack>
              <HStack gap="$3" flexWrap="wrap">
                <StyledButton size="sm">Small</StyledButton>
                <StyledButton size="md">Medium</StyledButton>
                <StyledButton size="lg">Large</StyledButton>
              </HStack>
              <HStack gap="$3" flexWrap="wrap">
                <StyledButton intent="primary" size="lg">
                  Primary + Large (bold via compoundVariant)
                </StyledButton>
              </HStack>
              <Box maxW={320}>
                <StyledButton block>Block button</StyledButton>
              </Box>
            </Stack>
          </DemoSection>

          {/* M-2 demo — pseudo-element props + keyframes() + animation object form */}
          <DemoSection title="Pseudo-elements + keyframes() — M-2 plumbing">
            <Text color="$colors.text.muted" fontSize="$sm">
              `_before` / `_after` accept the same style bag as `_hover`. `keyframes(...)` returns a
              stable id; the `@keyframes` rule emits once when the animation prop references it.
            </Text>
            <HStack gap="$4" alignItems="center" flexWrap="wrap">
              {/* `_before` decorative chevron */}
              <Box
                px="$4"
                py="$2"
                borderRadius="$md"
                bg="$colors.surface.muted"
                color="$colors.text.default"
                _before={{
                  content: '"▸ "',
                  color: '$colors.action.primary.bg',
                  fontWeight: '$bold',
                }}
              >
                with `_before` chevron
              </Box>

              {/* `_after` arrow */}
              <Pressable
                px="$4"
                py="$2"
                borderRadius="$md"
                bg="$colors.action.primary.bg"
                color="$colors.action.primary.fg"
                fontWeight="$semibold"
                _after={{ content: '" →"', display: 'inline-block' }}
                _hover={{ opacity: 0.9 }}
              >
                with `_after` arrow
              </Pressable>

              {/* keyframes() spinner */}
              <Box
                w={32}
                h={32}
                borderRadius="$full"
                borderWidth={3}
                borderStyle="solid"
                borderColor="$colors.surface.muted"
                borderTopColor="$colors.action.primary.bg"
                animation={{
                  name: spin,
                  duration: '1s',
                  easing: 'linear',
                  iterationCount: 'infinite',
                }}
                aria-label="Loading"
              />

              {/* Pulse animation */}
              <Box
                px="$3"
                py="$1"
                borderRadius="$full"
                bg="$colors.action.danger.bg"
                color="$colors.action.danger.fg"
                fontSize="$xs"
                fontWeight="$bold"
                animation={{
                  name: pulse,
                  duration: '1.5s',
                  easing: 'ease-in-out',
                  iterationCount: 'infinite',
                }}
              >
                LIVE
              </Box>
            </HStack>
          </DemoSection>

          {/* M-3 demo — typed display style props (1.4) */}
          <DemoSection title="Display style props — M-3 (1.4) fontVariationSettings, maskImage, clipPath">
            <Text color="$colors.text.muted" fontSize="$sm">
              `fontVariationSettings` accepts a typed axis object (opsz, wght, wdth, ital, slnt,
              GRAD, SOFT, plus arbitrary tags) and serialises to the CSS shorthand. `maskImage` and
              `clipPath` are string-passthrough props.
            </Text>
            <VStack gap="$4">
              {/* Typed axis object — single axis */}
              <Box
                fontFamily="Inter, system-ui, sans-serif"
                fontSize={28}
                color="$colors.text.default"
                fontVariationSettings={{ wght: 720 }}
              >
                Single axis: wght 720
              </Box>

              {/* Typed axis object — multiple axes (opsz/SOFT inert on Inter,
                  but the emitted CSS is correct and would activate on a font
                  that supports those axes — Fraunces, Recursive, etc.). */}
              <Box
                fontFamily="Inter, system-ui, sans-serif"
                fontSize={28}
                color="$colors.text.default"
                fontVariationSettings={{ opsz: 36, wght: 600, SOFT: 50 }}
              >
                Multi-axis: opsz 36, wght 600, SOFT 50
              </Box>

              {/* String passthrough form */}
              <Box
                fontFamily="Inter, system-ui, sans-serif"
                fontSize={28}
                color="$colors.text.default"
                fontVariationSettings="'wght' 380, 'slnt' -8"
              >
                String form: 'wght' 380, 'slnt' -8
              </Box>

              <HStack gap="$4" flexWrap="wrap">
                {/* maskImage demo — fade-out gradient */}
                <Box
                  w={220}
                  h={120}
                  bg="$colors.action.primary.bg"
                  color="$colors.action.primary.fg"
                  borderRadius="$md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="$semibold"
                  maskImage="linear-gradient(to right, black 0%, black 60%, transparent 100%)"
                  WebkitMaskImage="linear-gradient(to right, black 0%, black 60%, transparent 100%)"
                >
                  maskImage gradient
                </Box>

                {/* clipPath demo — chevron polygon */}
                <Box
                  w={220}
                  h={120}
                  bg="$colors.action.success.bg"
                  color="$colors.action.success.fg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="$semibold"
                  clipPath="polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)"
                >
                  clipPath chevron
                </Box>

                {/* Combined responsive fontVariationSettings + clipPath. */}
                <Box
                  px="$4"
                  py="$3"
                  bg="$colors.surface.muted"
                  color="$colors.text.default"
                  borderRadius="$md"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontVariationSettings={{
                    base: { wght: 380 },
                    md: { wght: 720, slnt: -6 },
                  }}
                >
                  Responsive axis @md
                </Box>
              </HStack>
            </VStack>
          </DemoSection>

          {/* M-4 demo — container queries (1.5) */}
          <DemoSection title="Container queries — M-4 (1.5) containerType + containerName">
            <Text color="$colors.text.muted" fontSize="$sm">
              `containerType="inline-size"` opts an element into a CSS containment context. Pair
              with `containerName` to give the context a stable name; descendants then query it via
              `@container card` keys (e.g. `p={'{ base: "$2", "@card.md": "$4" }'}`).
            </Text>
            <Box
              containerType="inline-size"
              containerName="card"
              p="$4"
              borderWidth={1}
              borderStyle="solid"
              borderColor="$colors.border.default"
              borderRadius="$lg"
              maxWidth={520}
              overflow="auto"
              style={{ resize: 'horizontal' }}
            >
              <Text fontSize="$sm" color="$colors.text.muted" mb="$3">
                Card container — drag the bottom-right corner to resize:
              </Text>
              <Box
                p={{ base: '$2', '@card.md': '$5' }}
                bg={{ base: '$colors.action.primary.bg', '@card.md': '$colors.action.success.bg' }}
                color="$colors.action.primary.fg"
                borderRadius="$md"
                fontWeight="$semibold"
              >
                Padding + bg flip when this card crosses the `md` (768px) container width.
              </Box>
            </Box>
          </DemoSection>

          {/* M-5 demo — responsive cascade fix (1.6) */}
          <DemoSection title="Responsive cascade — M-5 (1.6) base now correctly loses to overrides">
            <Text color="$colors.text.muted" fontSize="$sm">
              Pre-1.6: `display={'{ base: "none", md: "flex" }'}` rendered as `display: none` at
              every viewport because the inline-style `base` (specificity 1,0,0,0) clobbered the
              class-scoped `@media` override (0,0,1,0). 1.6 emits the `base` slot as a bare `.m-…`
              class block instead — same specificity as the override, source order wins. Resize the
              viewport across the `md` (768px) breakpoint to watch each row toggle.
            </Text>
            <VStack gap="$2">
              <Box
                display={{ base: 'none', md: 'flex' }}
                p="$3"
                bg="$colors.surface.raised"
                borderRadius="$md"
              >
                <Text fontWeight="$semibold">md+ only</Text>
                <Text color="$colors.text.muted" fontSize="$sm">
                  &nbsp;— hidden below 768px
                </Text>
              </Box>
              <Box
                display={{ base: 'flex', md: 'none' }}
                p="$3"
                bg="$colors.action.primary.bg"
                color="$colors.action.primary.fg"
                borderRadius="$md"
              >
                <Text fontWeight="$semibold">base only</Text>
                <Text fontSize="$sm">&nbsp;— hidden at 768px+</Text>
              </Box>
              <Box
                display="flex"
                p={{ base: '$2', md: '$4' }}
                bg={{ base: '$colors.surface.muted', md: '$colors.surface.raised' }}
                borderRadius="$md"
              >
                <Text>Padding + bg shift across the same breakpoint.</Text>
              </Box>
            </VStack>
          </DemoSection>

          {/* M-6 demo — grid layout style props (1.7) */}
          <DemoSection title="Grid layout — M-6 (1.7) gridTemplateColumns + gridColumn/Row span">
            <Text color="$colors.text.muted" fontSize="$sm">
              Grid declaration and child placement are first-class style props as of 1.7. Both
              participate in the responsive object syntax, so a grid can flip columns and a cell can
              flip its span across breakpoints from a single prop. Resize across `md` (768px).
            </Text>
            <Box
              display="grid"
              gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
              gap="$3"
            >
              <Box
                gridColumn={{ base: 'span 2', md: 'span 2' }}
                gridRow={{ base: 'auto', md: 'span 2' }}
                p="$4"
                bg="$colors.action.primary.bg"
                color="$colors.action.primary.fg"
                borderRadius="$md"
              >
                <Text fontWeight="$semibold">Feature cell</Text>
                <Text fontSize="$sm">span 2 base · span 2 + row 2 at md</Text>
              </Box>
              <Box p="$4" bg="$colors.surface.raised" borderRadius="$md">
                <Text fontWeight="$semibold">A</Text>
              </Box>
              <Box p="$4" bg="$colors.surface.raised" borderRadius="$md">
                <Text fontWeight="$semibold">B</Text>
              </Box>
              <Box p="$4" bg="$colors.surface.raised" borderRadius="$md">
                <Text fontWeight="$semibold">C</Text>
              </Box>
              <Box p="$4" bg="$colors.surface.raised" borderRadius="$md">
                <Text fontWeight="$semibold">D</Text>
              </Box>
            </Box>
          </DemoSection>

          {/* M-6 demo — transform style props (1.7) */}
          <DemoSection title="Transform — M-6 (1.7) hover lift + active press">
            <Text color="$colors.text.muted" fontSize="$sm">
              `transform` and friends are first-class style props as of 1.7. Compose with
              `transition` and the existing `_hover` / `_active` bags to drive interaction feedback
              without a className bridge. Hover and click each card.
            </Text>
            <HStack gap="$3" flexWrap="wrap">
              <Box
                p="$4"
                bg="$colors.surface.raised"
                borderWidth={1}
                borderStyle="solid"
                borderColor="$colors.border.default"
                borderRadius="$md"
                cursor="pointer"
                transition="transform 160ms ease, border-color 160ms ease"
                _hover={{ transform: 'translateY(-2px)', borderColor: '$colors.action.primary.bg' }}
                _active={{ transform: 'scale(0.985)' }}
              >
                <Text fontWeight="$semibold">Lift on hover</Text>
                <Text color="$colors.text.muted" fontSize="$sm">
                  translateY(-2px)
                </Text>
              </Box>
              <Box
                p="$4"
                bg="$colors.surface.raised"
                borderWidth={1}
                borderStyle="solid"
                borderColor="$colors.border.default"
                borderRadius="$md"
                cursor="pointer"
                transformOrigin="center"
                transition="transform 200ms ease"
                _hover={{ transform: 'rotate(-1deg) scale(1.02)' }}
                _active={{ transform: 'rotate(0deg) scale(0.985)' }}
              >
                <Text fontWeight="$semibold">Tilt + scale</Text>
                <Text color="$colors.text.muted" fontSize="$sm">
                  composed transform chain
                </Text>
              </Box>
            </HStack>
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
