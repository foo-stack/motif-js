'use client';

import { Breadcrumb as HeadlessBreadcrumb } from '@usemotif/headless';
import type { CSSProperties, ReactNode } from 'react';
import { Box, type BoxProps } from 'usemotif';

const NAV_STYLE: CSSProperties = { fontSize: 14 };
const LINK_HOVER = { color: '$colors.text.default' } as const;

// A themed chevron between items (the headless wraps it in an aria-hidden span).
const SEPARATOR = (
  <Box as="span" px="$space.1" color="$colors.text.muted">
    ›
  </Box>
);

export interface BreadcrumbProps {
  readonly 'aria-label'?: string;
  /** Override the separator between items. Defaults to a muted chevron. */
  readonly separator?: ReactNode;
  readonly children?: ReactNode;
}

export interface BreadcrumbItemProps {
  /** Render the crumb as a link. Omit for the current (last) crumb. */
  readonly href?: string;
  readonly children?: ReactNode;
}

/** A crumb - a muted link when `href` is set, or emphasized current-page text. */
function BreadcrumbItem({ href, children }: BreadcrumbItemProps) {
  if (href === undefined) {
    return (
      <Box as="span" color="$colors.text.default" fontWeight={500}>
        {children}
      </Box>
    );
  }
  return (
    <Box
      as="a"
      color="$colors.text.muted"
      cursor="pointer"
      _hover={LINK_HOVER}
      // `href` goes to the underlying <a>; Box's element typing is generic
      // HTMLElement, so cast past it.
      {...({ href, style: { textDecoration: 'none' } } as unknown as BoxProps)}
    >
      {children}
    </Box>
  );
}

/**
 * Themed breadcrumb trail over the accessible headless `Breadcrumb` (a `nav`
 * landmark + ordered list, `aria-current="page"` on the last crumb). Use
 * `Breadcrumb.Item` for each crumb.
 *
 * ```tsx
 * <Breadcrumb>
 *   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
 *   <Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
 *   <Breadcrumb.Item>Data</Breadcrumb.Item>
 * </Breadcrumb>
 * ```
 */
function BreadcrumbRoot({ separator = SEPARATOR, children, ...rest }: BreadcrumbProps) {
  return (
    <HeadlessBreadcrumb
      separator={separator}
      style={NAV_STYLE}
      {...(rest['aria-label'] !== undefined ? { 'aria-label': rest['aria-label'] } : {})}
    >
      {children}
    </HeadlessBreadcrumb>
  );
}

/** Parts exported flat for the namespace module. Internal. */
export { BreadcrumbItem, BreadcrumbRoot };
