import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function GitPullRequestCreate(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="6" cy="6" r="3" />
          <Path d="M6 9v12" />
          <Path d="M13 6h3a2 2 0 0 1 2 2v3" />
          <Path d="M18 15v6" />
          <Path d="M21 18h-6" />
        </>
      )}
    />
  );
}
