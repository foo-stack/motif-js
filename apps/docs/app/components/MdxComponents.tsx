import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import { CodeBlockShell } from './content/CodeBlockShell';
import { Callout } from './content/Callout';
import { Card, HomeCard } from './content/Card';
import { ArticleHeader, Eyebrow } from './content/ArticleHeader';
import { Sandbox } from './content/Sandbox';

/**
 * MDX → component mapping.
 *
 * Element styling (h1/h2/h3, p, blockquote, ul/ol, code, table) is
 * handled by the design's `.article` CSS cascade in `site.css`, so
 * the provider only intervenes where structural composition is
 * required:
 *
 * - `pre` is rewrapped by `CodeBlockShell` to add the design's
 *   `.code` head bar (filename + copy action).
 * - The content components (`Callout`, `Card`, `ArticleHeader`,
 *   `Eyebrow`, `Sandbox`) are passed through so MDX files can
 *   reference them with no per-file imports.
 *
 * Section anchors: H2 / H3 inside `.article` get an `id` attribute
 * derived from the heading text so the right-rail TOC can link to
 * them. We assign the id at MDX-render time rather than via a remark
 * plugin to avoid pulling in another build dep.
 */
function slugify(text: unknown): string {
  return String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...rest }: ComponentPropsWithoutRef<'h2'>) => (
    <h2 id={slugify(children)} {...rest}>
      {children}
    </h2>
  ),
  h3: ({ children, ...rest }: ComponentPropsWithoutRef<'h3'>) => (
    <h3 id={slugify(children)} {...rest}>
      {children}
    </h3>
  ),
  pre: CodeBlockShell,

  Callout,
  Card,
  HomeCard,
  ArticleHeader,
  Eyebrow,
  Sandbox,
};
