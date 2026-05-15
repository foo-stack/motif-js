import type { PlaygroundDemo } from './index.js';
import { caption, triggerButton } from './_surface.js';

function code(): string {
  return `import { Sheet } from 'usemotif/headless';

<Sheet.Root>
  <Sheet.Trigger><Button>Actions</Button></Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Title>Share</Sheet.Title>
    <ActionList />
  </Sheet.Content>
</Sheet.Root>`;
}

function preview() {
  return (
    <div
      style={{
        width: 200,
        height: 150,
        borderRadius: 10,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'var(--colors-surface-paper)',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        {caption('Bottom sheet')}
        <div style={{ display: 'flex', gap: 8 }}>
          {triggerButton('Copy link')}
          {triggerButton('Email')}
        </div>
      </div>
    </div>
  );
}

export const sheetDemo: PlaygroundDemo = { label: 'Sheet', code, preview };
