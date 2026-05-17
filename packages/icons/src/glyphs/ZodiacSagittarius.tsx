import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ZodiacSagittarius(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15 3h6v6" />
          <Path d="M21 3 3 21" />
          <Path d="m9 9 6 6" />
        </>
      )}
    />
  );
}
