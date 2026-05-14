import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ZodiacPisces(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 21a15 15 0 0 1 0-18" />
          <Path d="M20 12H4" />
          <Path d="M5 3a15 15 0 0 1 0 18" />
        </>
      )}
    />
  );
}
