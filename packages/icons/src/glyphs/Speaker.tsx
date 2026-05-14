import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Speaker(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Rect width="16" height="20" x="4" y="2" rx="2" />
          <Path d="M12 6h.01" />
          <Circle cx="12" cy="14" r="4" />
          <Path d="M12 14h.01" />
        </>
      )}
    />
  );
}
