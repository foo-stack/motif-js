import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Spool(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 13.44 4.442 17.082A2 2 0 0 0 4.982 21H19a2 2 0 0 0 .558-3.921l-1.115-.32A2 2 0 0 1 17 14.837V7.66" />
          <Path d="m7 10.56 12.558-3.642A2 2 0 0 0 19.018 3H5a2 2 0 0 0-.558 3.921l1.115.32A2 2 0 0 1 7 9.163v7.178" />
        </>
      )}
    />
  );
}
