import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Popsicle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z" />
          <Path d="m22 22-5.5-5.5" />
        </>
      )}
    />
  );
}
