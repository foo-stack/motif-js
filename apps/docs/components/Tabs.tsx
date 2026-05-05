import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

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
    <div className="tabs">
      <div className="tabs__list" role="tablist">
        {tabs.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`tabs__trigger${i === active ? ' tabs__trigger--active' : ''}`}
            onClick={select(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <Context.Provider value={value}>{children}</Context.Provider>
    </div>
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
    <div className="tabs__panel" role="tabpanel">
      {children}
    </div>
  );
}
