import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Bandage(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 10.01h.01" />
          <Path d="M10 14.01h.01" />
          <Path d="M14 10.01h.01" />
          <Path d="M14 14.01h.01" />
          <Path d="M18 6v12" />
          <Path d="M6 6v12" />
          <Rect x="2" y="6" width="20" height="12" rx="2" />
        </>
      )}
    />
  );
}
