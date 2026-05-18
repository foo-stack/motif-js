import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function WalletCards(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
          <Path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
        </>
      )}
    />
  );
}
