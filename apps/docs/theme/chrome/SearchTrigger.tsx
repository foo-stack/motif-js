import { Search } from './icons.js';

export interface SearchTriggerProps {
  onOpen?: () => void;
}

export function SearchTrigger({ onOpen }: SearchTriggerProps) {
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
