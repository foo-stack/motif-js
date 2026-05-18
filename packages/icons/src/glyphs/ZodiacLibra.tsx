import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ZodiacLibra(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 16h6.857c.162-.012.19-.323.038-.38a6 6 0 1 1 4.212 0c-.153.057-.125.368.038.38H21" />
          <Path d="M3 20h18" />
        </>
      )}
    />
  );
}
