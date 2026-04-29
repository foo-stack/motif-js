import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SignpostBig(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 9H4L2 7l2-2h6" />
          <Path d="M14 5h6l2 2-2 2h-6" />
          <Path d="M10 22V4a2 2 0 1 1 4 0v18" />
          <Path d="M8 22h8" />
        </>
      )}
    />
  );
}
