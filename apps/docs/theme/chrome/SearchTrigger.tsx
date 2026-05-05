import { useCallback } from 'react';
import { Search } from './icons.js';

const SEARCH_OPEN_EVENT = 'vorge:search:open';

export function SearchTrigger() {
  const onOpen = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
    }
  }, []);

  return (
    <button type="button" className="nav-search" onClick={onOpen} aria-label="Search the docs">
      <Search className="nav-search__icon" />
      <span className="nav-search__placeholder">Search the docs</span>
      <span className="nav-search__kbd">
        <span className="kbd">⌘</span>
        <span className="kbd">K</span>
      </span>
    </button>
  );
}
