import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Accordion } from 'usemotif/headless';

<Accordion.Root type="single" defaultValue={['shipping']}>
  <Accordion.Item value="shipping">
    <Accordion.Trigger><button>Shipping</button></Accordion.Trigger>
    <Accordion.Content>Ships in 2-3 days.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="returns">
    <Accordion.Trigger><button>Returns</button></Accordion.Trigger>
    <Accordion.Content>30-day window.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`;
}

function rowHeader(label: string, open: boolean) {
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '9px 12px',
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--colors-fg-strong)',
      }}
    >
      {label}
      <span style={{ fontSize: 10 }}>{open ? '▴' : '▾'}</span>
    </span>
  );
}

function preview() {
  return (
    <div
      style={{
        width: 220,
        border: '1px solid var(--colors-line-base)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {rowHeader('Shipping', true)}
      <span
        style={{
          display: 'block',
          padding: '0 12px 10px',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 12,
          color: 'var(--colors-fg-muted)',
        }}
      >
        Ships in 2-3 business days.
      </span>
      <span style={{ display: 'block', height: 1, background: 'var(--colors-line-faint)' }} />
      {rowHeader('Returns', false)}
    </div>
  );
}

export const accordionDemo: PlaygroundDemo = { label: 'Accordion', code, preview };
