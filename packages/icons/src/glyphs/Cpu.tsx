import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Cpu(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 20v2" />
          <Path d="M12 2v2" />
          <Path d="M17 20v2" />
          <Path d="M17 2v2" />
          <Path d="M2 12h2" />
          <Path d="M2 17h2" />
          <Path d="M2 7h2" />
          <Path d="M20 12h2" />
          <Path d="M20 17h2" />
          <Path d="M20 7h2" />
          <Path d="M7 20v2" />
          <Path d="M7 2v2" />
          <Rect x="4" y="4" width="16" height="16" rx="2" />
          <Rect x="8" y="8" width="8" height="8" rx="1" />
        </>
      )}
    />
  );
}
