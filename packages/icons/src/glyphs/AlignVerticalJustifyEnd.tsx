import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function AlignVerticalJustifyEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="14" height="6" x="5" y="12" rx="2" />
          <Rect width="10" height="6" x="7" y="2" rx="2" />
          <Path d="M2 22h20" />
        </>
      )}
    />
  );
}
