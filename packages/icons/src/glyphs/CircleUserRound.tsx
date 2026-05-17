import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CircleUserRound(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M17.925 20.056a6 6 0 0 0-11.851.001" />
          <Circle cx="12" cy="11" r="4" />
          <Circle cx="12" cy="12" r="10" />
        </>
      )}
    />
  );
}
