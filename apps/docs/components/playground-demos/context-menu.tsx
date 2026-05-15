import type { PlaygroundDemo } from './index.js';
import { caption, panel } from './_surface.js';

function code(): string {
  return `import { ContextMenu } from 'usemotif/headless';

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Box>Right-click me</Box>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={cut}>Cut</ContextMenu.Item>
    <ContextMenu.Item onSelect={copy}>Copy</ContextMenu.Item>
    <ContextMenu.Item onSelect={paste}>Paste</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`;
}

function row(label: string) {
  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 5,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        color: 'var(--colors-fg-default)',
      }}
    >
      {label}
    </span>
  );
}

function preview() {
  return (
    <div style={{ position: 'relative', width: 200, height: 130 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          border: '1px dashed var(--colors-line-base)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {caption('right-click region')}
      </div>
      <div
        style={panel({
          position: 'absolute',
          top: 28,
          left: 70,
          display: 'flex',
          flexDirection: 'column',
          padding: 6,
          width: 110,
        })}
      >
        {row('Cut')}
        {row('Copy')}
        {row('Paste')}
      </div>
    </div>
  );
}

export const contextMenuDemo: PlaygroundDemo = { label: 'ContextMenu', code, preview };
