import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Annoyed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M8 15h8" />
          <Path d="M8 9h2" />
          <Path d="M14 9h2" />
        </>
      )}
    />
  );
}
