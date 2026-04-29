import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitCommitVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 3v6" />
          <Circle cx="12" cy="12" r="3" />
          <Path d="M12 15v6" />
        </>
      )}
    />
  );
}
