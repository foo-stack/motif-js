import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu, type NavigationMenuItem } from '@usemotif/headless';

// NavigationMenu has two modes:
//  - Flat: pass element `children`; each is wrapped in an <li> and the one
//    whose `id` matches `current` gets aria-current="page".
//  - Tree: pass `items` (recursive {id,label,href?,children?,render?}); items
//    with children open a Portal-positioned submenu on hover / keyboard.
const linkStyle = {
  display: 'inline-block',
  padding: '8px 12px',
  color: 'var(--colors-text-default, #111827)',
  textDecoration: 'none',
  borderRadius: 6,
};
const submenuItemStyle = {
  display: 'block',
  padding: '8px 14px',
  color: 'var(--colors-text-default, #111827)',
  textDecoration: 'none',
  whiteSpace: 'nowrap' as const,
};

const BASE = 'https://usemotif.dev';
const TREE: NavigationMenuItem[] = [
  { id: 'home', label: 'Home', href: BASE },
  {
    id: 'products',
    label: 'Products',
    children: [
      { id: 'web', label: 'Web', href: `${BASE}/web` },
      { id: 'native', label: 'Native', href: `${BASE}/native` },
      {
        id: 'tools',
        label: 'Tooling',
        children: [
          { id: 'cli', label: 'CLI', href: `${BASE}/cli` },
          { id: 'compiler', label: 'Compiler', href: `${BASE}/compiler` },
        ],
      },
    ],
  },
  { id: 'docs', label: 'Docs', href: `${BASE}/docs` },
  { id: 'pricing', label: 'Pricing', href: `${BASE}/pricing`, disabled: true },
];

/**
 * NavigationMenu — top-level horizontal nav in two modes. **Flat**: pass
 * element `children` (the child whose `id` equals `current` gets
 * `aria-current="page"`). **Tree**: pass an `items` array of
 * `{ id, label, href?, disabled?, children?, render? }`; items with
 * `children` open a portalled submenu on hover or keyboard
 * (ArrowRight/Down open, ArrowLeft/Escape close). `render` overrides a
 * node's markup.
 */
const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  argTypes: {
    items: { control: false },
    children: { control: false },
    style: { control: false },
    current: { control: 'text' },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tree mode with submenus. `render` styles each node; "Products" opens a
 * submenu on hover/keyboard, and "Tooling" nests a second level.
 */
export const Playground: Story = {
  render: () => (
    <NavigationMenu
      aria-label="Primary"
      current="home"
      items={withRender(TREE)}
      style={{ display: 'flex', gap: 4 }}
    />
  ),
};

/** Flat mode — single-level links, no submenus. */
export const Flat: Story = {
  render: () => (
    <NavigationMenu aria-label="Primary" current="docs" style={{ display: 'flex' }}>
      <a id="home" href="https://usemotif.dev" style={linkStyle}>
        Home
      </a>
      <a id="docs" href="https://usemotif.dev/docs" style={{ ...linkStyle, fontWeight: 700 }}>
        Docs
      </a>
      <a id="blog" href="https://usemotif.dev/blog" style={linkStyle}>
        Blog
      </a>
    </NavigationMenu>
  ),
};

/** Apply a `render` override to every tree node so submenus are styled. */
function withRender(items: NavigationMenuItem[]): NavigationMenuItem[] {
  return items.map((item) => ({
    ...item,
    ...(item.children ? { children: withRender(item.children as NavigationMenuItem[]) } : {}),
    render: ({ label, isOpen, isCurrent, hasChildren, toggleOpen }) => {
      const style = {
        ...(item.children ? submenuItemStyle : linkStyle),
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        opacity: item.disabled ? 0.4 : 1,
        fontWeight: isCurrent ? 700 : 500,
        background: isOpen ? 'var(--colors-surface-muted, #f3f4f6)' : 'transparent',
      };
      if (hasChildren) {
        return (
          <button
            type="button"
            onClick={toggleOpen}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            style={{ ...style, appearance: 'none', border: 'none' }}
          >
            {label} {'▾'}
          </button>
        );
      }
      return (
        <a href={item.href ?? BASE} aria-current={isCurrent ? 'page' : undefined} style={style}>
          {label}
        </a>
      );
    },
  }));
}
