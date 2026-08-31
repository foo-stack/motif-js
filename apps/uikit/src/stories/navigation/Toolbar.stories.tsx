import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { Toolbar } from '@usemotif/headless';
import { Bold, Italic, Underline } from '@usemotif/icons';

// Toolbar renders role="toolbar" and adds roving arrow-key focus across its
// focusable children (buttons / tabindex>=0). It's purely behavioural - the
// children supply all visuals. orientation switches Arrow keys between
// horizontal (Left/Right) and vertical (Up/Down); Home/End jump to ends.
const wrap: CSSProperties = {
  display: 'inline-flex',
  gap: 2,
  padding: 4,
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  background: 'var(--colors-surface-base, #ffffff)',
};
const btn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--colors-text-default, #111827)',
  cursor: 'pointer',
};

/**
 * Toolbar - a `role="toolbar"` container that adds roving arrow-key focus
 * across its focusable children (Home/End jump to the ends). It adds no
 * visuals; children own their look. `orientation` selects which arrow keys
 * move focus (`horizontal` → Left/Right, `vertical` → Up/Down). Give it an
 * `aria-label`.
 */
const meta = {
  title: 'Navigation/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
    style: { control: false },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Horizontal text-formatting toolbar; arrow keys rove focus. */
export const Playground: Story = {
  render: () => (
    <Toolbar aria-label="Text formatting" style={wrap}>
      <button type="button" aria-label="Bold" style={btn}>
        <Bold size={16} />
      </button>
      <button type="button" aria-label="Italic" style={btn}>
        <Italic size={16} />
      </button>
      <button type="button" aria-label="Underline" style={btn}>
        <Underline size={16} />
      </button>
    </Toolbar>
  ),
};

/** Vertical orientation - Up/Down rove focus. */
export const Vertical: Story = {
  render: () => (
    <Toolbar
      aria-label="Text formatting"
      orientation="vertical"
      style={{ ...wrap, flexDirection: 'column' }}
    >
      <button type="button" aria-label="Bold" style={btn}>
        <Bold size={16} />
      </button>
      <button type="button" aria-label="Italic" style={btn}>
        <Italic size={16} />
      </button>
      <button type="button" aria-label="Underline" style={btn}>
        <Underline size={16} />
      </button>
    </Toolbar>
  ),
};

/** A disabled control is skipped by roving focus. */
export const WithDisabled: Story = {
  render: () => (
    <Toolbar aria-label="Text formatting" style={wrap}>
      <button type="button" aria-label="Bold" style={btn}>
        <Bold size={16} />
      </button>
      <button
        type="button"
        aria-label="Italic"
        disabled
        style={{ ...btn, opacity: 0.4, cursor: 'not-allowed' }}
      >
        <Italic size={16} />
      </button>
      <button type="button" aria-label="Underline" style={btn}>
        <Underline size={16} />
      </button>
    </Toolbar>
  ),
};
