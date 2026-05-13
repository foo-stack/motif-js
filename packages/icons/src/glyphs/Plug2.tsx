import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Plug2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M9 2v6" />
          <Path d="M15 2v6" />
          <Path d="M12 17v5" />
          <Path d="M5 8h14" />
          <Path d="M6 11V8h12v3a6 6 0 1 1-12 0Z" />
        </>
      )}
    />
  );
}
