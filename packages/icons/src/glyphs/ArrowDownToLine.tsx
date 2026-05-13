import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowDownToLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 17V3" />
          <Path d="m6 11 6 6 6-6" />
          <Path d="M19 21H5" />
        </>
      )}
    />
  );
}
