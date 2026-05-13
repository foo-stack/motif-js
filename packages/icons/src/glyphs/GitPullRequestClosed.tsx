import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GitPullRequestClosed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="6" cy="6" r="3" />
          <Path d="M6 9v12" />
          <Path d="m21 3-6 6" />
          <Path d="m21 9-6-6" />
          <Path d="M18 11.5V15" />
          <Circle cx="18" cy="18" r="3" />
        </>
      )}
    />
  );
}
