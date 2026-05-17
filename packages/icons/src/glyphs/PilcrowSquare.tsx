import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function PilcrowSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M12 12H9.5a2.5 2.5 0 0 1 0-5H17" />
          <Path d="M12 7v10" />
          <Path d="M16 7v10" />
        </>
      )}
    />
  );
}
