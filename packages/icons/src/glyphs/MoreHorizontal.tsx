import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MoreHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="12" cy="12" r="1" />
          <Circle cx="19" cy="12" r="1" />
          <Circle cx="5" cy="12" r="1" />
        </>
      )}
    />
  );
}
