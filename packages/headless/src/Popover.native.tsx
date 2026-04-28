import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native Popover — a real port needs platform-aware positioning
 * (bottom-sheet on phones, anchored panel on tablets). Until that
 * lands, the native variant null-renders and warns once.
 */

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(`Popover.${name}`);
    return null;
  };
}

export interface PopoverRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface PopoverTriggerProps {
  children: ReactElement;
}
export interface PopoverContentProps {
  children?: ReactNode;
}
export interface PopoverCloseProps {
  children: ReactElement;
}

export const Popover = {
  Root: nullStub('Root'),
  Trigger: nullStub('Trigger'),
  Content: nullStub('Content'),
  Close: nullStub('Close'),
};
