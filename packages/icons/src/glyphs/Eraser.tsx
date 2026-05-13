import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Eraser(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
          <Path d="m5.082 11.09 8.828 8.828" />
        </>
      )}
    />
  );
}
