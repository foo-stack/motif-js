import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { HoverCard } from 'usemotif/headless';

<HoverCard.Root openDelay={700}>
  <HoverCard.Trigger>
    <a href="/u/jane">@jane</a>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <Profile id="jane" />
  </HoverCard.Content>
</HoverCard.Root>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          fontFamily: 'var(--font-families-sans)',
          fontSize: 14,
          color: 'var(--colors-accent-base)',
          textDecoration: 'underline',
        }}
      >
        @jane
      </span>
      <div style={panel({ display: 'flex', gap: 10, alignItems: 'center', width: 200 })}>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#7E22CE',
            flex: '0 0 auto',
          }}
        />
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--colors-fg-strong)' }}>
            Jane Doe
          </span>
          <span style={{ fontSize: 12, color: 'var(--colors-fg-muted)' }}>240 followers</span>
        </span>
      </div>
    </div>
  );
}

export const hoverCardDemo: PlaygroundDemo = { label: 'HoverCard', code, preview };
