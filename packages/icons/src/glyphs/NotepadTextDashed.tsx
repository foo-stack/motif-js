import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function NotepadTextDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 2v4" />
          <Path d="M12 2v4" />
          <Path d="M16 2v4" />
          <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
          <Path d="M20 12v2" />
          <Path d="M20 18v2a2 2 0 0 1-2 2h-1" />
          <Path d="M13 22h-2" />
          <Path d="M7 22H6a2 2 0 0 1-2-2v-2" />
          <Path d="M4 14v-2" />
          <Path d="M4 8V6a2 2 0 0 1 2-2h2" />
          <Path d="M8 10h6" />
          <Path d="M8 14h8" />
          <Path d="M8 18h5" />
        </>
      )}
    />
  );
}
