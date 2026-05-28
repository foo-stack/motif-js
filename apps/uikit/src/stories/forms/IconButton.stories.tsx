import type { Meta, StoryObj } from '@storybook/react';
import { IconButton, type IconButtonProps } from 'usemotif';
import { Heart, Pencil, Plus, Settings, Trash } from '@usemotif/icons';
import { Matrix } from '../../harness/Matrix.js';

const VARIANTS = ['solid', 'outline', 'ghost'] as const;
const INTENTS = ['primary', 'danger', 'success', 'neutral'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Square interactive primitive for icon-only actions — the same
 * variant × intent × size matrix as Button, but a fixed aspect ratio
 * with a centered, `aria-hidden` icon. `aria-label` is REQUIRED: the
 * meaning lives in the label, not the glyph.
 *
 * Pass the icon either via the `icon` prop or as the single child.
 * Icons come from `@usemotif/icons`.
 */
const meta = {
  title: 'Forms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    intent: { control: 'inline-radio', options: INTENTS },
    size: { control: 'inline-radio', options: SIZES },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'aria-label': { control: 'text' },
    icon: { control: false },
    children: { control: false },
  },
  args: {
    variant: 'solid',
    intent: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    'aria-label': 'Add item',
    icon: <Plus />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {};

/** variant (rows) × intent (cols) — the full visual cross-product. */
export const VariantIntent: Story = {
  parameters: {
    docs: {
      source: {
        code: '<IconButton aria-label="Add item" variant="outline" intent="danger" icon={<Plus />} />',
      },
    },
  },
  render: () => (
    <Matrix<IconButtonProps>
      base={{ 'aria-label': 'Add item', icon: <Plus /> } as Partial<IconButtonProps>}
      rows={{ prop: 'variant', values: VARIANTS }}
      cols={{ prop: 'intent', values: INTENTS }}
      render={(p) => <IconButton {...(p as IconButtonProps)} />}
    />
  ),
};

/** Every size, solid/primary. */
export const Sizes: Story = {
  render: () => (
    <Matrix<IconButtonProps>
      base={{ 'aria-label': 'Settings', icon: <Settings /> } as Partial<IconButtonProps>}
      cols={{ prop: 'size', values: SIZES }}
      render={(p) => <IconButton {...(p as IconButtonProps)} />}
    />
  ),
};

/** Loading + disabled states. `loading` also disables and sets `aria-busy`. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <IconButton aria-label="Edit" icon={<Pencil />} />
      <IconButton aria-label="Delete" intent="danger" icon={<Trash />} />
      <IconButton aria-label="Favourite" intent="danger" variant="outline" icon={<Heart />} />
      <IconButton aria-label="Loading" loading icon={<Plus />} />
      <IconButton aria-label="Disabled" disabled icon={<Plus />} />
    </div>
  ),
};

/** Icon passed as a child instead of the `icon` prop — both are accepted. */
export const ChildIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton aria-label="Add item">
        <Plus />
      </IconButton>
      <IconButton aria-label="Settings" variant="ghost" intent="neutral">
        <Settings />
      </IconButton>
    </div>
  ),
};
