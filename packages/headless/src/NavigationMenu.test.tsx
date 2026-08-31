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

  // Regression: the menubar/menu structure was invalid - <li>s lacked
  // role="none", triggers lacked role="menuitem", and aria-current was
  // duplicated on both the <li> and the trigger.
  it('wraps triggers in role="none" <li>s and gives each trigger role="menuitem"', () => {
    render(<NavigationMenu items={items} />);
    const lis = container.querySelectorAll('[role="menubar"] > li');
    expect(lis.length).toBe(3);
    expect(Array.from(lis).every((li) => li.getAttribute('role') === 'none')).toBe(true);
    const triggers = container.querySelectorAll(
      '[role="menubar"] > li > a, [role="menubar"] > li > button',
    );
    expect(Array.from(triggers).every((t) => t.getAttribute('role') === 'menuitem')).toBe(true);
  });

  it('does not duplicate aria-current on the <li> (it lives on the trigger)', () => {
    render(<NavigationMenu items={items} current="docs" />);
    const docsLink = container.querySelector('a[href="/docs"]')!;
    expect(docsLink.getAttribute('aria-current')).toBe('page');
    const li = docsLink.closest('li')!;
    expect(li.hasAttribute('aria-current')).toBe(false);
  });

  it('submenu items use a roving tabindex (single tab stop)', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )! as HTMLButtonElement;
    act(() => apiTrigger.click());
    const subItems = Array.from(
      document.querySelectorAll<HTMLElement>('[role="menu"] [role="menuitem"]'),
    );
    expect(subItems.length).toBe(2);
    // Exactly one submenu item is in the tab sequence; the rest are -1.
    expect(subItems[0]!.getAttribute('tabindex')).toBe('0');
    expect(subItems[1]!.getAttribute('tabindex')).toBe('-1');
  });

  it('keeps every top-level menubar item tabbable (disclosure model)', () => {
    render(<NavigationMenu items={items} />);
    const triggers = container.querySelectorAll<HTMLElement>(
      '[role="menubar"] > li > [role="menuitem"]',
    );
    expect(triggers.length).toBe(3);
    expect(Array.from(triggers).every((t) => t.getAttribute('tabindex') === '0')).toBe(true);
  });

  // Regression (#143): the submenu renders in a Portal (outside the <li>),
  // so closeOnBlur used to fire when focus entered it - closing the menu
  // before focus could land, which made the roving Up/Down nav untestable.
  it('keeps the submenu open when focus moves into it, and Up/Down navigate', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )! as HTMLButtonElement;
    act(() => apiTrigger.click());
    const subItems = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="menu"] [role="menuitem"]'));
    expect(subItems()).toHaveLength(2);

    // Move focus from the trigger into the first submenu item - this used
    // to blur the <li> and close the portaled submenu.
    act(() => subItems()[0]!.focus());
    expect(document.querySelector('[role="menu"]')).not.toBeNull(); // still open
    expect(document.activeElement).toBe(subItems()[0]);

    // ArrowDown / ArrowUp now actually move DOM focus between items.
    press(subItems()[0]!, 'ArrowDown');
    expect(document.activeElement).toBe(subItems()[1]);
    press(subItems()[1]!, 'ArrowUp');
    expect(document.activeElement).toBe(subItems()[0]);
  });

  // #166 - a leaf submenu item must be able to collapse back to its parent
  // with ArrowLeft, returning focus to the parent trigger (not <body>).
  it('leaf submenu item ArrowLeft closes the submenu and focuses the parent trigger', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )! as HTMLButtonElement;
    act(() => apiTrigger.click());
    const subItems = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="menu"] [role="menuitem"]'));
    act(() => subItems()[0]!.focus());
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    press(subItems()[0]!, 'ArrowLeft');
    expect(document.querySelector('[role="menu"]')).toBeNull(); // collapsed
    expect(document.activeElement).toBe(apiTrigger); // focus restored
  });

  // #166 - Escape inside a submenu closes it AND restores focus to the
  // parent trigger; previously focus was left on the unmounted item.
  it('Escape in a submenu restores focus to the parent trigger', () => {
    render(<NavigationMenu items={items} />);
    const apiTrigger = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'API',
    )! as HTMLButtonElement;
    act(() => apiTrigger.click());
    const subItems = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="menu"] [role="menuitem"]'));
    act(() => subItems()[0]!.focus());

    press(subItems()[0]!, 'Escape');
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(apiTrigger);
  });
});

describe('NavigationMenu — render override + single-open (#231)', () => {
  it('attaches menuitem wiring to a custom render trigger and opens its submenu', () => {
    const renderItems: NavigationMenuItem[] = [
      {
        id: 'api',
        label: 'API',
        children: [{ id: 'v1', label: 'v1', href: '/api/v1' }],
        render: ({ label }) => <button data-testid="custom">{label as string}</button>,
      },
    ];
    render(<NavigationMenu items={renderItems} />);
    const custom = container.querySelector('[data-testid="custom"]')!;
    // sharedTriggerProps were attached to the render output.
    expect(custom.getAttribute('role')).toBe('menuitem');
    expect(custom.getAttribute('aria-haspopup')).toBe('menu');
    // onClick wiring opens the submenu (previously a no-op → submenu at 0,0).
    act(() => (custom as HTMLElement).click());
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
    expect(custom.getAttribute('aria-expanded')).toBe('true');
  });

  it('opening one top-level submenu closes its open sibling', () => {
    const twoParents: NavigationMenuItem[] = [
      { id: 'a', label: 'A', children: [{ id: 'a1', label: 'a1', href: '/a1' }] },
      { id: 'b', label: 'B', children: [{ id: 'b1', label: 'b1', href: '/b1' }] },
    ];
    render(<NavigationMenu items={twoParents} />);
    const btn = (text: string): HTMLButtonElement =>
      Array.from(container.querySelectorAll('button')).find(
        (b) => b.textContent === text,
      )! as HTMLButtonElement;
    act(() => btn('A').click());
    expect(btn('A').getAttribute('aria-expanded')).toBe('true');
    act(() => btn('B').click());
    expect(btn('B').getAttribute('aria-expanded')).toBe('true');
    // Single-open coordination: A collapsed when B opened.
    expect(btn('A').getAttribute('aria-expanded')).toBe('false');
  });
});
