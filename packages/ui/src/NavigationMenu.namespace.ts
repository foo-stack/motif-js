import { NavigationMenuItem, NavigationMenuRoot } from './NavigationMenu.js';

/**
 * Namespace assembly in the server graph. See `Modal.namespace.ts`.
 *
 * `Object.assign` onto a client reference is fine: the reference is the
 * component, and attaching `Item` to it leaves both usable across the boundary.
 * Verified by rendering `<Breadcrumb><Breadcrumb.Item/></Breadcrumb>` from a
 * Server Component, which is the same shape.
 */
export const NavigationMenu = Object.assign(NavigationMenuRoot, { Item: NavigationMenuItem });
