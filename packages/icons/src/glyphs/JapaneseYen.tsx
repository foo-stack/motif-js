import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function JapaneseYen(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" />
          <Path d="M6 15h12" />
          <Path d="M6 11h12" />
        </>
      )}
    />
  );
}
