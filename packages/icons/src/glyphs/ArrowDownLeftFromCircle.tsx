import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowDownLeftFromCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 12a10 10 0 1 1 10 10" />
          <Path d="m2 22 10-10" />
          <Path d="M8 22H2v-6" />
        </>
      )}
    />
  );
}
