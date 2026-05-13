import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function WholeWord(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="7" cy="12" r="3" />
          <Path d="M10 9v6" />
          <Circle cx="17" cy="12" r="3" />
          <Path d="M14 7v8" />
          <Path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
        </>
      )}
    />
  );
}
