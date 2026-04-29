import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChessRook(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
          <Path d="M10 2v2" />
          <Path d="M14 2v2" />
          <Path d="m17 18-1-9" />
          <Path d="M6 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2" />
          <Path d="M6 4h12" />
          <Path d="m7 18 1-9" />
        </>
      )}
    />
  );
}
