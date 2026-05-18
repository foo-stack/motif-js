import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function StretchHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect width="20" height="6" x="2" y="4" rx="2" />
          <Rect width="20" height="6" x="2" y="14" rx="2" />
        </>
      )}
    />
  );
}
