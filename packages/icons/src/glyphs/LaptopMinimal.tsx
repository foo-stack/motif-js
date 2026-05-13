import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LaptopMinimal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
          <Line x1="2" x2="22" y1="20" y2="20" />
        </>
      )}
    />
  );
}
