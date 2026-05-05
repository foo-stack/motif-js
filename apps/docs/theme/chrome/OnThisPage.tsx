import { useTOC } from '@vorge/core/runtime';
import { Edit } from './icons.js';

export interface OnThisPageProps {
  editPath?: string;
}

export function OnThisPage({ editPath }: OnThisPageProps) {
  const headings = useTOC();
  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc__label">On this page</p>
      <ul>
        {headings.map((h) => (
          <li key={h.slug} data-depth={h.depth}>
            <a className="toc-link" href={`#${h.slug}`}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
      {editPath ? (
        <div className="toc__foot">
          <a href={editPath} target="_blank" rel="noreferrer">
            <Edit />
            Edit this page on GitHub
          </a>
        </div>
      ) : null}
    </nav>
  );
}
