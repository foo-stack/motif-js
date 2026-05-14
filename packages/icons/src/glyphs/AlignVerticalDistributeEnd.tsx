import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlignVerticalDistributeEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="14" height="6" x="5" y="14" rx="2" />
          <Rect width="10" height="6" x="7" y="4" rx="2" />
          <Path d="M2 20h20" />
          <Path d="M2 10h20" />
        </>
      )}
    />
  );
}
