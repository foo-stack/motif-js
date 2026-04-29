import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Info(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 16v-4" />
          <Path d="M12 8h.01" />
        </>
      )}
    />
  );
}
