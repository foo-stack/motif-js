import { BreadcrumbItem, BreadcrumbRoot } from './Breadcrumb.js';

/**
 * Probe: does `Object.assign` onto a client reference survive the boundary?
 */
export const Breadcrumb = Object.assign(BreadcrumbRoot, { Item: BreadcrumbItem });
