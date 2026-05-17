import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function AtSign(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="4" />
          <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
        </>
      )}
    />
  );
}
