import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { NavigationMenu } from 'usemotif/headless';

<NavigationMenu
  current="products"
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', children: [
      { id: 'web', label: 'Web', href: '/web' },
      { id: 'native', label: 'Native', href: '/native' },
    ] },
    { id: 'pricing', label: 'Pricing', href: '/pricing' },
  ]}
/>`;
}

function item(label: string, current = false, hasChildren = false) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        borderRadius: 6,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        fontWeight: current ? 600 : 400,
        color: current ? 'var(--colors-accent-base)' : 'var(--colors-fg-default)',
        background: current ? 'var(--colors-surface-muted)' : 'transparent',
      }}
    >
      {label}
      {hasChildren ? <span style={{ fontSize: 9 }}>▾</span> : null}
    </span>
  );
}

function preview() {
  return (
    <nav style={{ display: 'flex', gap: 4 }}>
      {item('Home')}
      {item('Products', true, true)}
      {item('Pricing')}
    </nav>
  );
}

export const navigationMenuDemo: PlaygroundDemo = {
  label: 'NavigationMenu',
  code,
  preview,
};
