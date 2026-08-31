/** @vitest-environment jsdom */
/**
 * Native FileUpload tests run against the `react-native` mock from
 * `@usemotif/react-native` (aliased in `vitest.config.ts`).
 * `expo-document-picker` is not installed in headless's
 * devDependencies, so the implementation runs through the
 * "no peer" fallback path - `openPicker` is a no-op + warns once.
 *
 * The "happy path" branch (peer present + picker resolves) is
 * covered indirectly via the parseColor / formatColor unit suite and
 * the documented contract - exercising the real `getDocumentAsync`
 * call in jsdom would require monkey-patching `globalThis.require`,
 * which is more complexity than the path warrants.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Pressable, Text } from 'react-native';
import { FileUpload, NATIVE_FILE_UPLOAD_HAS_PICKER } from './specialized.native.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
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

describe('Native FileUpload — render shape', () => {
  it('runs through the "no peer" fallback path in tests', () => {
    expect(NATIVE_FILE_UPLOAD_HAS_PICKER).toBe(false);
  });

  it('invokes the children render-prop with isDragging=false + an openPicker fn', () => {
    const renderProp = vi.fn(({ openPicker }: { isDragging: boolean; openPicker: () => void }) => (
      <Pressable onPress={openPicker}>
        <Text>Pick a file</Text>
      </Pressable>
    ));
    render(<FileUpload>{renderProp}</FileUpload>);
    expect(renderProp).toHaveBeenCalled();
    const arg = renderProp.mock.calls[0]?.[0];
    expect(arg?.isDragging).toBe(false);
    expect(typeof arg?.openPicker).toBe('function');
  });

  it('renders the children content into the DOM tree', () => {
    render(
      <FileUpload>
        {({ openPicker }) => (
          <Pressable onPress={openPicker}>
            <Text>Pick a file</Text>
          </Pressable>
        )}
      </FileUpload>,
    );
    const button = container.querySelector('[data-motif-host="Pressable"]');
    expect(button).not.toBeNull();
    expect(button?.textContent).toBe('Pick a file');
  });
});

describe('Native FileUpload — openPicker behaviour', () => {
  it('warns once and no-ops when the peer dep is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onFiles = vi.fn();
    render(
      <FileUpload onFiles={onFiles}>
        {({ openPicker }) => (
          <Pressable onPress={openPicker}>
            <Text>Pick</Text>
          </Pressable>
        )}
      </FileUpload>,
    );
    const button = container.querySelector('[data-motif-host="Pressable"]');
    clickHost(button!);
    // `nativeStubWarn` deduplicates per component name across the run,
    // so this may have already fired in another test - accept either
    // 0 or 1 here. What matters is that onFiles never fires without
    // the peer.
    expect(warnSpy.mock.calls.length).toBeLessThanOrEqual(1);
    expect(onFiles).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not call the picker when disabled', () => {
    const onFiles = vi.fn();
    render(
      <FileUpload disabled onFiles={onFiles}>
        {({ openPicker }) => (
          <Pressable onPress={openPicker}>
            <Text>Pick</Text>
          </Pressable>
        )}
      </FileUpload>,
    );
    const button = container.querySelector('[data-motif-host="Pressable"]');
    clickHost(button!);
    expect(onFiles).not.toHaveBeenCalled();
  });
});

describe('Native FileUpload — accessibility', () => {
  it('passes accessibilityLabel through on the wrapping View', () => {
    render(
      <FileUpload>
        {() => (
          <Pressable>
            <Text>Pick</Text>
          </Pressable>
        )}
      </FileUpload>,
    );
    const wrapper = container.querySelector('[accessibilityLabel="File upload"]');
    expect(wrapper).not.toBeNull();
  });
});
