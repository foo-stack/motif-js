import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowDownToDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 2v14" />
          <Path d="m19 9-7 7-7-7" />
          <Circle cx="12" cy="21" r="1" />
        </>
      )}
    />
  );
}
