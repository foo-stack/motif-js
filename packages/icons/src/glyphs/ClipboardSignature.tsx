import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ClipboardSignature(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="8" height="4" x="8" y="2" rx="1" />
          <Path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" />
          <Path d="M16 4h2a2 2 0 0 1 1.73 1" />
          <Path d="M8 18h1" />
          <Path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
        </>
      )}
    />
  );
}
