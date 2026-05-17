import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Ungroup(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect width="8" height="6" x="5" y="4" rx="1" />
          <Rect width="8" height="6" x="11" y="14" rx="1" />
        </>
      )}
    />
  );
}
