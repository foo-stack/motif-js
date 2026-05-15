import type { PlaygroundDemo } from './index.js';
import { panel, triggerButton } from './_surface.js';

function code(): string {
  return `import { AlertDialog } from 'usemotif/headless';

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button intent="danger">Delete</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Delete account?</AlertDialog.Title>
    <AlertDialog.Description>
      This cannot be undone.
    </AlertDialog.Description>
    <AlertDialog.Close><Button>Cancel</Button></AlertDialog.Close>
    <Button intent="danger" onClick={destroy}>Delete</Button>
  </AlertDialog.Content>
</AlertDialog.Root>`;
}

function dangerButton(label: string) {
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '7px 14px',
        borderRadius: 7,
        background: '#B91C1C',
        color: '#FBF7F2',
        fontFamily: 'var(--font-families-sans)',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {label}
    </span>
  );
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
      <div style={panel({ display: 'flex', flexDirection: 'column', gap: 8, width: 200 })}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--colors-fg-strong)' }}>
          Delete account?
        </span>
        <span style={{ fontSize: 12, color: 'var(--colors-fg-muted)' }}>
          This cannot be undone.
        </span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {triggerButton('Cancel')}
          {dangerButton('Delete')}
        </div>
      </div>
    </div>
  );
}

export const alertDialogDemo: PlaygroundDemo = { label: 'AlertDialog', code, preview };
