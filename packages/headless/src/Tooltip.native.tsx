import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native Tooltip — hover doesn't exist on touch devices. The
 * platform-correct fallback is a long-press popover; until that
 * lands, the native variant null-renders and warns once.
 */

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(`Tooltip.${name}`);
    return null;
  };
}

export interface TooltipRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface TooltipTriggerProps {
  children: ReactElement;
}
export interface TooltipContentProps {
  children?: ReactNode;
}

export const Tooltip = {
  Root: nullStub('Root'),
  Trigger: nullStub('Trigger'),
  Content: nullStub('Content'),
};
