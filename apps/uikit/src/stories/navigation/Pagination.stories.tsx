import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { VStack } from 'usemotif';
import { Pagination } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Pagination is controlled-only: pass `page`, `total`, `onPageChange`. It
// computes a windowed page list (with `ellipsis`) and calls `renderItem`
// for every cell — previous / next / page / ellipsis. The story owns the
// page state and supplies the button visuals via renderItem.
function itemStyle(selected: boolean, disabled: boolean): CSSProperties {
  return {
    minWidth: 34,
    height: 34,
    padding: '0 8px',
    margin: '0 2px',
    borderRadius: 8,
    border: '1px solid var(--colors-border-default, #e5e7eb)',
    background: selected
      ? 'var(--colors-action-primary-bg, #3b82f6)'
      : 'var(--colors-surface-base, #ffffff)',
    color: selected ? 'var(--colors-action-primary-fg, #ffffff)' : 'var(--colors-text-default, #111827)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  };
}

/**
 * Pagination — controlled-only. Supply `page`, `total`, and `onPageChange`;
 * an optional `siblings` count controls how many pages sit either side of
 * the current one (the rest collapse to `ellipsis`). Every cell is drawn by
 * `renderItem`, which receives `{ type, page?, disabled, selected, onClick }`
 * for `previous` / `next` / `page` / `ellipsis`. Renders inside a `nav`
 * landmark.
 */
const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    renderItem: { control: false },
    style: { control: false },
    siblings: { control: { type: 'number' } },
    total: { control: { type: 'number' } },
  },
  // Pagination requires `page`, `total`, and `renderItem`; every story below
  // supplies its own via `render`, so these meta-level args are placeholders
  // to satisfy the type. They never render.
  args: {
    page: 1,
    total: 1,
    renderItem: () => <span />,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationDemo({ total, siblings = 1 }: { total: number; siblings?: number }) {
  const [page, setPage] = useState(4);
  return (
    <VStack gap="$2">
      <Note>page {page} of {total}</Note>
      <Pagination
        page={page}
        total={total}
        siblings={siblings}
        onPageChange={setPage}
        style={{ display: 'flex', alignItems: 'center' }}
        renderItem={({ type, page: p, disabled, selected, onClick }) => {
          if (type === 'ellipsis') {
            return (
              <span aria-hidden="true" style={{ padding: '0 6px', color: 'var(--colors-text-muted, #6b7280)' }}>
                …
              </span>
            );
          }
          const label =
            type === 'previous' ? 'Previous page' : type === 'next' ? 'Next page' : `Go to page ${p}`;
          return (
            <button
              type="button"
              aria-label={label}
              aria-current={selected ? 'page' : undefined}
              disabled={disabled}
              onClick={onClick}
              style={itemStyle(selected, disabled)}
            >
              {type === 'previous' ? '‹' : type === 'next' ? '›' : p}
            </button>
          );
        }}
      />
    </VStack>
  );
}

/** A wide range — windowed with leading/trailing ellipses. */
export const Playground: Story = {
  render: () => <PaginationDemo total={20} siblings={1} />,
};

/** Few pages (≤7) — no ellipsis, every page shown. */
export const FewPages: Story = {
  render: () => <PaginationDemo total={5} />,
};

/** More siblings around the current page. */
export const WideSiblings: Story = {
  render: () => <PaginationDemo total={20} siblings={2} />,
};
