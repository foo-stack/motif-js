import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { ColorPicker } from 'usemotif/headless';

<ColorPicker
  value={color}
  onValueChange={setColor}
  format="hex"
  allowAlpha
/>`;
}

function preview() {
  return (
    <div style={panel({ width: 180, display: 'flex', flexDirection: 'column', gap: 8 })}>
      <div
        style={{
          height: 90,
          borderRadius: 6,
          background:
            'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, #1D4ED8)',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 24,
            left: 110,
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          }}
        />
      </div>
      <div
        style={{
          height: 12,
          borderRadius: 999,
          background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
        }}
      />
      <div style={{ display: 'flex', gap: 4 }}>
        {['hex', 'rgb', 'hsl'].map((f) => (
          <span
            key={f}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '3px 0',
              borderRadius: 4,
              fontFamily: 'var(--font-families-mono)',
              fontSize: 10,
              background: f === 'hex' ? '#1D4ED8' : 'var(--colors-surface-muted)',
              color: f === 'hex' ? '#FBF7F2' : 'var(--colors-fg-muted)',
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export const colorPickerDemo: PlaygroundDemo = { label: 'ColorPicker', code, preview };
