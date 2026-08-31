/** @vitest-environment jsdom */
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileUpload } from './specialized.js';

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

function fireDrag(el: Element, type: 'dragenter' | 'dragleave'): void {
  // jsdom lacks a DragEvent constructor; a bubbling Event of the right
  // type still triggers React's delegated drag handlers.
  act(() => {
    el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
  });
}

describe('FileUpload — drag highlight', () => {
  function renderZone(): { zone: HTMLElement; child: HTMLElement } {
    render(
      <FileUpload>
        {({ isDragging }) => (
          <div data-testid="zone" data-dragging={String(isDragging)}>
            <span data-testid="child">drop here</span>
          </div>
        )}
      </FileUpload>,
    );
    return {
      zone: container.querySelector('[data-testid="zone"]') as HTMLElement,
      child: container.querySelector('[data-testid="child"]') as HTMLElement,
    };
  }
  const dragging = (): string =>
    container.querySelector('[data-testid="zone"]')!.getAttribute('data-dragging') ?? '';

  // Regression: onDragLeave unconditionally cleared the highlight, so it
  // flickered off every time the pointer crossed between child elements.
  it('stays highlighted while the pointer crosses child elements', () => {
    const { zone, child } = renderZone();
    fireDrag(zone, 'dragenter'); // enter the drop zone
    expect(dragging()).toBe('true');
    // Pointer moves onto a child: dragenter(child) + dragleave(zone) - net 0.
    fireDrag(child, 'dragenter');
    fireDrag(zone, 'dragleave');
    expect(dragging()).toBe('true'); // must NOT flicker off
    // Truly leaving the zone clears the highlight.
    fireDrag(child, 'dragleave');
    expect(dragging()).toBe('false');
  });
});
