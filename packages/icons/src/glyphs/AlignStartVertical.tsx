import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlignStartVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="9" height="6" x="6" y="14" rx="2" />
          <Rect width="16" height="6" x="6" y="4" rx="2" />
          <Path d="M2 2v20" />
        </>
      )}
    />
  );
}
