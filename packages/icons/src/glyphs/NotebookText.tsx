import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function NotebookText(props: IconProps): ReactElement {
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
          <Path d="M9.5 8h5" />
          <Path d="M9.5 12H16" />
          <Path d="M9.5 16H14" />
        </>
      )}
    />
  );
}
