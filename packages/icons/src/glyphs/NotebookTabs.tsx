import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function NotebookTabs(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M2 6h4" />
          <Path d="M2 10h4" />
          <Path d="M2 14h4" />
          <Path d="M2 18h4" />
          <Rect width="16" height="20" x="4" y="2" rx="2" />
          <Path d="M15 2v20" />
          <Path d="M15 7h5" />
          <Path d="M15 12h5" />
          <Path d="M15 17h5" />
        </>
      )}
    />
  );
}
