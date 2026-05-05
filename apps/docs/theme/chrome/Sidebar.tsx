import { useSidebar } from '@vorge/core/runtime';
import type { SidebarItem } from '@vorge/core/sidebar';
import { Link } from '@vorge/core/primitives';

export function Sidebar() {
  const items = useSidebar();

  return (
    <aside className="sidebar" aria-label="Documentation sidebar">
      {items.map((item) => (
        <SidebarSection key={itemKey(item)} item={item} />
      ))}
    </aside>
  );
}

function SidebarSection({ item }: { item: SidebarItem }) {
  if ('link' in item) {
    return (
      <div className="side-section">
        <ul className="side-list">
          <SidebarLink item={item} />
        </ul>
      </div>
    );
  }
  return (
    <div className="side-section">
      <span className="side-title">{item.text}</span>
      <ul className="side-list">
        {item.items.map((sub) => (
          <SidebarLink key={itemKey(sub)} item={sub} />
        ))}
      </ul>
    </div>
  );
}

function SidebarLink({ item }: { item: SidebarItem }) {
  if ('link' in item) {
    return (
      <li>
        <Link href={item.link} className="side-link" activeClassName="side-link--active">
          {item.text}
          {item.badge ? (
            <span className={`side-link__badge side-link__badge--${item.badge}`}>{item.badge}</span>
          ) : null}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <span className="side-title">{item.text}</span>
      <ul className="side-list">
        {item.items.map((sub) => (
          <SidebarLink key={itemKey(sub)} item={sub} />
        ))}
      </ul>
    </li>
  );
}

function itemKey(item: SidebarItem): string {
  return 'link' in item ? item.link : item.text;
}
