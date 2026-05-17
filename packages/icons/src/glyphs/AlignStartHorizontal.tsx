import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function AlignStartHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="6" height="16" x="4" y="6" rx="2" />
          <Rect width="6" height="9" x="14" y="6" rx="2" />
          <Path d="M22 2H2" />
        </>
      )}
    />
  );
}
