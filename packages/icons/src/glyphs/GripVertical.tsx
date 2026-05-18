import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function GripVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="9" cy="12" r="1" />
          <Circle cx="9" cy="5" r="1" />
          <Circle cx="9" cy="19" r="1" />
          <Circle cx="15" cy="12" r="1" />
          <Circle cx="15" cy="5" r="1" />
          <Circle cx="15" cy="19" r="1" />
        </>
      )}
    />
  );
}
