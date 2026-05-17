import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Tv2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M7 21h10" />
          <Rect width="20" height="14" x="2" y="3" rx="2" />
        </>
      )}
    />
  );
}
