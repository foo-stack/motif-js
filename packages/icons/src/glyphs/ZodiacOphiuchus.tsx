import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ZodiacOphiuchus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 10A6.06 6.06 0 0 1 12 10 A6.06 6.06 0 0 0 21 10" />
          <Path d="M6 3v12a6 6 0 0 0 12 0V3" />
        </>
      )}
    />
  );
}
