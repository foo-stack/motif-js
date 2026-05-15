import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { Calendar } from 'usemotif/headless';

<Calendar
  defaultValue={new Date()}
  onValueChange={setDate}
  weekStartsOn={1}
/>`;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function preview() {
  const cells = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <div style={panel({ width: 224, padding: 12 })}>
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-families-sans)',
          fontWeight: 600,
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        May 2026
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {DAYS.map((d, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key -- positional
            key={i}
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-families-mono)',
              fontSize: 10,
              color: 'var(--colors-fg-faint)',
            }}
          >
            {d}
          </span>
        ))}
        {cells.map((n, i) => {
          const valid = n >= 1 && n <= 31;
          const selected = n === 15;
          return (
            <span
              // eslint-disable-next-line react/no-array-index-key -- positional
              key={i}
              style={{
                textAlign: 'center',
                padding: '4px 0',
                fontFamily: 'var(--font-families-sans)',
                fontSize: 12,
                borderRadius: 4,
                background: selected ? '#1D4ED8' : 'transparent',
                color: selected
                  ? '#FBF7F2'
                  : valid
                    ? 'var(--colors-fg-default)'
                    : 'var(--colors-fg-faint)',
              }}
            >
              {valid ? n : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export const calendarDemo: PlaygroundDemo = { label: 'Calendar', code, preview };
