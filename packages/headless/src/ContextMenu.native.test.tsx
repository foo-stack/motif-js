/** @vitest-environment jsdom */
/**
 * Native ContextMenu tests run against the `react-native` mock from
 * the @motif-js/react-native package (aliased in vitest.config.ts).
 * That mock renders Modal / Pressable / View as DOM hosts so jsdom
 * can query them. `onLongPress` is dispatched via a custom
 * `'longpress'` Event on the Pressable host since DOM has no
 * native long-press analogue.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Pressable, Text } from 'react-native';
import { ContextMenu } from './ContextMenu.native.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

function longPress(host: Element): void {
  act(() => {
    host.dispatchEvent(new Event('longpress', { bubbles: true }));
  });
}

function clickHost(host: Element): void {
  act(() => {
    (host as HTMLElement).click();
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
});

describe('Native ContextMenu — open / dismiss', () => {
  it('does not render the Content surface when closed', () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Pressable>
            <Text>trigger</Text>
          </Pressable>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    // No menu host present yet.
    expect(container.querySelector('[accessibilityRole="menu"]')).toBeNull();
  });

  it('opens the Content surface when the Trigger is long-pressed', () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Pressable testID="trg">
            <Text>trigger</Text>
          </Pressable>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    const trigger = container.querySelector('[testID="trg"]');
    expect(trigger).not.toBeNull();
    longPress(trigger!);
    // Modal is now visible — its mock renders the menu role on a
    // child View host.
    expect(container.querySelector('[accessibilityRole="menu"]')).not.toBeNull();
  });

  it('dismisses on item select and fires onSelect', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Pressable testID="trg">
            <Text>trigger</Text>
          </Pressable>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onSelect}>cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    longPress(container.querySelector('[testID="trg"]')!);
    const item = container.querySelector('[accessibilityRole="menuitem"]');
    expect(item).not.toBeNull();
    clickHost(item!);
    expect(onSelect).toHaveBeenCalledTimes(1);
    // After select, the menu surface is gone.
    expect(container.querySelector('[accessibilityRole="menu"]')).toBeNull();
  });

  it('does not fire onSelect for a disabled item', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Pressable testID="trg">
            <Text>trigger</Text>
          </Pressable>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item disabled onSelect={onSelect}>
            paste
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    longPress(container.querySelector('[testID="trg"]')!);
    const item = container.querySelector('[accessibilityRole="menuitem"]');
    expect(item).not.toBeNull();
    // Disabled items have `disabled` attribute on the Pressable host;
    // RN's Pressable mock translates this to a disabled <button>,
    // whose click is a no-op in jsdom.
    expect(item?.getAttribute('disabled')).not.toBeNull();
    clickHost(item!);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders a Separator with role="none"', () => {
    render(
      <ContextMenu.Root open>
        <ContextMenu.Content>
          <ContextMenu.Item>a</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>b</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    expect(container.querySelector('[accessibilityRole="none"]')).not.toBeNull();
  });
});

describe('Native ContextMenu — controlled open', () => {
  it('Root accepts external open + onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(
      <ContextMenu.Root open onOpenChange={onOpenChange}>
        <ContextMenu.Content>
          <ContextMenu.Item>cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    expect(container.querySelector('[accessibilityRole="menu"]')).not.toBeNull();
    // Selecting an item fires onOpenChange(false).
    clickHost(container.querySelector('[accessibilityRole="menuitem"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
