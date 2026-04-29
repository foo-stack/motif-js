import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Contact(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M16 2v2" />
          <Path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <Path d="M8 2v2" />
          <Circle cx="12" cy="11" r="3" />
          <Rect x="3" y="4" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}
