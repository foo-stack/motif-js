import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function HandCoins(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
          <Path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
          <Path d="m2 16 6 6" />
          <Circle cx="16" cy="9" r="2.9" />
          <Circle cx="6" cy="5" r="3" />
        </>
      )}
    />
  );
}
