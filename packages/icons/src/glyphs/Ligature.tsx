import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Ligature(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14 12h2v8" />
          <Path d="M14 20h4" />
          <Path d="M6 12h4" />
          <Path d="M6 20h4" />
          <Path d="M8 20V8a4 4 0 0 1 7.464-2" />
        </>
      )}
    />
  );
}
