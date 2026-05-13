import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleStop(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Rect }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Rect x="9" y="9" width="6" height="6" rx="1" />
        </>
      )}
    />
  );
}
