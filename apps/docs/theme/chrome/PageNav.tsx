import { Link } from '@vorge/core/primitives';
import { usePage, useSidebar } from '@vorge/core/runtime';
import { useVorge } from '@vorge/core/runtime';
import type { SidebarItem } from '@vorge/core/sidebar';
import { ArrowLeft, ArrowRight } from './icons.js';

export function PageNav() {
  const route = usePage();
  const sidebar = useSidebar();
  const { manifest } = useVorge();
  const flat = flattenSidebarLinks(sidebar);
  const i = flat.indexOf(route.url);
  const prevUrl = i > 0 ? flat[i - 1] : undefined;
  const nextUrl = i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined;
  const prev = prevUrl ? manifest.byUrl[prevUrl] : undefined;
  const next = nextUrl ? manifest.byUrl[nextUrl] : undefined;

  if (!prev && !next) return null;

  return (
    <nav className="pagenav" aria-label="Page navigation">
      {prev ? (
        <Link href={prev.url} className="pagenav-link pagenav-link--prev">
          <span className="pagenav-link__label">Previous</span>
          <span className="pagenav-link__title">
            <ArrowLeft />
            {titleOf(prev)}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.url} className="pagenav-link pagenav-link--next">
          <span className="pagenav-link__label">Next</span>
          <span className="pagenav-link__title">
            {titleOf(next)}
            <ArrowRight />
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

interface RouteWithFm {
  url: string;
  frontmatter: { title?: unknown };
  headings: { depth: number; text: string }[];
}

function titleOf(route: RouteWithFm): string {
  const t = route.frontmatter.title;
  if (typeof t === 'string') return t;
  const h1 = route.headings.find((h) => h.depth === 1);
  return h1?.text ?? route.url;
}

function flattenSidebarLinks(items: SidebarItem[]): string[] {
  const out: string[] = [];
  const walk = (list: SidebarItem[]): void => {
    for (const it of list) {
      if ('link' in it) out.push(it.link);
      else walk(it.items);
    }
  };
  walk(items);
  return out;
}
