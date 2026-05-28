import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonProps } from 'usemotif';
import { ChevronRight, Plus } from '@usemotif/icons';
import { Matrix } from '../harness/Matrix.js';

const VARIANTS = ['solid', 'outline', 'ghost'] as const;
const INTENTS = ['primary', 'danger', 'success', 'neutral'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Reference story — the copyable pattern for the whole UIKit. It exercises the
 * four per-story features end to end:
 *   1. live prop controls (the `Playground` story, driven by `argTypes`/`args`)
 *   2. copy-paste code snippet (autodocs Source block, per story)
 *   3. exhaustive matrix (`<Matrix>` swept over variant × intent, size, state)
 *   4. theme + sub-theme switch (global toolbar from `.storybook/preview.tsx`)
 */
const meta = {
  title: 'Forms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    intent: { control: 'inline-radio', options: INTENTS },
    size: { control: 'inline-radio', options: SIZES },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
    loadingIcon: { control: false },
  },
  args: {
    children: 'Button',
    variant: 'solid',
    intent: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. The Controls panel drives every prop; the Docs
 *  tab shows the matching JSX snippet auto-generated from args. */
export const Playground: Story = {};

/** variant (rows) × intent (cols) — the full visual cross-product. */
export const VariantIntent: Story = {
  parameters: {
    docs: {
      source: {
        code: '<Button variant="outline" intent="danger">Button</Button>',
      },
    },
  },
  render: () => (
    <Matrix<ButtonProps>
      base={{ children: 'Button' } as Partial<ButtonProps>}
      rows={{ prop: 'variant', values: VARIANTS }}
      cols={{ prop: 'intent', values: INTENTS }}
      render={(p) => <Button {...p} />}
    />
  ),
};

/** Every size, solid/primary. */
export const Sizes: Story = {
  render: () => (
    <Matrix<ButtonProps>
      base={{ children: 'Button' } as Partial<ButtonProps>}
      cols={{ prop: 'size', values: SIZES }}
      render={(p) => <Button {...p} />}
    />
  ),
};

/** Interaction + busy states. */
export const States: Story = {
  render: () => (
    <Matrix<ButtonProps>
      base={{ children: 'Button' } as Partial<ButtonProps>}
      cols={{
        prop: 'intent',
        values: ['primary', 'danger'] as const,
      }}
      rows={{
        prop: 'variant',
        values: VARIANTS,
      }}
      render={(p) => <Button {...p} />}
    />
  ),
};

/** Disabled / loading / icon-composition slots. */
export const Composition: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button leadingIcon={<Plus />}>Add item</Button>
      <Button trailingIcon={<ChevronRight />}>Continue</Button>
      <Button intent="danger" disabled>
        Disabled
      </Button>
      <Button loading>Loading</Button>
      <Button loading loadingLabel="Saving…">
        Save
      </Button>
    </div>
  ),
};
