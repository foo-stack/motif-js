import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native ContextMenu — there's no portable right-click affordance on
 * touch devices. Use `<Menu>` with a long-press trigger or surface
 * actions via a bottom sheet instead.
 *
 * Each ContextMenu sub-component renders nothing and emits a one-time
 * console warning to make the platform mismatch explicit at dev time.
 */

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(`ContextMenu.${name}`);
    return null;
  };
}

export const ContextMenu = {
  Root: nullStub('Root'),
  Trigger: nullStub('Trigger'),
  Content: nullStub('Content'),
  Item: nullStub('Item'),
  Separator: nullStub('Separator'),
};
