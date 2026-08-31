import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from '@usemotif/headless';
import { ChevronRight } from '@usemotif/icons';

// Breadcrumb wraps its element children in a <nav><ol>, inserting the
// `separator` between items and marking the last item `aria-current="page"`.
// Children are plain anchors/spans; the component owns the list structure.
const linkStyle = {
  color: 'var(--colors-action-primary-bg, #3b82f6)',
  textDecoration: 'none',
  padding: '0 6px',
};
const currentStyle = {
  color: 'var(--colors-text-muted, #6b7280)',
  padding: '0 6px',
};

/**
 * Breadcrumb - a `nav` landmark wrapping an `ol`. Pass element children
 * (links and a trailing label); the component inserts `separator` between
 * them and tags the last child `aria-current="page"`. `aria-label` names
 * the landmark; `separator` accepts any node.
 */
const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: false },
    style: { control: false },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default slash separator. */
export const Playground: Story = {
  render: () => (
    <Breadcrumb aria-label="Breadcrumb" style={{ display: 'flex' }}>
      <a href="https://usemotif.dev" style={linkStyle}>
        Home
      </a>
      <a href="https://usemotif.dev/library" style={linkStyle}>
        Library
      </a>
      <a href="https://usemotif.dev/library/data" style={linkStyle}>
        Data
      </a>
      <span style={currentStyle}>Reports</span>
    </Breadcrumb>
  ),
};

/** A custom icon separator. */
export const IconSeparator: Story = {
  render: () => (
    <Breadcrumb
      aria-label="Breadcrumb"
      separator={
        <ChevronRight
          aria-hidden
          style={{
            width: 14,
            height: 14,
            verticalAlign: 'middle',
            color: 'var(--colors-text-muted, #9ca3af)',
          }}
        />
      }
      style={{ display: 'flex' }}
    >
      <a href="https://usemotif.dev/projects" style={linkStyle}>
        Projects
      </a>
      <a href="https://usemotif.dev/projects/motif" style={linkStyle}>
        Motif
      </a>
      <span style={currentStyle}>Settings</span>
    </Breadcrumb>
  ),
};

/** Two levels - minimal trail. */
export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb aria-label="Breadcrumb" style={{ display: 'flex' }}>
      <a href="https://usemotif.dev/docs" style={linkStyle}>
        Docs
      </a>
      <span style={currentStyle}>Getting started</span>
    </Breadcrumb>
  ),
};
