import { Box } from '@motif-js/react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Btn } from '../theme/chrome/Anchor.js';

interface TabsContextValue {
  active: number;
}

const Context = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  children: ReactNode;
  tabs: readonly string[];
  initial?: number;
}

export function Tabs({ children, tabs, initial = 0 }: TabsProps) {
  const [active, setActive] = useState(Math.min(Math.max(initial, 0), tabs.length - 1));
  const select = useCallback((i: number) => () => setActive(i), []);
  const value = useMemo<TabsContextValue>(() => ({ active }), [active]);

  return (
    <Box display="flex" flexDirection="column" my={22}>
      <Box
        display="flex"
        borderBottomStyle="solid"
        borderBottomWidth={1}
        borderBottomColor="$colors.line.faint"
        mb={16}
        role="tablist"
      >
        {tabs.map((label, i) => (
          <Trigger key={label} label={label} active={i === active} onClick={select(i)} />
        ))}
      </Box>
      <Context.Provider value={value}>{children}</Context.Provider>
    </Box>
  );
}

function Trigger({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Btn
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      position="relative"
      mb="-1px"
      py={10}
      px={14}
      fontFamily="$fontFamilies.sans"
      fontWeight={500}
      fontSize="13px"
      lineHeight={1}
      color={active ? '$colors.fg.strong' : '$colors.fg.muted'}
      bg="transparent"
      borderWidth={0}
      cursor="pointer"
      transition="color 160ms var(--easings-base)"
      {...(active
        ? {
            _after: {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              h: '2px',
              bg: '$colors.accent.base',
            },
          }
        : { _hover: { color: '$colors.fg.strong' } })}
    >
      {label}
    </Btn>
  );
}

export interface TabPanelProps {
  index: number;
  children: ReactNode;
}

export function TabPanel({ index, children }: TabPanelProps) {
  const ctx = useContext(Context);
  if (!ctx || ctx.active !== index) return null;
  return (
    <Box display="block" role="tabpanel">
      {children}
    </Box>
  );
}
