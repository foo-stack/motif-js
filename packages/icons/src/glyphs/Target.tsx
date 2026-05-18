import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Target(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Circle cx="12" cy="12" r="6" />
          <Circle cx="12" cy="12" r="2" />
        </>
      )}
    />
  );
}
