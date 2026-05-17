import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Mouse(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="5" y="2" width="14" height="20" rx="7" />
          <Path d="M12 6v4" />
        </>
      )}
    />
  );
}
