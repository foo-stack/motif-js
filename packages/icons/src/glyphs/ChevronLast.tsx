import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronLast(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m7 18 6-6-6-6" />
          <Path d="M17 6v12" />
        </>
      )}
    />
  );
}
