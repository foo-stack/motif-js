import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GitCommit(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="12" r="3" />
          <Line x1="3" x2="9" y1="12" y2="12" />
          <Line x1="15" x2="21" y1="12" y2="12" />
        </>
      )}
    />
  );
}
