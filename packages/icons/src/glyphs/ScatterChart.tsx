import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ScatterChart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
          <Circle cx="18.5" cy="5.5" r=".5" fill="currentColor" />
          <Circle cx="11.5" cy="11.5" r=".5" fill="currentColor" />
          <Circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
          <Circle cx="17.5" cy="14.5" r=".5" fill="currentColor" />
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
        </>
      )}
    />
  );
}
