import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { VStack } from 'usemotif';
import { TreeView, type TreeNode } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// TreeView flattens a nested `data` tree (TreeNode<T>: id/label/children?/
// disabled?) into the visible rows for the current expansion, applies the
// ARIA tree pattern (role=tree/treeitem, aria-level/expanded/selected), and
// runs arrow-key nav. `renderNode` draws each row from { node, depth,
// isExpanded, isSelected, isFocused, toggle, select }. Selection is
// controlled (`value`/`onValueChange`) or uncontrolled (`defaultValue`);
// `defaultExpanded` seeds open ids.
const DATA: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
        ],
      },
      { id: 'index', label: 'index.ts' },
      { id: 'legacy', label: 'legacy.ts', disabled: true },
    ],
  },
  {
    id: 'tests',
    label: 'tests',
    children: [{ id: 'button-test', label: 'Button.test.tsx' }],
  },
  { id: 'readme', label: 'README.md' },
];

const TREE: CSSProperties = {
  display: 'inline-block',
  minWidth: 240,
  padding: 8,
  borderRadius: 10,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  background: 'var(--colors-surface-base, #ffffff)',
  outline: 'none',
};

function rowStyle(isSelected: boolean, isFocused: boolean, disabled: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: isSelected ? 'var(--colors-surface-muted, #eff6ff)' : 'transparent',
    color: isSelected
      ? 'var(--colors-action-primary-bg, #2563eb)'
      : 'var(--colors-text-default, #111827)',
    fontWeight: isSelected ? 600 : 400,
    outline: isFocused ? '1px solid var(--colors-action-primary-bg, #3b82f6)' : 'none',
    opacity: disabled ? 0.45 : 1,
  };
}

/**
 * TreeView - flattens a nested `data` tree into the rows visible for the
 * current expansion, applies the ARIA tree pattern
 * (`role="tree"`/`"treeitem"`, `aria-level`/`-expanded`/`-selected`), and
 * handles arrow-key nav (Up/Down move, Right/Left expand/collapse,
 * Enter/Space select). `renderNode` draws each row from
 * `{ node, depth, isExpanded, isSelected, isFocused, toggle, select }`.
 * Selection is controlled (`value`/`onValueChange`) or uncontrolled
 * (`defaultValue`); `defaultExpanded` seeds open ids. Nodes are
 * `{ id, label, children?, disabled?, data? }`.
 */
const meta = {
  title: 'Specialized/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  argTypes: {
    data: { control: false },
    renderNode: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    defaultExpanded: { control: false },
    style: { control: false },
  },
  // TreeView requires `data` + `renderNode`; every story supplies its own via
  // `render`, so these meta-level args are placeholders to satisfy the type.
  args: {
    data: [],
    renderNode: () => <span />,
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderNode({
  node,
  depth,
  isExpanded,
  isSelected,
  isFocused,
  toggle,
  select,
}: {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
  toggle: () => void;
  select: () => void;
}) {
  const hasChildren = node.children !== undefined;
  const disabled = node.disabled === true;
  return (
    // TreeView wires keyboard nav + activation on the parent role="tree"
    // (arrows move, Right/Left expand/collapse, Enter/Space select), and wraps
    // this row in a role="treeitem". The click handler here is a pointer
    // convenience that mirrors that keyboard path, so the row needs no extra
    // keyboard listener or role.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      style={{ ...rowStyle(isSelected, isFocused, disabled), paddingLeft: 8 + depth * 16 }}
      onClick={() => {
        if (disabled) return;
        if (hasChildren) toggle();
        else select();
      }}
    >
      <span aria-hidden="true" style={{ width: 14, color: 'var(--colors-text-muted, #9ca3af)' }}>
        {hasChildren ? (isExpanded ? '▾' : '▸') : ''}
      </span>
      <span>{node.label}</span>
    </div>
  );
}

/** A file tree, top level expanded, with a selected-id readout. */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<string>('button');
      return (
        <VStack gap="$2">
          <TreeView
            data={DATA}
            value={value}
            onValueChange={setValue}
            defaultExpanded={['src', 'components']}
            renderNode={renderNode}
            style={TREE}
            aria-label="Project files"
          />
          <Note>selected = {value}</Note>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** Collapsed - only the roots expanded; nested branches start closed. */
export const Collapsed: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<string>('readme');
      return (
        <TreeView
          data={DATA}
          value={value}
          onValueChange={setValue}
          defaultExpanded={['src']}
          renderNode={renderNode}
          style={TREE}
          aria-label="Project files"
        />
      );
    }
    return <Demo />;
  },
};
