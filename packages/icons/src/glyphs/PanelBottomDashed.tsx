import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PanelBottomDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M14 15h1" />
          <Path d="M19 15h2" />
          <Path d="M3 15h2" />
          <Path d="M9 15h1" />
        </>
      )}
    />
  );
}
