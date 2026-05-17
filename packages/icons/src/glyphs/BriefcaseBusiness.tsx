import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function BriefcaseBusiness(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 12h.01" />
          <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <Path d="M22 13a18.15 18.15 0 0 1-20 0" />
          <Rect width="20" height="14" x="2" y="6" rx="2" />
        </>
      )}
    />
  );
}
