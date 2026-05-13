import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CirclePile(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="12" cy="19" r="2" />
          <Circle cx="12" cy="5" r="2" />
          <Circle cx="16" cy="12" r="2" />
          <Circle cx="20" cy="19" r="2" />
          <Circle cx="4" cy="19" r="2" />
          <Circle cx="8" cy="12" r="2" />
        </>
      )}
    />
  );
}
