import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Box, HStack, Text, VirtualList, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

// NOTE: Motif has no standalone `List` primitive. The data-driven list
// component is `VirtualList` - a `data` + `renderItem` list that falls back to
// a plain ScrollView render under its virtualisation threshold (and swaps in a
// registered virtualiser, e.g. react-virtuoso, above it). These stories cover
// that real API. (`List` also appears only as a compound sub-component on
// headless primitives - Tabs.List, Combobox.List, Select.List - which belong
// with those components, not here.)

interface Person {
  id: number;
  name: string;
  role: string;
}

const PEOPLE: Person[] = [
  { id: 1, name: 'Jane Doe', role: 'Design' },
  { id: 2, name: 'Anil Kumar', role: 'Engineering' },
  { id: 3, name: 'Mei Chen', role: 'Product' },
  { id: 4, name: 'Sam Rivera', role: 'Engineering' },
  { id: 5, name: 'Priya Patel', role: 'Design' },
  { id: 6, name: 'Tom Becker', role: 'Sales' },
];

/**
 * VirtualList - Motif's data-driven list primitive (there's no plain `List`).
 * Pass `data` plus a `renderItem` callback; `keyOf` supplies a stable key and
 * `itemHeight` hints row size for virtualised renderers. It extends
 * `ScrollView`, so Box style props (`maxHeight`, `gap`, ...) apply to the
 * container. Without a registered virtualiser it renders every row inside a
 * ScrollView - fine for the short lists shown here.
 */
const meta = {
  title: 'Media/List',
  component: VirtualList,
  tags: ['autodocs'],
  // VirtualList requires `data` + `renderItem`; every story below supplies its
  // own via `render`, so these meta-level args are just placeholders to satisfy
  // the type. They never render.
  args: {
    data: [] as readonly unknown[],
    renderItem: () => null,
  },
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A simple text list - `data` of strings, one `renderItem` per row. */
export const Simple: Story = {
  render: () => (
    <Box w={280} borderWidth={1} borderColor="$colors.surface.muted" borderRadius="$md" p="$2">
      <VirtualList<string>
        data={['Inbox', 'Drafts', 'Sent', 'Spam', 'Trash']}
        keyOf={(item) => item}
        renderItem={(item) => (
          <Text px="$2" py="$2">
            {item}
          </Text>
        )}
      />
    </Box>
  ),
};

/**
 * A richer list - each row composes an Avatar with two lines of text, keyed by
 * a stable `id`. The container is scroll-capped via `maxHeight`.
 */
export const People: Story = {
  render: () => (
    <Box w={320} borderWidth={1} borderColor="$colors.surface.muted" borderRadius="$md">
      <VirtualList<Person>
        data={PEOPLE}
        keyOf={(p) => p.id}
        itemHeight={56}
        maxHeight={240}
        renderItem={(p) => (
          <HStack
            gap="$3"
            alignItems="center"
            px="$3"
            py="$2"
            borderBottomWidth={1}
            borderColor="$colors.surface.muted"
          >
            <Avatar size="sm" name={p.name} />
            <VStack gap={0}>
              <Text fontWeight="$semibold">{p.name}</Text>
              <Text fontSize="$sm" color="$colors.text.muted">
                {p.role}
              </Text>
            </VStack>
          </HStack>
        )}
      />
      <Note>data + renderItem; keyed by id, row height hinted via itemHeight.</Note>
    </Box>
  ),
};
