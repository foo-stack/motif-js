import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ShipWheel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="8" />
          <Path d="M12 2v7.5" />
          <Path d="m19 5-5.23 5.23" />
          <Path d="M22 12h-7.5" />
          <Path d="m19 19-5.23-5.23" />
          <Path d="M12 14.5V22" />
          <Path d="M10.23 13.77 5 19" />
          <Path d="M9.5 12H2" />
          <Path d="M10.23 10.23 5 5" />
          <Circle cx="12" cy="12" r="2.5" />
        </>
      )}
    />
  );
}
