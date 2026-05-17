import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FoldHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 12h6" />
          <Path d="M22 12h-6" />
          <Path d="M12 2v2" />
          <Path d="M12 8v2" />
          <Path d="M12 14v2" />
          <Path d="M12 20v2" />
          <Path d="m19 9-3 3 3 3" />
          <Path d="m5 15 3-3-3-3" />
        </>
      )}
    />
  );
}
