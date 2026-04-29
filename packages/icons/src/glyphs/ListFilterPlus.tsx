import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListFilterPlus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 5H2" />
          <Path d="M6 12h12" />
          <Path d="M9 19h6" />
          <Path d="M16 5h6" />
          <Path d="M19 8V2" />
        </>
      )}
    />
  );
}
