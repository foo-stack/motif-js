import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TableCellsMerge(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 21v-6" />
          <Path d="M12 9V3" />
          <Path d="M3 15h18" />
          <Path d="M3 9h18" />
          <Rect width="18" height="18" x="3" y="3" rx="2" />
        </>
      )}
    />
  );
}
