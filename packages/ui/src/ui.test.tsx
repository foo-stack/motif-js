/** @vitest-environment jsdom */
import { act, useCallback } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Accordion,
  Alert,
  Badge,
  Card,
  Checkbox,
  Menu,
  Modal,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Select,
  type SelectOption,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Toaster,
  Tooltip,
  useToast,
} from './index.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

function click(el: Element): void {
  act(() => (el as HTMLElement).click());
}

/** Class + inline style — what visually distinguishes a rendered element. */
function look(el: Element): string {
  return `${el.getAttribute('class') ?? ''}|${el.getAttribute('style') ?? ''}`;
}

// Module-scope stable reference: an inline `defaultValue={['a']}` would trip
// react-perf's jsx-no-new-array-as-prop.
const ACCORDION_DEFAULT_OPEN = ['a'];

// Likewise hoisted: an inline `options={[…]}` array prop would trip the lint.
const SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

// Module-scope handler + flag: an inline `onSelect={() => …}` would trip
// react-perf's jsx-no-new-function-as-prop.
let menuPicked = '';
function pickRename(): void {
  menuPicked = 'rename';
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = '';
});

describe('display components', () => {
  it('Card and Badge render themed (recipe applied)', () => {
    render(
      <>
        <Card data-testid="card" />
        <Badge data-testid="badge">New</Badge>
      </>,
    );
    expect(look(container.querySelector('[data-testid="card"]')!)).not.toBe('|');
    expect(look(container.querySelector('[data-testid="badge"]')!)).not.toBe('|');
  });

  it('Spinner announces itself and animates', () => {
    render(<Spinner size={24} />);
    const el = container.querySelector('[role="status"]') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.getAttribute('aria-label')).toBe('Loading');
    // The spin animation resolved onto the element.
    expect(look(el)).not.toBe('|');
  });

  it('Alert renders role=alert with an intent-tinted surface', () => {
    render(
      <Alert intent="danger" title="Payment failed">
        Update your card.
      </Alert>,
    );
    const el = container.querySelector('[role="alert"]') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('Payment failed');
    expect(el.textContent).toContain('Update your card.');
    // The danger intent drives the soft-tint background from the `status`
    // tokens — the surface is the filled tint, not a bare border accent.
    expect(el.getAttribute('style') ?? '').toContain('status-danger-tint');
  });

  it('Alert supports the warning intent and tints per intent', () => {
    render(
      <>
        <Alert intent="warning" title="Heads up" />
        <Alert intent="info" title="FYI" />
      </>,
    );
    const alerts = container.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(2);
    const warnStyle = alerts[0]!.getAttribute('style') ?? '';
    const infoStyle = alerts[1]!.getAttribute('style') ?? '';
    expect(warnStyle).toContain('status-warning-tint');
    expect(infoStyle).toContain('status-info-tint');
    // Distinct intents must produce distinct tints.
    expect(warnStyle).not.toBe(infoStyle);
  });
});

describe('Modal — themed + adaptive + animated', () => {
  it('opens from a trigger and renders the accessible dialog with a themed surface', () => {
    render(
      <Modal.Root>
        <Modal.Trigger>
          <button data-testid="open">Open</button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Title>Delete project?</Modal.Title>
          <Modal.Description>This cannot be undone.</Modal.Description>
        </Modal.Content>
      </Modal.Root>,
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    click(container.querySelector('[data-testid="open"]')!);
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(dialog.textContent).toContain('Delete project?');
    // The themed surface Box (a child of the role=dialog boundary) carries styling.
    const surface = dialog.querySelector('div');
    expect(surface).not.toBeNull();
    expect(look(surface!)).not.toBe('|');
    // aria-labelledby is wired to the title.
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('closes on Escape', () => {
    render(
      <Modal.Root defaultOpen>
        {/* exitDurationMs=0 → instant unmount, so we test the Escape wiring,
            not the exit animation (which would keep it mounted ~200ms). */}
        <Modal.Content exitDurationMs={0}>
          <Modal.Title>Title</Modal.Title>
        </Modal.Content>
      </Modal.Root>,
    );
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    act(() => {
      dialog!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});

describe('Tooltip — themed bubble over the headless behaviour', () => {
  it('renders the trigger and stays closed until interaction', () => {
    render(
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button data-testid="tt-trigger">Hover me</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Saved automatically</Tooltip.Content>
      </Tooltip.Root>,
    );
    // Trigger renders (the headless Trigger clones the child + wires handlers).
    const trigger = container.querySelector('[data-testid="tt-trigger"]');
    expect(trigger).not.toBeNull();
    // Closed by default — no tooltip content in the document yet.
    expect(document.body.textContent).not.toContain('Saved automatically');
  });
});

describe('Toast — themed cards over the headless toaster', () => {
  function ToastDemo() {
    const { toast } = useToast();
    const push = useCallback(
      () => toast({ title: 'Saved', description: 'Your changes are stored.' }),
      [toast],
    );
    return (
      <button data-testid="push" onClick={push}>
        push
      </button>
    );
  }

  it('pushes a themed toast that announces itself politely', () => {
    render(
      <Toaster>
        <ToastDemo />
      </Toaster>,
    );
    click(container.querySelector('[data-testid="push"]')!);
    // Toasts render through a portal (document, not the container).
    const toast = document.querySelector('[role="status"]') as HTMLElement;
    expect(toast).not.toBeNull();
    expect(toast.textContent).toContain('Saved');
    expect(toast.textContent).toContain('Your changes are stored.');
    // The visible card is a themed Box (class + inline style applied).
    const card = toast.querySelector('div');
    expect(card).not.toBeNull();
    expect(look(card!)).not.toBe('|');
  });
});

describe('Switch — themed via the _checked pseudo', () => {
  it('renders a role=switch input with a checked-state rule (pure CSS)', () => {
    render(<Switch defaultChecked data-testid="sw" />);
    const el = container.querySelector('[role="switch"]') as HTMLInputElement;
    expect(el).not.toBeNull();
    expect(el.tagName).toBe('INPUT');
    expect(el.checked).toBe(true);
    // The on-state (track colour + thumb slide) resolves to a hashed
    // :checked rule, not inline — proof it's the _checked pseudo at work.
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain(':checked');
  });

  it('forwards aria-invalid when invalid', () => {
    render(<Switch invalid data-testid="sw" />);
    const el = container.querySelector('[role="switch"]') as HTMLElement;
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Tabs — themed via _selected over the headless asChild', () => {
  it('renders accessible tabs and colours the active one via [aria-selected]', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Account</Tabs.Tab>
          <Tabs.Tab value="b">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Account panel</Tabs.Panel>
        <Tabs.Panel value="b">Billing panel</Tabs.Panel>
      </Tabs.Root>,
    );
    // The tab semantics + theming land on a single styled element (a button Box).
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(2);
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    expect(look(tabs[0]!)).not.toBe('|'); // themed (class + inline style)
    // The active-tab styling is a hashed [aria-selected] rule (the _selected
    // pseudo), not inline — proof it's pure CSS, not JS state.
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain('[aria-selected="true"]');
    // Only the active panel renders.
    expect(container.textContent).toContain('Account panel');
    expect(container.textContent).not.toContain('Billing panel');
  });

  it('switches the active tab on click', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs.Root>,
    );
    click(container.querySelectorAll('[role="tab"]')[1]!);
    expect(container.querySelectorAll('[role="tab"]')[1]!.getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(container.textContent).toContain('Panel B');
  });
});

describe('Checkbox — themed via the _checked pseudo', () => {
  it('renders a native checkbox with a checked-state rule (pure CSS)', () => {
    render(<Checkbox defaultChecked data-testid="cb" />);
    const el = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(el).not.toBeNull();
    expect(el.checked).toBe(true);
    expect(look(el)).not.toBe('|'); // themed (class + reset style)
    // The on-state (fill + tick) resolves to a hashed :checked rule, not inline —
    // proof it's the _checked pseudo at work, no controlled state.
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain(':checked');
  });

  it('forwards aria-invalid when invalid', () => {
    render(<Checkbox invalid data-testid="cb" />);
    const el = container.querySelector('input[type="checkbox"]') as HTMLElement;
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Radio / RadioGroup — themed via _checked, grouped by a shared name', () => {
  it('shares the group name, checks the default option, and allows single selection', () => {
    render(
      <RadioGroup name="plan" defaultValue="pro">
        <Radio value="free" data-testid="free" />
        <Radio value="pro" data-testid="pro" />
      </RadioGroup>,
    );
    // role=radiogroup wraps the options.
    expect(container.querySelector('[role="radiogroup"]')).not.toBeNull();
    const free = container.querySelector('[data-testid="free"]') as HTMLInputElement;
    const pro = container.querySelector('[data-testid="pro"]') as HTMLInputElement;
    // Both radios inherit the group's shared name (→ native single-selection).
    expect(free.getAttribute('name')).toBe('plan');
    expect(pro.getAttribute('name')).toBe('plan');
    expect(free.type).toBe('radio');
    // The default option is checked; the other isn't.
    expect(pro.checked).toBe(true);
    expect(free.checked).toBe(false);
    // Picking the other option moves the single selection (native group behaviour).
    click(free);
    expect(free.checked).toBe(true);
    expect(pro.checked).toBe(false);
    // The checked styling is a hashed :checked rule, not inline.
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain(':checked');
  });

  it('auto-generates a shared name when none is given', () => {
    render(
      <RadioGroup>
        <Radio value="a" data-testid="a" />
        <Radio value="b" data-testid="b" />
      </RadioGroup>,
    );
    const a = container.querySelector('[data-testid="a"]') as HTMLInputElement;
    const b = container.querySelector('[data-testid="b"]') as HTMLInputElement;
    expect(a.getAttribute('name')).toBeTruthy();
    expect(a.getAttribute('name')).toBe(b.getAttribute('name'));
  });
});

describe('Popover — themed surface over the headless behaviour', () => {
  it('opens from its trigger and renders a themed dialog surface', () => {
    render(
      <Popover.Root>
        <Popover.Trigger>
          <button data-testid="pop-trigger">Filters</button>
        </Popover.Trigger>
        <Popover.Content>
          <div data-testid="pop-body">Pick a range</div>
        </Popover.Content>
      </Popover.Root>,
    );
    const trigger = container.querySelector('[data-testid="pop-trigger"]') as HTMLElement;
    expect(trigger).not.toBeNull();
    // Closed initially — no content, trigger not expanded.
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[data-testid="pop-body"]')).toBeNull();

    click(trigger);
    // Open: a role=dialog surface renders through a portal (document, not container).
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(dialog.textContent).toContain('Pick a range');
    // The visible card is a themed Box (class + inline style applied).
    const card = dialog.querySelector('div');
    expect(card).not.toBeNull();
    expect(look(card!)).not.toBe('|');
  });
});

describe('Accordion — themed via _expanded over the headless disclosure', () => {
  it('renders triggers that expose aria-expanded and toggle their panels', () => {
    render(
      <Accordion.Root type="single" defaultValue={ACCORDION_DEFAULT_OPEN}>
        <Accordion.Item value="a">
          <Accordion.Trigger>Shipping</Accordion.Trigger>
          <Accordion.Content>Ships in 2–3 days.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Returns</Accordion.Trigger>
          <Accordion.Content>30-day returns.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const triggers = container.querySelectorAll('button');
    expect(triggers.length).toBe(2);
    // The themed trigger is a styled button Box (class + inline style applied).
    expect(look(triggers[0]!)).not.toBe('|');
    // The default-open item is expanded; the other isn't.
    expect(triggers[0]!.getAttribute('aria-expanded')).toBe('true');
    expect(triggers[1]!.getAttribute('aria-expanded')).toBe('false');
    expect(container.textContent).toContain('Ships in 2–3 days.');

    // The open-state styling is a hashed [aria-expanded] rule (the _expanded
    // pseudo), not inline — proof the open affordance is pure CSS.
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain('[aria-expanded="true"]');

    // Single-type: opening the second collapses the first.
    click(triggers[1]!);
    expect(triggers[1]!.getAttribute('aria-expanded')).toBe('true');
    expect(triggers[0]!.getAttribute('aria-expanded')).toBe('false');
    expect(container.textContent).toContain('30-day returns.');
  });
});

describe('Select — themed single-select over the headless listbox', () => {
  it('shows the selected label, opens a themed listbox, and changes selection', () => {
    render(<Select options={SELECT_OPTIONS} defaultValue="b" width={200} />);
    const trigger = container.querySelector('button') as HTMLButtonElement;
    expect(trigger).not.toBeNull();
    expect(trigger.textContent).toContain('Beta'); // label for the default value
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="listbox"]')).toBeNull();

    click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const listbox = document.querySelector('[role="listbox"]') as HTMLElement;
    expect(listbox).not.toBeNull();
    const options = listbox.querySelectorAll('[role="option"]');
    expect(options.length).toBe(3);
    // The default option is marked selected, and the rows are themed.
    expect(options[1]!.getAttribute('aria-selected')).toBe('true');
    expect(look(options[0]!.querySelector('div')!)).not.toBe('|');

    // The headless list commits selection on mousedown (not click).
    act(() => {
      options[0]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    });
    // Selection moved → trigger relabels and the listbox closes.
    expect(trigger.textContent).toContain('Alpha');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });
});

describe('Menu — themed dropdown with asChild items', () => {
  it('opens a menu whose themed items carry the menuitem role and activate', () => {
    menuPicked = '';
    render(
      <Menu.Root>
        <Menu.Trigger>
          <button data-testid="menu-trigger">Actions</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={pickRename}>Rename</Menu.Item>
          <Menu.Separator />
          <Menu.Item disabled>Archive</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    click(container.querySelector('[data-testid="menu-trigger"]')!);
    const menu = document.querySelector('[role="menu"]') as HTMLElement;
    expect(menu).not.toBeNull();
    const items = menu.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(2);
    // asChild → the menuitem IS the themed Box (class + inline style applied),
    // not a bare wrapper div.
    expect(look(items[0]!)).not.toBe('|');
    expect(menu.querySelector('[role="separator"]')).not.toBeNull();

    // Activating an item runs onSelect and closes the menu.
    click(items[0]!);
    expect(menuPicked).toBe('rename');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });
});

describe('Slider — themed range input over the headless slider', () => {
  it('exposes the slider role + value and responds to arrow keys', () => {
    render(<Slider defaultValue={40} aria-label="Volume" />);
    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    expect(slider).not.toBeNull();
    expect(slider.getAttribute('aria-valuenow')).toBe('40');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('100');
    expect(slider.getAttribute('aria-label')).toBe('Volume');
    // Themed track (inline token-var style applied).
    expect(look(slider)).not.toBe('|');
    // Keyboard nudges the value (default step 1).
    act(() => {
      slider.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
      );
    });
    expect(slider.getAttribute('aria-valuenow')).toBe('41');
  });
});

describe('Progress — themed bar over the headless progressbar', () => {
  it('renders a determinate bar with aria-valuenow', () => {
    render(<Progress value={70} aria-label="Uploading" />);
    const bar = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.getAttribute('aria-valuenow')).toBe('70');
    expect(bar.getAttribute('aria-label')).toBe('Uploading');
    // Themed track + fill (inline token-var style applied).
    expect(look(bar)).not.toBe('|');
    expect(look(bar.querySelector('div')!)).not.toBe('|');
  });

  it('omits aria-valuenow when indeterminate (value=null)', () => {
    render(<Progress value={null} aria-label="Loading" />);
    const bar = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
  });
});
