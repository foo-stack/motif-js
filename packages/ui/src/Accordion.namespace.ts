import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from './Accordion.js';

/**
 * Namespace assembly, deliberately in its own module and deliberately without
 * a `'use client'` directive.
 *
 * It must be in the server graph, so the object's properties are client
 * references rather than reads through a proxy, and it must not sit in the
 * barrel, because an object built from property reads on imported bindings is
 * not something a bundler can drop as pure. See `Modal.namespace.ts`.
 */
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
