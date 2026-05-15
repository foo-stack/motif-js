import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { CommandPalette, useCommandPaletteShortcut } from 'usemotif/headless';

useCommandPaletteShortcut('mod+k', () => setOpen(true));

<CommandPalette.Root open={open} onOpenChange={setOpen} commands={commands}>
  <CommandPalette.Input placeholder="Type a command…" />
  <CommandPalette.List renderItem={renderRow} renderSection={renderHeading} />
</CommandPalette.Root>`;
}

function heading(text: string) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--colors-fg-faint)',
        padding: '4px 8px',
      }}
    >
      {text}
    </span>
  );
}

function row(label: string, shortcut: string, active = false) {
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 8px',
        borderRadius: 5,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        color: 'var(--colors-fg-default)',
        background: active ? 'var(--colors-surface-muted)' : 'transparent',
      }}
    >
      {label}
      <span
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 11,
          color: 'var(--colors-fg-faint)',
        }}
      >
        {shortcut}
      </span>
    </span>
  );
}

function preview() {
  return (
    <div
      style={panel({ display: 'flex', flexDirection: 'column', gap: 2, width: 240, padding: 8 })}
    >
      <input
        readOnly
        value="op"
        aria-label="Command"
        style={{
          padding: '7px 10px',
          borderRadius: 6,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
          marginBottom: 4,
        }}
      />
      {heading('File')}
      {row('Open file', '⌘O', true)}
      {row('Save', '⌘S')}
    </div>
  );
}

export const commandPaletteDemo: PlaygroundDemo = {
  label: 'CommandPalette',
  code,
  preview,
};
