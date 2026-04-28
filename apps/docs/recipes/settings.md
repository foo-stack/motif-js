# Settings page

A multi-section settings page with vertical tabbed nav. Sections live
on the same URL with the active tab in the URL hash so users can
deep-link.

## Shell

Two-column layout — vertical tabs on the left, the active tab's panel
on the right. Single tab on mobile (the panel scrolls naturally; the
tab list collapses to a top-bar dropdown).

```tsx
import { Box, Heading, HStack, Show, Hide, Stack, Text, VStack } from '@motif-js/react';
import { Tabs, Select } from '@motif-js/headless';
import { useState } from 'react';

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
  { id: 'api-keys', label: 'API keys' },
];

export function SettingsPage() {
  const [active, setActive] = useState('profile');

  return (
    <Box maxW={1100} mx="auto" p={{ base: '$4', md: '$6' }}>
      <Heading as="h1" mb="$6">
        Settings
      </Heading>
      <Tabs.Root value={active} onValueChange={setActive} orientation="vertical">
        <HStack alignItems="stretch" gap={{ base: '$0', md: '$8' }}>
          <Hide below="md">
            <Tabs.List>
              <VStack gap="$1" w={220}>
                {SECTIONS.map((s) => (
                  <Tabs.Tab key={s.id} value={s.id}>
                    <SectionTab label={s.label} active={active === s.id} />
                  </Tabs.Tab>
                ))}
              </VStack>
            </Tabs.List>
          </Hide>
          <Show below="md">
            <Box mb="$4">
              <Select.Root
                options={SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
                value={active}
                onValueChange={(v) => setActive(v as string)}
              >
                <Select.Trigger>
                  <Button>{SECTIONS.find((s) => s.id === active)?.label}</Button>
                </Select.Trigger>
                <Select.List />
              </Select.Root>
            </Box>
          </Show>

          <Box flex={1}>
            <Tabs.Panel value="profile">
              <ProfileSection />
            </Tabs.Panel>
            <Tabs.Panel value="account">
              <AccountSection />
            </Tabs.Panel>
            <Tabs.Panel value="notifications">
              <NotificationsSection />
            </Tabs.Panel>
            <Tabs.Panel value="billing">
              <BillingSection />
            </Tabs.Panel>
            <Tabs.Panel value="team">
              <TeamSection />
            </Tabs.Panel>
            <Tabs.Panel value="api-keys">
              <ApiKeysSection />
            </Tabs.Panel>
          </Box>
        </HStack>
      </Tabs.Root>
    </Box>
  );
}

function SectionTab({ label, active }: { label: string; active: boolean }) {
  return (
    <Box
      px="$3"
      py="$2"
      borderRadius="$md"
      bg={active ? '$colors.brand.50' : 'transparent'}
      color={active ? '$colors.brand.700' : '$colors.text.default'}
      fontWeight={active ? '$semibold' : '$normal'}
      _hover={{ bg: active ? '$colors.brand.50' : '$colors.surface.hover' }}
    >
      {label}
    </Box>
  );
}
```

The `Tabs` headless gives us:

- `aria-orientation="vertical"` on the tablist.
- `role="tab"` + `aria-selected` per tab.
- ArrowDown / ArrowUp navigation between tabs (vertical orientation).
- `role="tabpanel"` on each panel, hidden when not active.

## Profile section

Avatar uploader + name + bio + a save button at the bottom.

```tsx
import {
  Avatar,
  Button,
  Field,
  HStack,
  Heading,
  Input,
  Label,
  Stack,
  Text,
  TextArea,
  VStack,
} from '@motif-js/react';
import { useToast } from '@motif-js/headless';
import { useState } from 'react';

function ProfileSection() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    bio: 'Working on the future of styling.',
    avatarSrc: 'https://example.com/avatar.jpg',
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.updateProfile(profile);
      toast({ title: 'Profile saved' });
    } catch (err) {
      toast({ title: 'Save failed', description: err.message, type: 'foreground' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <VStack gap="$5" alignItems="stretch">
      <Heading as="h2" fontSize="$2xl">
        Profile
      </Heading>
      <SectionCard>
        <HStack gap="$4" alignItems="center">
          <Avatar src={profile.avatarSrc} name={profile.name} size="xl" />
          <VStack gap="$2">
            <Button variant="outline" size="sm">
              Change photo
            </Button>
            <Text fontSize="$sm" color="$colors.text.muted">
              JPG / PNG, 512px+
            </Text>
          </VStack>
        </HStack>
      </SectionCard>
      <SectionCard>
        <Stack gap="$4">
          <Field>
            <Label>Display name</Label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Field>
          <Field>
            <Label>Bio</Label>
            <TextArea
              rows={3}
              autoSize
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </Field>
        </Stack>
      </SectionCard>
      <HStack justifyContent="flex-end">
        <Button loading={saving} loadingLabel="Saving…" onPress={save}>
          Save changes
        </Button>
      </HStack>
    </VStack>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      p="$5"
      bg="$colors.surface.base"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$colors.border.subtle"
    >
      {children}
    </Box>
  );
}
```

## Notifications section

Switches grouped by category. Demonstrates the `Switch` headless +
inline labels.

```tsx
import { Switch } from '@motif-js/headless';
import { Field, HStack, Heading, Label, Stack, Text, VStack } from '@motif-js/react';
import { useState } from 'react';

const PREFS = [
  { id: 'product-updates', label: 'Product updates', help: 'New features and changelog.' },
  { id: 'billing', label: 'Billing', help: 'Invoices and payment receipts.' },
  { id: 'security', label: 'Security alerts', help: 'New sign-ins and unusual activity.' },
  { id: 'marketing', label: 'Marketing', help: 'Newsletters and announcements.' },
];

function NotificationsSection() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    'product-updates': true,
    billing: true,
    security: true,
    marketing: false,
  });

  return (
    <VStack gap="$5" alignItems="stretch">
      <Heading as="h2" fontSize="$2xl">
        Email notifications
      </Heading>
      <SectionCard>
        <Stack gap="$4">
          {PREFS.map((p) => (
            <HStack key={p.id} alignItems="flex-start" gap="$3">
              <Switch
                id={p.id}
                checked={prefs[p.id] ?? false}
                onChange={(e) => setPrefs((prev) => ({ ...prev, [p.id]: e.target.checked }))}
              />
              <VStack gap="$1" flex={1}>
                <Label htmlFor={p.id} fontWeight="$semibold">
                  {p.label}
                </Label>
                <Text fontSize="$sm" color="$colors.text.muted">
                  {p.help}
                </Text>
              </VStack>
            </HStack>
          ))}
        </Stack>
      </SectionCard>
    </VStack>
  );
}
```

## Account section — destructive zone

Shows the AlertDialog pattern for destructive actions.

```tsx
import { AlertDialog } from '@motif-js/headless';
import { Button, Field, Input, Label, Stack, Heading, Text, VStack } from '@motif-js/react';

function AccountSection() {
  return (
    <VStack gap="$5" alignItems="stretch">
      <Heading as="h2" fontSize="$2xl">
        Account
      </Heading>
      <SectionCard>
        <Stack gap="$4">
          <Field>
            <Label>Email</Label>
            <Input type="email" value="jane@example.com" readOnly />
          </Field>
          <Button variant="outline">Change email</Button>
        </Stack>
      </SectionCard>

      <SectionCard>
        <Stack gap="$3">
          <Heading as="h3" fontSize="$lg" color="$colors.danger.700">
            Danger zone
          </Heading>
          <Text color="$colors.text.muted">
            Deleting your account is permanent. All data is removed within 30 days.
          </Text>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button intent="danger" variant="outline">
                Delete account
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Title>Delete account?</AlertDialog.Title>
              <AlertDialog.Description>
                This is permanent. Your projects, billing, and data will be removed.
              </AlertDialog.Description>
              <HStack gap="$2" justifyContent="flex-end" mt="$4">
                <AlertDialog.Close>
                  <Button variant="ghost">Cancel</Button>
                </AlertDialog.Close>
                <AlertDialog.Close>
                  <Button intent="danger">Delete forever</Button>
                </AlertDialog.Close>
              </HStack>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Stack>
      </SectionCard>
    </VStack>
  );
}
```

`AlertDialog` (vs Dialog) sets `role="alertdialog"` and disables
scrim-click dismiss — destructive actions require an explicit
acknowledgement.

## Billing / Team / API-keys

These follow the same pattern: each section is a stack of `SectionCard`s
with the inputs / actions specific to that section. See the docs site
for full implementations of all six sections.

## URL hash sync

Wire the active tab to the URL so users can deep-link:

```tsx
import { useEffect, useState } from 'react';

function useHashSync(initial: string): [string, (s: string) => void] {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial;
    return window.location.hash.slice(1) || initial;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onChange = () => setValue(window.location.hash.slice(1) || initial);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [initial]);
  function set(next: string) {
    setValue(next);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${next}`);
    }
  }
  return [value, set];
}
```

Then drop it in:

```tsx
const [active, setActive] = useHashSync('profile');
```

Now `/settings#notifications` jumps straight to the Notifications tab.

## Cross-platform notes

For RN apps, replace the vertical tab list with a horizontal scrolling
tab bar at the top, or pivot to a `Drawer`-style menu. The tabs
`headless` component works the same; only the visual treatment
changes. URL hash sync is replaced by your navigator's state.

## See also

- [Tabs (headless)](../headless/disclosure) — under-the-hood.
- [Forms (primitive)](../primitives/forms) — `Field`, `Input`, `TextArea`.
- [Switch (headless)](../headless/toggle) — preference toggles.
