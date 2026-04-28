import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Modal, Pressable, View, type ViewStyle } from 'react-native';

/**
 * Native Tooltip — hover doesn't exist on touch, so the
 * platform-correct activation is a long-press. The trigger sets
 * `onLongPress` to open and dismisses on tap-anywhere via the
 * scrim Pressable inside the Modal.
 */

interface TooltipContextValue {
  readonly open: boolean;
  readonly setOpen: (next: boolean) => void;
  readonly contentId: string;
}
const TooltipContext = createContext<TooltipContextValue | null>(null);
function useTooltipContext(component: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (ctx === null) throw new Error(`${component} must be inside <Tooltip.Root>.`);
  return ctx;
}

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
function Root({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: TooltipRootProps): ReactElement {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );
  const id = useId();
  return (
    <TooltipContext.Provider value={{ open, setOpen, contentId: `${id}-tooltip` }}>
      {children}
    </TooltipContext.Provider>
  );
}

export interface TooltipTriggerProps {
  children: ReactElement<{
    onLongPress?: () => void;
    accessibilityHint?: string;
  }>;
}
function Trigger({ children }: TooltipTriggerProps): ReactElement {
  const ctx = useTooltipContext('Tooltip.Trigger');
  if (!isValidElement(children)) {
    throw new Error('Tooltip.Trigger expects a single React element child.');
  }
  const childOnLongPress = children.props.onLongPress;
  return cloneElement(children, {
    accessibilityHint: ctx.contentId,
    onLongPress: () => {
      childOnLongPress?.();
      ctx.setOpen(true);
    },
  });
}

export interface TooltipContentProps {
  children?: ReactNode;
  style?: ViewStyle;
}
function Content({ children, style }: TooltipContentProps): ReactElement | null {
  const ctx = useTooltipContext('Tooltip.Content');
  if (!ctx.open) return null;
  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <Pressable
        onPress={() => ctx.setOpen(false)}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View nativeID={ctx.contentId} accessibilityRole="text" style={style}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

export const Tooltip = { Root, Trigger, Content };
