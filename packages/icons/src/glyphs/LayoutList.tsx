import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LayoutList(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="7" height="7" x="3" y="3" rx="1" />
          <Rect width="7" height="7" x="3" y="14" rx="1" />
          <Path d="M14 4h7" />
          <Path d="M14 9h7" />
          <Path d="M14 15h7" />
          <Path d="M14 20h7" />
        </>
      )}
    />
  );
}
