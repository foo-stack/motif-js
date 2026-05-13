import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GripHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="12" cy="9" r="1" />
          <Circle cx="19" cy="9" r="1" />
          <Circle cx="5" cy="9" r="1" />
          <Circle cx="12" cy="15" r="1" />
          <Circle cx="19" cy="15" r="1" />
          <Circle cx="5" cy="15" r="1" />
        </>
      )}
    />
  );
}
