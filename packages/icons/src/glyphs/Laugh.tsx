import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Laugh(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" />
          <Line x1="9" x2="9.01" y1="9" y2="9" />
          <Line x1="15" x2="15.01" y1="9" y2="9" />
        </>
      )}
    />
  );
}
