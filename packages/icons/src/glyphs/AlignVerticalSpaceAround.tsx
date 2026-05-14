import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlignVerticalSpaceAround(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="10" height="6" x="7" y="9" rx="2" />
          <Path d="M22 20H2" />
          <Path d="M22 4H2" />
        </>
      )}
    />
  );
}
