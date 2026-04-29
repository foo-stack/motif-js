import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Voicemail(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="6" cy="12" r="4" />
          <Circle cx="18" cy="12" r="4" />
          <Line x1="6" x2="18" y1="16" y2="16" />
        </>
      )}
    />
  );
}
