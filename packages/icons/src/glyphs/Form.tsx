import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Form(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M4 14h6" />
          <Path d="M4 2h10" />
          <Rect x="4" y="18" width="16" height="4" rx="1" />
          <Rect x="4" y="6" width="16" height="4" rx="1" />
        </>
      )}
    />
  );
}
