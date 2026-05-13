import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ShelvingUnit(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 12V9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
          <Path d="M16 20v-3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" />
          <Path d="M20 22V2" />
          <Path d="M4 12h16" />
          <Path d="M4 20h16" />
          <Path d="M4 2v20" />
          <Path d="M4 4h16" />
        </>
      )}
    />
  );
}
