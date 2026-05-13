import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GitPullRequestCreateArrow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="5" cy="6" r="3" />
          <Path d="M5 9v12" />
          <Path d="m15 9-3-3 3-3" />
          <Path d="M12 6h5a2 2 0 0 1 2 2v3" />
          <Path d="M19 15v6" />
          <Path d="M22 18h-6" />
        </>
      )}
    />
  );
}
