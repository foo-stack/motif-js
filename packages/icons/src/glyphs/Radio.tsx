import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Radio(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M16.247 7.761a6 6 0 0 1 0 8.478" />
          <Path d="M19.075 4.933a10 10 0 0 1 0 14.134" />
          <Path d="M4.925 19.067a10 10 0 0 1 0-14.134" />
          <Path d="M7.753 16.239a6 6 0 0 1 0-8.478" />
          <Circle cx="12" cy="12" r="2" />
        </>
      )}
    />
  );
}
