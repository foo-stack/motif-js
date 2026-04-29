import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RadioOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13.414 13.414a2 2 0 1 1-2.828-2.828" />
          <Path d="M16.247 7.761a6 6 0 0 1 1.744 4.572" />
          <Path d="M19.075 4.933a10 10 0 0 1 2.234 10.72" />
          <Path d="m2 2 20 20" />
          <Path d="M4.925 19.067a10 10 0 0 1 0-14.134" />
          <Path d="M7.753 16.239a6 6 0 0 1 0-8.478" />
        </>
      )}
    />
  );
}
