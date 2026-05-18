import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChartNetwork(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m13.11 7.664 1.78 2.672" />
          <Path d="m14.162 12.788-3.324 1.424" />
          <Path d="m20 4-6.06 1.515" />
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Circle cx="12" cy="6" r="2" />
          <Circle cx="16" cy="12" r="2" />
          <Circle cx="9" cy="15" r="2" />
        </>
      )}
    />
  );
}
