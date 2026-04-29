import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareSigma(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M16 8.9V7H8l4 5-4 5h8v-1.9" />
        </>
      )}
    />
  );
}
