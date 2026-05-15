import type { PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

function code(): string {
  return `import { HStack, Spacer } from 'usemotif';

<HStack>
  <Avatar />
  <Spacer />
  <Button>Follow</Button>
</HStack>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', width: 220, alignItems: 'center' }}>
      <Swatch tone="a" size={28} />
      <span style={{ flex: 1 }} />
      <span
        style={{
          padding: '6px 12px',
          borderRadius: 6,
          background: '#1D4ED8',
          color: '#FBF7F2',
          fontFamily: 'var(--font-families-mono)',
          fontSize: 12,
        }}
      >
        Follow
      </span>
    </div>
  );
}

export const spacerDemo: PlaygroundDemo = { label: 'Spacer', code, preview };
