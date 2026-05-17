import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ZodiacAries(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 7.5a4.5 4.5 0 1 1 5 4.5" />
          <Path d="M7 12a4.5 4.5 0 1 1 5-4.5V21" />
        </>
      )}
    />
  );
}
