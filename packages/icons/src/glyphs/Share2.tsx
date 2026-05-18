import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Share2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="18" cy="5" r="3" />
          <Circle cx="6" cy="12" r="3" />
          <Circle cx="18" cy="19" r="3" />
          <Line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <Line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </>
      )}
    />
  );
}
