import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SearchAlert(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="11" cy="11" r="8" />
          <Path d="m21 21-4.3-4.3" />
          <Path d="M11 7v4" />
          <Path d="M11 15h.01" />
        </>
      )}
    />
  );
}
