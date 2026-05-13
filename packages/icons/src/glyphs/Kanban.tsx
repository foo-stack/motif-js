import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Kanban(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 3v14" />
          <Path d="M12 3v8" />
          <Path d="M19 3v18" />
        </>
      )}
    />
  );
}
