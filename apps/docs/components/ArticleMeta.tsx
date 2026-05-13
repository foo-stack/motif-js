import { Box } from '@motif-js/react';
import { usePage } from '@vorge/core/runtime';
import type { ReactNode } from 'react';
import { Clock, Edit, Globe } from './icons.js';

const EDIT_REPO = 'foo-stack/motif-js';
const EDIT_BRANCH = 'main';

interface ArticleMetaFrontmatter {
  last_verified?: string;
  platforms?: ('web' | 'native')[];
  hideEditLink?: boolean;
}

export function ArticleMeta() {
  const route = usePage();
  const fm = route.frontmatter as ArticleMetaFrontmatter;

  const updated = fm.last_verified ? formatRelativeDate(fm.last_verified) : null;
  // route.filePath is the absolute path to the MDX source; trim to a repo-relative
  // path so the edit link survives across machines.
  const repoRelPath = toRepoRelative(route.filePath);
  const editUrl = repoRelPath
    ? `https://github.com/${EDIT_REPO}/edit/${EDIT_BRANCH}/${repoRelPath}`
    : null;
  const platforms = formatPlatforms(fm.platforms);

  return (
    <Box
      role="contentinfo"
      mt={-6}
      mb={32}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="center"
      gap={20}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="13px"
      lineHeight={1}
      color="$colors.fg.faint"
    >
      {updated ? (
        <MetaItem icon={<Clock width={13} height={13} />}>Updated {updated}</MetaItem>
      ) : null}
      {editUrl && !fm.hideEditLink ? (
        <MetaItem icon={<Edit width={13} height={13} />} href={editUrl}>
          Edit on GitHub
        </MetaItem>
      ) : null}
      {platforms ? <MetaItem icon={<Globe width={13} height={13} />}>{platforms}</MetaItem> : null}
    </Box>
  );
}

function MetaItem({
  icon,
  children,
  href,
}: {
  icon: ReactNode;
  children: ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <Box as="span" display="inline-flex" style={{ opacity: 0.75 }}>
        {icon}
      </Box>
      <Box as="span">{children}</Box>
    </>
  );
  if (href) {
    return (
      <Box
        as="a"
        // @ts-expect-error -- href is valid on <a>; Box's prop bag is HTML-tag-agnostic.
        href={href}
        target="_blank"
        rel="noreferrer"
        display="inline-flex"
        alignItems="center"
        gap={6}
        color="$colors.fg.faint"
        style={{ textDecoration: 'none' }}
        _hover={{ color: '$colors.fg.muted' }}
      >
        {inner}
      </Box>
    );
  }
  return (
    <Box as="span" display="inline-flex" alignItems="center" gap={6}>
      {inner}
    </Box>
  );
}

function formatRelativeDate(iso: string): string | null {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days < 0) return 'today';
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const w = Math.round(days / 7);
    return `${w} week${w === 1 ? '' : 's'} ago`;
  }
  if (days < 365) {
    const m = Math.round(days / 30);
    return `${m} month${m === 1 ? '' : 's'} ago`;
  }
  const y = Math.floor(days / 365);
  return `${y} year${y === 1 ? '' : 's'} ago`;
}

function formatPlatforms(p?: ('web' | 'native')[]): string {
  if (!p || p.length === 0) return 'Web & native';
  if (p.length === 2) return 'Web & native';
  if (p[0] === 'web') return 'Web only';
  if (p[0] === 'native') return 'Native only';
  return 'Web & native';
}

function toRepoRelative(absPath: string): string | null {
  // route.filePath looks like ".../motif-js/apps/docs/content/getting-started/introduction.mdx".
  // Trim to "apps/docs/content/...".
  const i = absPath.indexOf('/apps/docs/content/');
  if (i < 0) return null;
  return absPath.slice(i + 1);
}
