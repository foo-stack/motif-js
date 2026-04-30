'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, FilePen, Github } from '@motif-js/icons';

interface TocItem {
  readonly id: string;
  readonly label: string;
  readonly indent: boolean;
}

const SCROLL_OFFSET = 120;

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function OnThisPage({ articleSelector = '.article' }: { articleSelector?: string }) {
  const [items, setItems] = useState<ReadonlyArray<TocItem>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (article === null) return;
    const headings = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'));
    const next: TocItem[] = headings
      .map((el) => {
        if (el.id === '') {
          el.id = slugify(el.textContent ?? '');
        }
        return {
          id: el.id,
          label: el.textContent?.trim() ?? '',
          indent: el.tagName === 'H3',
        };
      })
      .filter((it) => it.id !== '');
    setItems(next);
    setActiveId(next[0]?.id ?? null);
  }, [articleSelector]);

  useEffect(() => {
    if (items.length === 0) return;
    const onScroll = () => {
      let current = items[0]?.id ?? null;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el !== null && el.getBoundingClientRect().top < SCROLL_OFFSET) {
          current = it.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="toc" aria-label="On this page">
      <span className="eyebrow">
        <span className="eyebrow__dot" />
        On this page
      </span>
      <ul>
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={
                  'toc-link' +
                  (it.indent ? ' toc-link--indent' : '') +
                  (active ? ' toc-link--active' : '')
                }
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="toc__foot">
        <a href="https://github.com/foo-stack/motif-js" target="_blank" rel="noreferrer">
          <FilePen /> Edit this page
        </a>
        <a href="https://github.com/foo-stack/motif-js" target="_blank" rel="noreferrer">
          <Github /> Source on GitHub
        </a>
        <a href="https://github.com/foo-stack/motif-js/issues/new" target="_blank" rel="noreferrer">
          <ArrowUpRight /> Report an issue
        </a>
      </div>
    </aside>
  );
}
