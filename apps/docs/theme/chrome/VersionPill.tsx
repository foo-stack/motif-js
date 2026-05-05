import { useCallback, useEffect, useRef, useState } from 'react';
import { Chevron } from './icons.js';

const VERSIONS = [
  { version: 'v1.1.2', label: 'Latest', tag: 'current' as const },
  { version: 'v1.1.1', label: 'Previous', tag: 'stable' as const },
  { version: 'v1.2.0', label: 'Pre-release', tag: 'canary' as const },
];

const WRAP_STYLE = { position: 'relative' as const };
const MENU_STYLE = { left: 'auto' as const, right: 0 };

export function VersionPill() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={wrap} style={WRAP_STYLE}>
      <button
        type="button"
        className="version-pill"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        v1.1.2
        <Chevron />
      </button>
      {open ? (
        <div className="version-menu" role="menu" style={MENU_STYLE}>
          {VERSIONS.map((v) => (
            <button key={v.version} type="button" role="menuitem" className="version-menu__item">
              <span className="version-menu__item-version">{v.version}</span>
              <span>{v.label}</span>
              <span className={`version-menu__item-tag version-menu__item-tag--${v.tag}`}>
                {v.tag}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
