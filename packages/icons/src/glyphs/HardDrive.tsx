import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function HardDrive(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 16h.01" />
          <Path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          <Path d="M21.946 12.013H2.054" />
          <Path d="M6 16h.01" />
        </>
      )}
    />
  );
}
