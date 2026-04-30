'use client';

import { Dialog } from '@motif-js/headless';
import { X } from '@motif-js/icons';
import { Link as RRLink, useLocation } from 'react-router';
import { Lockup } from './Lockup';

interface SidebarItem {
  readonly id: string;
  readonly label: string;
  readonly to: string;
  readonly badge?: 'new' | 'canary';
}

interface SidebarSection {
  readonly title: string;
  readonly items: ReadonlyArray<SidebarItem>;
}

const SECTIONS: ReadonlyArray<SidebarSection> = [
  {
    title: 'Getting started',
    items: [
      { id: 'introduction', label: 'Introduction', to: '/docs/introduction' },
      { id: 'installation', label: 'Installation', to: '/docs/installation' },
      { id: 'first-style', label: 'Your first style', to: '/docs/your-first-style' },
      { id: 'platforms', label: 'Web and native', to: '/docs/web-and-native' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { id: 'tokens', label: 'Tokens', to: '/docs/tokens' },
      { id: 'variants', label: 'Variants', to: '/docs/variants' },
      { id: 'theming', label: 'Theming', to: '/docs/theming' },
      { id: 'composition', label: 'Composition', to: '/docs/composition' },
      { id: 'responsive', label: 'Responsive styles', to: '/docs/responsive', badge: 'new' },
    ],
  },
  {
    title: 'API',
    items: [
      { id: 'api-box', label: 'Box', to: '/api/box' },
      { id: 'api-create-theme', label: 'createTheme()', to: '/api/createTheme' },
      { id: 'api-styled', label: 'styled', to: '/api/styled' },
      { id: 'api-use-theme', label: 'useTheme()', to: '/api/useTheme' },
    ],
  },
  {
    title: 'Recipes',
    items: [
      { id: 'r-buttons', label: 'Buttons', to: '/recipes/buttons' },
      { id: 'r-forms', label: 'Forms', to: '/recipes/forms' },
      { id: 'r-layouts', label: 'Layouts', to: '/recipes/layouts' },
      { id: 'r-animation', label: 'Animation', to: '/recipes/animation' },
    ],
  },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <>
      {SECTIONS.map((section) => (
        <div key={section.title} className="side-section">
          <span className="side-title">{section.title}</span>
          <ul className="side-list">
            {section.items.map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.id}>
                  <RRLink
                    to={item.to}
                    className={'side-link' + (active ? ' side-link--active' : '')}
                    onClick={onNavigate}
                  >
                    {item.label}
                    {item.badge !== undefined && (
                      <span className={`side-link__badge side-link__badge--${item.badge}`}>
                        {item.badge}
                      </span>
                    )}
                  </RRLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarBody />
    </aside>
  );
}

export interface SidebarSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

export function SidebarSheet({ open, onOpenChange }: SidebarSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: 'min(320px, 88vw)',
            zIndex: 60,
            background: 'var(--bg-paper)',
            borderRight: '1px solid var(--line)',
            boxShadow: 'var(--shadow-3)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid var(--line-faint)',
            }}
          >
            <Lockup />
            <Dialog.Close>
              <button type="button" aria-label="Close navigation" className="icon-btn">
                <X />
              </button>
            </Dialog.Close>
          </div>
          <nav
            aria-label="Documentation"
            style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 24px 12px' }}
          >
            <SidebarBody onNavigate={() => onOpenChange(false)} />
          </nav>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
