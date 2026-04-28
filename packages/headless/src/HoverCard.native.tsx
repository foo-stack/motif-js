import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native HoverCard — hover doesn't exist on touch devices. A real
 * port should fall back to a long-press popover; until that lands,
 * the native variant null-renders and warns once.
 */

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(`HoverCard.${name}`);
    return null;
  };
}

export interface HoverCardRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface HoverCardTriggerProps {
  children: ReactElement;
}
export interface HoverCardContentProps {
  children?: ReactNode;
}

export const HoverCard = {
  Root: nullStub('Root'),
  Trigger: nullStub('Trigger'),
  Content: nullStub('Content'),
};
