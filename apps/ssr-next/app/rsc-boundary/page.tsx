import { Box, Text, VStack } from '@usemotif/react';
import { Checkbox, Switch } from '@usemotif/headless';
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
 * Only plain function exports are used. Compound components exported as an
 * object namespace (`Dialog`, `Popover`, `Menu`, and the rest) cannot be
 * reached through a client reference: the proxy exposes named exports, so
 * `Dialog.Root` resolves to undefined and the render fails. Those still work
 * normally from a client component. Keep this page to the shapes that cross
 * the boundary, or it stops testing the directive and starts testing that
 * unrelated limitation.
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
      </VStack>
    </Box>
  );
}
