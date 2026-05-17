import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ClipboardPaste(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M11 14h10" />
          <Path d="M16 4h2a2 2 0 0 1 2 2v1.344" />
          <Path d="m17 18 4-4-4-4" />
          <Path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113" />
          <Rect x="8" y="2" width="8" height="4" rx="1" />
        </>
      )}
    />
  );
}
