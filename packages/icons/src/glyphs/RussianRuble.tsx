import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RussianRuble(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 11h8a4 4 0 0 0 0-8H9v18" />
          <Path d="M6 15h8" />
        </>
      )}
    />
  );
}
