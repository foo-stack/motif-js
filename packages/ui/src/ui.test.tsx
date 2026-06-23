/** @vitest-environment jsdom */
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Alert, Badge, Card, Modal, Spinner } from './index.js';

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
