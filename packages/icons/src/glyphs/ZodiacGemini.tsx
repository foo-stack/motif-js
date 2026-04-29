import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ZodiacGemini(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 4.525v14.948" />
          <Path d="M20 3A17 17 0 0 1 4 3" />
          <Path d="M4 21a17 17 0 0 1 16 0" />
          <Path d="M8 4.525v14.948" />
        </>
      )}
    />
  );
}
