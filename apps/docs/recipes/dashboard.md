# Dashboard

App shell with a sidebar nav, top header, and a responsive stat grid
plus activity feed. The shell is the part you'd lift into a route
layout in Next.js / Remix; the dashboard content swaps inside.

## Shell — sidebar + header + main

```tsx
import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  Hide,
  IconButton,
  Link,
  ScrollView,
  Show,
  Stack,
  Text,
  VStack,
} from '@motif-js/react';
import { Bell, Menu, Search, Settings } from '@motif-js/icons';
import { Drawer } from '@motif-js/headless';
import { useState } from 'react';
import type { ReactNode } from 'react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'team', label: 'Team', href: '/team' },
  { id: 'reports', label: 'Reports', href: '/reports' },
  { id: 'settings', label: 'Settings', href: '/settings' },
];

export function DashboardShell({
  current,
  user,
  children,
}: {
  current: string;
  user: { name: string; avatarSrc?: string };
  children: ReactNode;
}) {
  return (
    <Box minH="100vh" bg="$colors.surface.muted">
      {/* Desktop layout — sidebar + main */}
      <HStack alignItems="stretch" minH="100vh">
        <Hide below="md">
          <SidebarNav current={current} />
        </Hide>
        <VStack flex={1} alignItems="stretch">
          <TopHeader user={user} />
          <ScrollView flex={1}>
            <Box p={{ base: '$4', md: '$6' }} maxW={1400} mx="auto" w="100%">
              {children}
            </Box>
          </ScrollView>
        </VStack>
      </HStack>
    </Box>
  );
}

function SidebarNav({ current }: { current: string }) {
  return (
    <VStack
      w={240}
      p="$4"
      bg="$colors.surface.base"
      borderRightWidth={1}
      borderColor="$colors.border.subtle"
    >
      <HStack alignItems="center" gap="$2" mb="$6">
        <Box w={32} h={32} borderRadius="$md" bg="$colors.brand.500" />
        <Heading as="h3">Acme</Heading>
      </HStack>
      <VStack gap="$1">
        {NAV.map((item) => {
          const active = item.id === current;
          return (
            <Link
              key={item.id}
              href={item.href}
              px="$3"
              py="$2"
              borderRadius="$md"
              bg={active ? '$colors.brand.50' : 'transparent'}
              color={active ? '$colors.brand.700' : '$colors.text.default'}
              fontWeight={active ? '$semibold' : '$normal'}
              _hover={{ bg: '$colors.surface.hover' }}
            >
              {item.label}
            </Link>
          );
        })}
      </VStack>
    </VStack>
  );
}

function TopHeader({ user }: { user: { name: string; avatarSrc?: string } }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <HStack
      px={{ base: '$4', md: '$6' }}
      py="$3"
      bg="$colors.surface.base"
      borderBottomWidth={1}
      borderColor="$colors.border.subtle"
      alignItems="center"
      gap="$3"
    >
      {/* Mobile drawer trigger */}
      <Show below="md">
        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger>
            <IconButton aria-label="Menu" icon={<Menu />} variant="ghost" />
          </Drawer.Trigger>
          <Drawer.Content side="left">
            <SidebarNav current="dashboard" />
          </Drawer.Content>
        </Drawer.Root>
      </Show>
      <Heading as="h2" fontSize="$xl">
        Dashboard
      </Heading>
      <Box flex={1} />
      <Hide below="sm">
        <Box position="relative" w={280}>
          <Box position="absolute" left={12} top="50%" transform="translateY(-50%)">
            <Search color="$colors.text.muted" />
          </Box>
          <Input pl={36} placeholder="Search…" />
        </Box>
      </Hide>
      <IconButton aria-label="Notifications" icon={<Bell />} variant="ghost" />
      <Avatar src={user.avatarSrc} name={user.name} size="sm" />
    </HStack>
  );
}
```

### Layout patterns

- **`<Hide below="md">` / `<Show below="md">`** — render the sidebar
  only on `md+` screens; render the mobile drawer trigger only below
  `md`. Same primitives swap in / out on viewport change.
- **Mobile drawer** — `<Drawer.Root>` + `<Drawer.Content side="left">`
  reuses the same `<SidebarNav>` markup. The Drawer's focus trap +
  scrim dismiss come from `@motif-js/headless`.
- **Header search** — only shown on `sm+` screens; smaller viewports
  pivot to an icon-button-driven search modal.

## Dashboard content — stat grid + activity

```tsx
import { Container, Grid, Heading, Stack, Text, VStack } from '@motif-js/react';

export function DashboardPage() {
  return (
    <Stack gap="$6">
      <Heading as="h1">Welcome back, Jane</Heading>

      {/* Stat grid — responsive columns via container queries */}
      <Container name="stats">
        <Grid
          gap="$3"
          templateColumns={{
            '@stats.base': '1fr',
            '@stats.md': 'repeat(2, 1fr)',
            '@stats.lg': 'repeat(4, 1fr)',
          }}
        >
          <StatCard label="Revenue" value="$84,200" trend="+12%" />
          <StatCard label="Active users" value="3,201" trend="+4%" />
          <StatCard label="Sign-ups" value="142" trend="-2%" trendNegative />
          <StatCard label="MRR growth" value="$12.4k" trend="+18%" />
        </Grid>
      </Container>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="$4">
        <Card title="Activity">
          <ActivityFeed />
        </Card>
        <Card title="Recent projects">
          <ProjectList />
        </Card>
      </Grid>
    </Stack>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendNegative = false,
}: {
  label: string;
  value: string;
  trend: string;
  trendNegative?: boolean;
}) {
  return (
    <VStack
      gap="$1"
      p="$4"
      bg="$colors.surface.base"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$colors.border.subtle"
    >
      <Text color="$colors.text.muted" fontSize="$sm">
        {label}
      </Text>
      <Heading as="h3" fontSize="$2xl">
        {value}
      </Heading>
      <Text color={trendNegative ? '$colors.danger.500' : '$colors.success.500'} fontSize="$sm">
        {trend} vs last month
      </Text>
    </VStack>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack
      gap="$3"
      p="$4"
      bg="$colors.surface.base"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$colors.border.subtle"
    >
      <Heading as="h3" fontSize="$lg">
        {title}
      </Heading>
      {children}
    </VStack>
  );
}
```

### What's interesting

- **Container query for the stat grid** — the grid lives inside the
  `Dashboard` content area which is itself inside the shell's main
  area. As the sidebar opens / closes (or the user resizes a panel
  on a desktop layout), the stat grid reflows from 4 columns → 2 →
  1 based on the _Container's_ width, not the viewport. Resize the
  browser to confirm: collapse the sidebar and the grid stays at 4
  columns even if the viewport is "md" — only the content-area
  width drives the breakpoint.
- **Mixed responsive shapes** — the mid-section `Grid` uses a viewport
  shape (`{ base: '1fr', lg: '2fr 1fr' }`) because the panel split is
  meaningful at the page level. The stat grid uses container shape
  (`{ '@stats.base': '1fr', ... }`) because its column count depends
  on the available content-area width.

## ActivityFeed + ProjectList

These are stand-ins. Replace with your real data shapes:

```tsx
function ActivityFeed() {
  const items = [
    { id: 1, who: 'Alex', what: 'closed PR #142', when: '2m ago' },
    { id: 2, who: 'Mei', what: 'commented on issue #98', when: '12m ago' },
    { id: 3, who: 'Jaya', what: 'pushed 3 commits to main', when: '1h ago' },
  ];
  return (
    <VStack gap="$3" alignItems="stretch">
      {items.map((item) => (
        <HStack key={item.id} gap="$3" alignItems="center">
          <Avatar name={item.who} size="sm" />
          <VStack gap="$0" flex={1}>
            <Text>
              <Text fontWeight="$semibold">{item.who}</Text> {item.what}
            </Text>
            <Text fontSize="$sm" color="$colors.text.muted">
              {item.when}
            </Text>
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
}

function ProjectList() {
  const projects = [
    { id: 1, name: 'Acme Storefront', status: 'In progress' },
    { id: 2, name: 'Internal tooling', status: 'Planning' },
  ];
  return (
    <VStack gap="$2" alignItems="stretch">
      {projects.map((p) => (
        <HStack
          key={p.id}
          p="$3"
          borderRadius="$md"
          _hover={{ bg: '$colors.surface.hover' }}
          justifyContent="space-between"
        >
          <Text fontWeight="$semibold">{p.name}</Text>
          <Text color="$colors.text.muted" fontSize="$sm">
            {p.status}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}
```

## Wiring it up

```tsx
function App() {
  const user = { name: 'Jane Doe', avatarSrc: '…' };
  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
      <DashboardShell current="dashboard" user={user}>
        <DashboardPage />
      </DashboardShell>
    </ThemeProvider>
  );
}
```

## Cross-platform notes

The shell pattern (sidebar + header + scrollable main) maps directly
to RN with one change: replace the `<Hide below="md">` /
`<Show below="md">` pair with a single Drawer that's always available
from a top-bar menu icon — RN apps don't have a desktop sidebar form
factor.

## See also

- [Container queries (guide)](../guides/container-queries) — full
  named-query DSL.
- [Drawer / Sheet (headless)](../headless/drawer) — mobile menu.
- [Settings recipe](./settings) — multi-section forms.
