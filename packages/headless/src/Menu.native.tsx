import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native Menu — a real port needs platform-aware positioning
 * (popover on tablet, bottom-sheet on phones). Until that lands, the
 * native variant null-renders and warns once.
 */

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(`Menu.${name}`);
    return null;
  };
}

export interface MenuRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface MenuTriggerProps {
  children: ReactElement;
}
export interface MenuContentProps {
  children?: ReactNode;
}
export interface MenuItemProps {
  children?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export const Menu = {
  Root: nullStub('Root'),
  Trigger: nullStub('Trigger'),
  Content: nullStub('Content'),
  Item: nullStub('Item'),
  Separator: nullStub('Separator'),
};
