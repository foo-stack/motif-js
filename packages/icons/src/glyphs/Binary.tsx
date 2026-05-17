import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Binary(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="14" y="14" width="4" height="6" rx="2" />
          <Rect x="6" y="4" width="4" height="6" rx="2" />
          <Path d="M6 20h4" />
          <Path d="M14 10h4" />
          <Path d="M6 14h2v6" />
          <Path d="M14 4h2v6" />
        </>
      )}
    />
  );
}
