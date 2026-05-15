import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'page', label: 'page', defaultValue: 4, min: 1, max: 12 },
];

function code(state: ControlState): string {
  return `import { Pagination } from 'usemotif/headless';

<Pagination
  page={${Number(state.page)}}
  total={12}
  onPageChange={setPage}
  renderItem={(info) => <PageButton {...info} />}
/>`;
}

function cell(label: string, active = false, muted = false) {
  return (
    <span
      style={{
        minWidth: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        background: active ? '#1D4ED8' : 'transparent',
        color: active ? '#FBF7F2' : muted ? 'var(--colors-fg-faint)' : 'var(--colors-fg-default)',
        border: active ? 'none' : '1px solid var(--colors-line-base)',
      }}
    >
      {label}
    </span>
  );
}

function preview(state: ControlState) {
  const page = Number(state.page);
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: 4 }}>
      {cell('‹', false, page <= 1)}
      {cell('1', page === 1)}
      {cell('…', false, true)}
      {cell(String(page), true)}
      {cell('…', false, true)}
      {cell('12', page === 12)}
      {cell('›')}
    </nav>
  );
}

export const paginationDemo: PlaygroundDemo = {
  label: 'Pagination',
  code,
  preview,
  controls,
};
