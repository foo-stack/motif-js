import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BriefcaseMedical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 11v4" />
          <Path d="M14 13h-4" />
          <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <Path d="M18 6v14" />
          <Path d="M6 6v14" />
          <Rect width="20" height="14" x="2" y="6" rx="2" />
        </>
      )}
    />
  );
}
