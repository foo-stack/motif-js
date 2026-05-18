import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Images(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" />
          <Path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
          <Circle cx="13" cy="7" r="1" fill="currentColor" />
          <Rect x="8" y="2" width="14" height="14" rx="2" />
        </>
      )}
    />
  );
}
