import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Contact2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M16 2v2" />
          <Path d="M17.915 22a6 6 0 0 0-12 0" />
          <Path d="M8 2v2" />
          <Circle cx="12" cy="12" r="4" />
          <Rect x="3" y="4" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}
