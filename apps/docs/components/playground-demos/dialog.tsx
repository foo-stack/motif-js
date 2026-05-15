import type { PlaygroundDemo } from './index.js';
import { panel, primaryButton, triggerButton } from './_surface.js';

function code(): string {
  return `import { Dialog } from 'usemotif/headless';

<Dialog.Root>
  <Dialog.Trigger>
    <Button>Open dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Confirm save</Dialog.Title>
    <Dialog.Description>
      This overwrites the existing draft.
    </Dialog.Description>
    <Dialog.Close><Button>Cancel</Button></Dialog.Close>
    <Button onClick={save}>Save</Button>
  </Dialog.Content>
</Dialog.Root>`;
}

function preview() {
  return (
    <div
      style={{
        width: 240,
        height: 150,
        borderRadius: 10,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={panel({ display: 'flex', flexDirection: 'column', gap: 8, width: 190 })}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--colors-fg-strong)' }}>
          Confirm save
        </span>
        <span style={{ fontSize: 12, color: 'var(--colors-fg-muted)' }}>
          This overwrites the existing draft.
        </span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {triggerButton('Cancel')}
          {primaryButton('Save')}
        </div>
      </div>
    </div>
  );
}

export const dialogDemo: PlaygroundDemo = { label: 'Dialog', code, preview };
