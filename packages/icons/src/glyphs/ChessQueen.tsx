import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChessQueen(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
          <Path d="m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402" />
          <Path d="m20 9-3 9" />
          <Path d="m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34" />
          <Path d="M7 18 4 9" />
          <Circle cx="12" cy="4" r="2" />
          <Circle cx="20" cy="7" r="2" />
          <Circle cx="4" cy="7" r="2" />
        </>
      )}
    />
  );
}
