import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Shapes(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
          <Rect x="3" y="14" width="7" height="7" rx="1" />
          <Circle cx="17.5" cy="17.5" r="3.5" />
        </>
      )}
    />
  );
}
