import { Box, Text, VStack } from '@usemotif/react';
import { Checkbox, Dialog, Switch } from '@usemotif/headless';
import { Badge, Card } from '@usemotif/ui';

/**
 * Regression guard for the client boundary, not a feature demo.
 *
 * This file is deliberately a Server Component: no `'use client'`, so Next
 * compiles it into the RSC graph. `@usemotif/headless` and `@usemotif/ui` are
 * client-only, and importing them from here only works because their published
 * barrels carry the `'use client'` directive. Drop that directive and
 * `next build` fails here rather than in a consumer's app.
 *
 * `Dialog` is here because a compound component is the harder case, and it used
 * to be an impossible one. A client reference is a proxy that exposes named
 * exports and nothing else, so an object namespace exported from the client
 * module gave `Dialog.Root === undefined` and the render died on an invalid
 * element type. `@usemotif/headless` now assembles that namespace in its own
 * server-safe barrel out of parts the client chunk exports flat, so every
 * property is itself a client reference. Removing `Dialog` from this page
 * removes the only automated proof that still holds.
 *
 * The dialog is deliberately left closed. `Dialog.Content` returns null until
 * it opens, so the markup this page must contain is the trigger, carrying the
 * `aria-expanded` and `aria-haspopup` that `Dialog.Trigger` clones onto its
 * child. Those attributes are the evidence: a namespace that failed to cross
 * would not render a plain button with them attached.
 *
 * The other 15 headless namespaces and every `@usemotif/ui` namespace still
 * have the object-export shape and still cannot cross. Add them here as they
 * are converted, not before.
 *
 * Render the components, do not merely import them. An unused import can be
 * elided, which would quietly stop testing anything.
 */
export default function RscBoundaryPage() {
  return (
    <Box bg="$colors.surface.base" minH="100vh" color="$colors.text.default" p="$8">
      <VStack gap="$4" maxW={720} mx="auto">
        <Text as="h1" fontSize="$2xl" fontWeight="$bold" mt={0} mb={0}>
          Client boundary from a Server Component
        </Text>

        <Card>
          <VStack gap="$3">
            <Badge>@usemotif/ui</Badge>
            <Text fontSize="$sm">A themed kit component rendered inside the server graph.</Text>
          </VStack>
        </Card>

        <VStack gap="$2">
          <Text fontSize="$sm">@usemotif/headless behaviours across the same boundary:</Text>
          <Switch defaultChecked aria-label="Switch across the boundary" />
          <Checkbox defaultChecked aria-label="Checkbox across the boundary" />
        </VStack>

        <VStack gap="$2">
          <Text fontSize="$sm">A compound component, assembled in the server graph:</Text>
          <Dialog.Root>
            <Dialog.Trigger>
              <button type="button">Open the dialog</button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Across the boundary</Dialog.Title>
              <Dialog.Description>
                Rendered from a Server Component through a client reference.
              </Dialog.Description>
              <Dialog.Close>
                <button type="button">Close</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </VStack>
      </VStack>
    </Box>
  );
}
