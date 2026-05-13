import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Hourglass(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 22h14" />
          <Path d="M5 2h14" />
          <Path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <Path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </>
      )}
    />
  );
}
