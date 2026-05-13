import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ToggleLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Rect }) => (
        <>
          <Circle cx="9" cy="12" r="3" />
          <Rect width="20" height="14" x="2" y="5" rx="7" />
        </>
      )}
    />
  );
}
