import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function NonBinary(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 2v10" />
          <Path d="m8.5 4 7 4" />
          <Path d="m8.5 8 7-4" />
          <Circle cx="12" cy="17" r="5" />
        </>
      )}
    />
  );
}
