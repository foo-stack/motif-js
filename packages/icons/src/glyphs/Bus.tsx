import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Bus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M8 6v6" />
          <Path d="M15 6v6" />
          <Path d="M2 12h19.6" />
          <Path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
          <Circle cx="7" cy="18" r="2" />
          <Path d="M9 18h5" />
          <Circle cx="16" cy="18" r="2" />
        </>
      )}
    />
  );
}
