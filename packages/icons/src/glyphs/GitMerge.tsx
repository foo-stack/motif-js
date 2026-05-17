import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function GitMerge(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="18" cy="18" r="3" />
          <Circle cx="6" cy="6" r="3" />
          <Path d="M6 21V9a9 9 0 0 0 9 9" />
        </>
      )}
    />
  );
}
