import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PanelTopBottomDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M14 15h1" />
          <Path d="M14 9h1" />
          <Path d="M19 15h2" />
          <Path d="M19 9h2" />
          <Path d="M3 15h2" />
          <Path d="M3 9h2" />
          <Path d="M9 15h1" />
          <Path d="M9 9h1" />
          <Rect x="3" y="3" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}
