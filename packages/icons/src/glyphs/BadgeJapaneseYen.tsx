import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BadgeJapaneseYen(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <Path d="m9 8 3 3v7" />
          <Path d="m12 11 3-3" />
          <Path d="M9 12h6" />
          <Path d="M9 16h6" />
        </>
      )}
    />
  );
}
