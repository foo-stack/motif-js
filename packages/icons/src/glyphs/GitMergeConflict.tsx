import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitMergeConflict(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 6h4a2 2 0 0 1 2 2v7" />
          <Path d="M6 12v9" />
          <Path d="M9 3 3 9" />
          <Path d="M9 9 3 3" />
          <Circle cx="18" cy="18" r="3" />
        </>
      )}
    />
  );
}
