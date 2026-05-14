import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ChevronFirst(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m17 18-6-6 6-6" />
          <Path d="M7 6v12" />
        </>
      )}
    />
  );
}
