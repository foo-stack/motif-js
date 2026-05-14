import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CaseLower(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10 9v7" />
          <Path d="M14 6v10" />
          <Circle cx="17.5" cy="12.5" r="3.5" />
          <Circle cx="6.5" cy="12.5" r="3.5" />
        </>
      )}
    />
  );
}
