import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BanknoteArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
          <Path d="m16 19 3 3 3-3" />
          <Path d="M18 12h.01" />
          <Path d="M19 16v6" />
          <Path d="M6 12h.01" />
          <Circle cx="12" cy="12" r="2" />
        </>
      )}
    />
  );
}
