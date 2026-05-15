import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { TreeView } from 'usemotif/headless';

<TreeView
  data={fileTree}
  defaultExpanded={['src']}
  onValueChange={openFile}
  renderNode={(info) => <FileRow {...info} />}
/>`;
}

function row(
  label: string,
  depth: number,
  opts: { folder?: boolean; open?: boolean; selected?: boolean } = {},
) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        paddingLeft: 8 + depth * 16,
        borderRadius: 5,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        background: opts.selected ? 'var(--colors-surface-muted)' : 'transparent',
        color: 'var(--colors-fg-default)',
      }}
    >
      <span style={{ fontSize: 10, width: 10 }}>{opts.folder ? (opts.open ? '▾' : '▸') : ''}</span>
      {opts.folder ? '📁' : '📄'} {label}
    </span>
  );
}

function preview() {
  return (
    <div
      role="tree"
      style={{
        width: 200,
        border: '1px solid var(--colors-line-base)',
        borderRadius: 8,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {row('src', 0, { folder: true, open: true })}
      {row('components', 1, { folder: true, open: false })}
      {row('index.ts', 1, { selected: true })}
      {row('README.md', 0)}
    </div>
  );
}

export const treeViewDemo: PlaygroundDemo = { label: 'TreeView', code, preview };
