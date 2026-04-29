import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignJustify(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5h18" />
          <Path d="M3 12h18" />
          <Path d="M3 19h18" />
        </>
      )}
    />
  );
}
