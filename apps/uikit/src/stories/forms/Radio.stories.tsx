import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { HStack, Label, VStack } from 'usemotif';
import { Radio, RadioGroup } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Radio is HEADLESS and MUST live inside <RadioGroup> — it reads the shared
// `name` and current value from context and throws if rendered standalone.
// Each Radio is a bare native `<input type="radio">`; the only required prop
// is `value: string`. Styled here with size + theme `accent-color`. Motif
// emits theme tokens as `--<scale>-<path>` CSS custom properties; referenced
// with hex fallbacks.

const RADIO_STYLE: CSSProperties = {
  width: 16,
  height: 16,
  cursor: 'pointer',
  accentColor: 'var(--colors-action-primary-bg, #3b82f6)',
};

/**
 * `Radio` — a single headless radio button. It takes one required prop,
 * `value: string`, plus any native `<input>` attribute (e.g. `disabled`,
 * `id`). It only works inside a `<RadioGroup>`, which supplies the shared
 * `name` and the selected value through context; rendering one on its own
 * throws. The group owns selection state, so individual `Radio`s are
 * effectively controlled by it. Visuals come from `style` / `className`.
 */
// No `component` key: Radio can't render standalone (it throws outside a
// RadioGroup), so there's no meaningful Controls-driven Playground. Stories
// compose it inside a RadioGroup instead.
const meta = {
  title: 'Forms/Radio',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single `Radio` only makes sense inside a `RadioGroup`. Here three share a
 * group; `defaultValue` pre-selects the middle one.
 */
export const InGroup: Story = {
  render: () => (
    <RadioGroup
      aria-label="Size"
      defaultValue="md"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <HStack gap="$2" alignItems="center">
        <Radio id="size-sm" value="sm" style={RADIO_STYLE} />
        <Label htmlFor="size-sm">Small</Label>
      </HStack>
      <HStack gap="$2" alignItems="center">
        <Radio id="size-md" value="md" style={RADIO_STYLE} />
        <Label htmlFor="size-md">Medium</Label>
      </HStack>
      <HStack gap="$2" alignItems="center">
        <Radio id="size-lg" value="lg" style={RADIO_STYLE} />
        <Label htmlFor="size-lg">Large</Label>
      </HStack>
    </RadioGroup>
  ),
};

/** Selected vs unselected vs disabled, side by side. */
export const States: Story = {
  render: () => (
    <RadioGroup aria-label="States" defaultValue="selected" style={{ display: 'flex', gap: 24 }}>
      <HStack gap="$2" alignItems="center">
        <Radio id="st-selected" value="selected" style={RADIO_STYLE} />
        <Label htmlFor="st-selected">Selected</Label>
      </HStack>
      <HStack gap="$2" alignItems="center">
        <Radio id="st-unselected" value="unselected" style={RADIO_STYLE} />
        <Label htmlFor="st-unselected">Unselected</Label>
      </HStack>
      <HStack gap="$2" alignItems="center">
        <Radio id="st-disabled" value="disabled" disabled style={RADIO_STYLE} />
        <Label htmlFor="st-disabled">Disabled</Label>
      </HStack>
    </RadioGroup>
  ),
};

/** Standalone usage throws — Radio requires the RadioGroup context. */
export const RequiresGroup: Story = {
  render: () => (
    <VStack gap="$2">
      <Note>Radio must be inside &lt;RadioGroup&gt; — it throws otherwise.</Note>
      <RadioGroup aria-label="Demo" defaultValue="a">
        <Radio value="a" aria-label="Option A" style={RADIO_STYLE} />
      </RadioGroup>
    </VStack>
  ),
};
