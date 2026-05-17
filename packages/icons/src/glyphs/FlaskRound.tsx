import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FlaskRound(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 2v6.292a7 7 0 1 0 4 0V2" />
          <Path d="M5 15h14" />
          <Path d="M8.5 2h7" />
        </>
      )}
    />
  );
}
