import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function StretchVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect width="6" height="20" x="4" y="2" rx="2" />
          <Rect width="6" height="20" x="14" y="2" rx="2" />
        </>
      )}
    />
  );
}
