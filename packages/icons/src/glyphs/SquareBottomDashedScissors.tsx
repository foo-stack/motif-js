import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquareBottomDashedScissors(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line, Path }) => (
        <>
          <Line x1="5" y1="3" x2="19" y2="3" />
          <Line x1="3" y1="5" x2="3" y2="19" />
          <Line x1="21" y1="5" x2="21" y2="19" />
          <Line x1="9" y1="21" x2="10" y2="21" />
          <Line x1="14" y1="21" x2="15" y2="21" />
          <Path d="M 3 5 A2 2 0 0 1 5 3" />
          <Path d="M 19 3 A2 2 0 0 1 21 5" />
          <Path d="M 5 21 A2 2 0 0 1 3 19" />
          <Path d="M 21 19 A2 2 0 0 1 19 21" />
          <Circle cx="8.5" cy="8.5" r="1.5" />
          <Line x1="9.56066" y1="9.56066" x2="12" y2="12" />
          <Line x1="17" y1="17" x2="14.82" y2="14.82" />
          <Circle cx="8.5" cy="15.5" r="1.5" />
          <Line x1="9.56066" y1="14.43934" x2="17" y2="7" />
        </>
      )}
    />
  );
}
