import { Tabs as Headless } from '@usemotif/headless';
import { TabsList, TabsPanel, TabsTab } from './Tabs.js';

/**
 * Namespace assembly, deliberately in its own module and deliberately without
 * a `'use client'` directive.
 *
 * It must be in the server graph, so the object's properties are client
 * references rather than reads through a proxy, and it must not sit in the
 * barrel, because an object built from property reads on imported bindings is
 * not something a bundler can drop as pure. See `Modal.namespace.ts`.
 */
export const Tabs = {
  Root: Headless.Root,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
};
