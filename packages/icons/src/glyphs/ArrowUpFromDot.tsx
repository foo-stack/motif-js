import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUpFromDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m5 9 7-7 7 7" />
          <Path d="M12 16V2" />
          <Circle cx="12" cy="21" r="1" />
        </>
      )}
    />
  );
}
