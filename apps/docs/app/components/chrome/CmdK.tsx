'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Search } from '@motif-js/icons';
import { useNavigate } from 'react-router';
import { usePagefind, type PagefindResult } from '../../state/pagefind';

export interface CmdKProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

const RESULT_LIMIT = 10;

export function CmdK({ open, onOpenChange }: CmdKProps) {
  const { ready, hits, query, setQuery } = usePagefind();
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Reset on close.
  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIdx(0);
    } else {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open, setQuery]);

  useEffect(() => {
    setActiveIdx(0);
  }, [hits, query]);

  const visible = hits.slice(0, RESULT_LIMIT);

  const onSelect = useCallback(
    (hit: PagefindResult) => {
      onOpenChange(false);
      const path = hit.url.replace(/\/index\.html$/, '').replace(/\.html$/, '');
      navigate(path === '' ? '/' : path);
    },
    [navigate, onOpenChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, visible.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const hit = visible[activeIdx];
        if (hit !== undefined) onSelect(hit);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, visible, activeIdx, onSelect, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="search-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="search">
        <div className="search__head">
          <Search className="search__icon" />
          <input
            ref={inputRef}
            className="search__input"
            placeholder="Search the docs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            aria-label="Search the docs"
          />
          <button type="button" className="search__close" onClick={() => onOpenChange(false)}>
            esc
          </button>
        </div>
        <div className="search__body">
          {!ready ? (
            <div className="search__empty">
              Search is built into the static output by Pagefind. Run <code>yarn build</code> and
              view the production site to try it.
            </div>
          ) : query.trim().length === 0 ? (
            <div className="search__empty">Type to search across every Tier-1 page.</div>
          ) : visible.length === 0 ? (
            <div className="search__empty">No results for "{query}"</div>
          ) : (
            <div className="search__group">
              <div className="search__group-title">Pages</div>
              {visible.map((hit, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={hit.id}
                    type="button"
                    className={'search__hit' + (active ? ' search__hit--active' : '')}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelect(hit);
                    }}
                  >
                    <Search />
                    <div>
                      <div className="search__hit-title">{hit.meta.title ?? hit.url}</div>
                      <div
                        className="search__hit-sub"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        {...({ dangerouslySetInnerHTML: { __html: hit.excerpt } } as any)}
                      />
                    </div>
                    <ArrowRight className="search__hit-arrow" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="search__foot">
          <span className="search__foot-item">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> navigate
          </span>
          <span className="search__foot-item">
            <span className="kbd">↵</span> open
          </span>
          <span className="search__foot-item">
            <span className="kbd">esc</span> close
          </span>
          <span style={{ marginLeft: 'auto' }}>{visible.length} results</span>
        </div>
      </div>
    </div>
  );
}
