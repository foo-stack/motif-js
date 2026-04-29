import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BanknoteX(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
          <Path d="m17 17 5 5" />
          <Path d="M18 12h.01" />
          <Path d="m22 17-5 5" />
          <Path d="M6 12h.01" />
          <Circle cx="12" cy="12" r="2" />
        </>
      )}
    />
  );
}
