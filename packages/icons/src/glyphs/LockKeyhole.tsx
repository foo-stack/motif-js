import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LockKeyhole(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Circle cx="12" cy="16" r="1" />
          <Rect x="3" y="10" width="18" height="12" rx="2" />
          <Path d="M7 10V7a5 5 0 0 1 10 0v3" />
        </>
      )}
    />
  );
}
