import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { DatePicker } from 'usemotif/headless';

<DatePicker
  value={date}
  onValueChange={setDate}
  placeholder="Pick a date"
/>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          borderRadius: 7,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
        }}
      >
        15 May 2026
        <span style={{ fontSize: 12 }}>📅</span>
      </span>
      <div style={panel({ width: 150, padding: 10 })}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
          }}
        >
          {Array.from({ length: 21 }, (_, i) => {
            const day = i + 8;
            const selected = day === 15;
            return (
              <span
                // eslint-disable-next-line react/no-array-index-key -- positional
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  fontFamily: 'var(--font-families-sans)',
                  padding: '2px 0',
                  borderRadius: 3,
                  background: selected ? '#1D4ED8' : 'transparent',
                  color: selected ? '#FBF7F2' : 'var(--colors-fg-muted)',
                }}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const datePickerDemo: PlaygroundDemo = { label: 'DatePicker', code, preview };
