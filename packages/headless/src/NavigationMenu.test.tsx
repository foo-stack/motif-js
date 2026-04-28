import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NavigationMenu, type NavigationMenuItem } from './navigation.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function press(target: Element, key: string): void {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  act(() => {
    target.dispatchEvent(event);
  });
}

const items: NavigationMenuItem[] = [
  {
    id: 'docs',
    label: 'Docs',
    href: '/docs',
  },
  {
    id: 'api',
    label: 'API',
    children: [
      { id: 'api/v1', label: 'v1', href: '/api/v1' },
      { id: 'api/v2', label: 'v2', href: '/api/v2' },
    ],
  },
  { id: 'blog', label: 'Blog', href: '/blog' },
];

describe('NavigationMenu — flat mode (children)', () => {
  it('renders children with aria-current on the matching item', () => {
    render(
      <NavigationMenu current="b">
        <a id="a" href="/a">
          A
        </a>
        <a id="b" href="/b">
          B
        </a>
      </NavigationMenu>,
    );
    const lis = container.querySelectorAll('li');
    expect(lis).toHaveLength(2);
    expect(lis[1]?.getAttribute('aria-current')).toBe('page');
    expect(lis[0]?.getAttribute('aria-current')).toBeNull();
  });
});

describe('NavigationMenu — tree mode (items)', () => {
  it('renders top-level items as menubar', () => {
    render(<NavigationMenu items={items} />);
    const menubar = container.querySelector('[role="menubar"]');
    expect(menubar).not.toBeNull();
    const triggers = container.querySelectorAll(
      '[role="menubar"] > li > a, [role="menubar"] > li > button',
    );
    expect(triggers).toHaveLength(3);
  });

  it('leaf items with href render as anchors', () => {
    render(<NavigationMenu items={items} />);
    const docs = container.querySelector('a[href="/docs"]');
    expect(docs).not.toBeNull();
  });

  it('parents with children render as buttons with aria-haspopup', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )!;
    expect(apiTrigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(apiTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the submenu on click', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )! as HTMLButtonElement;
    act(() => apiTrigger.click());
    expect(apiTrigger.getAttribute('aria-expanded')).toBe('true');
    const submenu = document.querySelector('[role="menu"]');
    expect(submenu).not.toBeNull();
    const v1 = document.querySelector('a[href="/api/v1"]');
    expect(v1).not.toBeNull();
  });

  it('ArrowRight on the parent opens the submenu', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )!;
    press(apiTrigger, 'ArrowRight');
    expect(apiTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('ArrowLeft on the open parent closes the submenu', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )! as HTMLButtonElement;
    act(() => apiTrigger.click());
    expect(apiTrigger.getAttribute('aria-expanded')).toBe('true');
    press(apiTrigger, 'ArrowLeft');
    expect(apiTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('aria-current bubbles up to the matching item id', () => {
    render(<NavigationMenu items={items} current="docs" />);
    const docsLink = container.querySelector('a[href="/docs"]')!;
    expect(docsLink.getAttribute('aria-current')).toBe('page');
  });

  it('disabled items do not toggle on click', () => {
    const disabledItems: NavigationMenuItem[] = [
      {
        id: 'd',
        label: 'Disabled',
        disabled: true,
        children: [{ id: 'leaf', label: 'leaf', href: '/x' }],
      },
    ];
    render(<NavigationMenu items={disabledItems} />);
    const t = container.querySelector('button')! as HTMLButtonElement;
    act(() => t.click());
    expect(t.getAttribute('aria-expanded')).toBe('false');
  });
});
