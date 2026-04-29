import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowDownWideNarrow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m3 16 4 4 4-4" />
          <Path d="M7 20V4" />
          <Path d="M11 4h10" />
          <Path d="M11 8h7" />
          <Path d="M11 12h4" />
        </>
      )}
    />
  );
}
